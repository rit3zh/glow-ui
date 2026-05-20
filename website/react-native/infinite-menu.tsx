// @ts-check
import React, { useCallback, useMemo, useState, memo, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated as RNAnimated,
} from "react-native";
import { Canvas, Circle, Group, Image, Skia } from "@shopify/react-native-skia";
import { useSharedValue, useFrameCallback } from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useLoadImages } from "./hooks";
import { Quat, Vec3 } from "./maths-type";
import type { IDisc, IDiscComponent, IInfiniteMenu, IMenuItem } from "./types";
import { generateIcosahedronVertices } from "./helpers";
import {
  projectToSphere,
  quatConjugate,
  quatFromVectors,
  quatMultiply,
  quatNormalize,
  quatRotateVec3,
  quatSlerp,
  vec3Normalize,
} from "./maths";
import { scheduleOnRN } from "react-native-worklets";

const DiscComponent: React.FC<IDiscComponent> = memo<IDiscComponent>(
  ({
    x,
    y,
    radius,
    alpha,
    image,
  }: IDiscComponent): React.ReactElement | null => {
    const clipPath = useMemo(() => {
      const path = Skia.Path.Make();
      path.addCircle(x, y, radius);
      return path;
    }, [x, y, radius]);

    if (radius < 1) return null;

    if (!image) {
      return (
        <Circle cx={x} cy={y} r={radius} color={`rgba(80, 80, 80, ${alpha})`} />
      );
    }

    return (
      <Group clip={clipPath} opacity={alpha}>
        <Image
          image={image}
          x={x - radius}
          y={y - radius}
          width={radius * 2}
          height={radius * 2}
          fit="cover"
        />
      </Group>
    );
  },
);

export const InfiniteMenu: React.FC<IInfiniteMenu> &
  React.FunctionComponent<IInfiniteMenu> = memo<IInfiniteMenu>(
  ({ items, scale = 1, backgroundColor = "#000000", style }: IInfiniteMenu) => {
    const { width: screenWidth, height: screenHeight } =
      Dimensions.get("window");
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;

    const imageUrls = useMemo(
      () => items.map<string>((item) => item.image),
      [items],
    );
    const loadedImages = useLoadImages<string[]>(imageUrls);

    const [activeItem, setActiveItem] = useState<IMenuItem | null>(
      items[0] || null,
    );
    const [isMoving, setIsMoving] = useState<boolean>(false);
    const [discData, setDiscData] = useState<IDisc[]>([]);
    const SPHERE_RADIUS = 2 * scale;
    const DISC_BASE_SCALE = 0.25;
    const CAMERA_Z = 3 * scale;
    const PROJECTION_SCALE = 150;
    const sphereVertices = useMemo(
      () => generateIcosahedronVertices(1, SPHERE_RADIUS),
      [SPHERE_RADIUS],
    );

    const verticesRef = useMemo(() => [...sphereVertices], [sphereVertices]);

    const qx = useSharedValue<number>(0);
    const qy = useSharedValue<number>(0);
    const qz = useSharedValue<number>(0);
    const qw = useSharedValue<number>(1);

    const prx = useSharedValue<number>(0);
    const pry = useSharedValue<number>(0);
    const prz = useSharedValue<number>(0);
    const prw = useSharedValue<number>(1);

    const rotVelocity = useSharedValue<number>(0);
    const isDown = useSharedValue<boolean>(false);
    const prevX = useSharedValue<number>(0);
    const prevY = useSharedValue<number>(0);
    const camZ = useSharedValue<number>(CAMERA_Z);
    const activeIdx = useSharedValue<number>(0);

    const updateActiveItem = useCallback(
      (index: number) => {
        if (items.length === 0) return;
        const itemIndex = index % items.length;
        setActiveItem(items[itemIndex]);
      },
      [items],
    );

    const updateIsMoving = useCallback((moving: boolean) => {
      setIsMoving(moving);
    }, []);

    const updateDiscData = useCallback((data: IDisc[]) => {
      setDiscData(data);
    }, []);

    const lastMoving = useSharedValue<boolean>(false);
    const frameSkip = useSharedValue<number>(0);

    useFrameCallback((info) => {
      "worklet";
      const rawDt = info.timeSincePreviousFrame || 16;
      const dt = Math.min(rawDt, 50);
      const ts = dt / 16 + 0.0001;
      const IDENTITY: Quat = { x: 0, y: 0, z: 0, w: 1 };

      const orientation: Quat = {
        x: qx.value,
        y: qy.value,
        z: qz.value,
        w: qw.value,
      };
      const pointerRot: Quat = {
        x: prx.value,
        y: pry.value,
        z: prz.value,
        w: prw.value,
      };

      const dampIntensity = 0.1 * ts;
      const dampenedPR = quatSlerp(pointerRot, IDENTITY, dampIntensity);
      prx.value = dampenedPR.x;
      pry.value = dampenedPR.y;
      prz.value = dampenedPR.z;
      prw.value = dampenedPR.w;

      let snapRot: Quat = IDENTITY;

      if (!isDown.value) {
        const snapDir: Vec3 = { x: 0, y: 0, z: -1 };
        const invOrientation = quatConjugate(orientation);
        const transformedSnapDir = quatRotateVec3(invOrientation, snapDir);

        let maxDot = -Infinity;
        let nearestIdx = 0;

        for (let i = 0; i < verticesRef.length; i++) {
          const v = verticesRef[i];
          const dot =
            transformedSnapDir.x * v.x +
            transformedSnapDir.y * v.y +
            transformedSnapDir.z * v.z;
          if (dot > maxDot) {
            maxDot = dot;
            nearestIdx = i;
          }
        }

        const nearestV = verticesRef[nearestIdx];
        const worldV = quatRotateVec3(orientation, nearestV);
        const targetDir = vec3Normalize(worldV);

        const sqrDist =
          (targetDir.x - snapDir.x) ** 2 +
          (targetDir.y - snapDir.y) ** 2 +
          (targetDir.z - snapDir.z) ** 2;
        const distFactor = Math.max(0.1, 1 - sqrDist * 10);
        const snapIntensity = 0.2 * ts * distFactor;
        snapRot = quatFromVectors(targetDir, snapDir, snapIntensity);

        const itemLen = Math.max(1, items.length);
        const itemIdx = nearestIdx % itemLen;
        if (activeIdx.value !== itemIdx) {
          activeIdx.value = itemIdx;
          scheduleOnRN(updateActiveItem, itemIdx);
        }
      }

      const combined = quatMultiply(snapRot, dampenedPR);
      const newOrientation = quatNormalize(quatMultiply(combined, orientation));
      qx.value = newOrientation.x;
      qy.value = newOrientation.y;
      qz.value = newOrientation.z;
      qw.value = newOrientation.w;

      const rad = Math.acos(Math.min(1, Math.max(-1, combined.w))) * 2;
      const rv = rad / (2 * Math.PI);
      rotVelocity.value += (rv - rotVelocity.value) * 0.5 * ts;

      const targetZ = isDown.value
        ? CAMERA_Z + rotVelocity.value * 80 + 2.5
        : CAMERA_Z;
      const damping = isDown.value ? 7 / ts : 5 / ts;
      camZ.value += (targetZ - camZ.value) / damping;

      const moving = isDown.value || Math.abs(rotVelocity.value) > 0.005;
      if (moving !== lastMoving.value) {
        lastMoving.value = moving;
        scheduleOnRN(updateIsMoving, moving);
      }

      if (!moving && !isDown.value && Math.abs(rotVelocity.value) < 0.001) {
        frameSkip.value++;
        if (frameSkip.value > 5) {
          return;
        }
      } else {
        frameSkip.value = 0;
      }

      const discs: IDisc[] = [];
      const currentCamZ = camZ.value;
      const itemLen = Math.max(1, items.length);

      for (let i = 0; i < verticesRef.length; i++) {
        const v = verticesRef[i];
        const worldPos = quatRotateVec3(newOrientation, v);

        const perspective = currentCamZ / (currentCamZ - worldPos.z);
        const sx = centerX + worldPos.x * perspective * PROJECTION_SCALE;
        const sy = centerY - worldPos.y * perspective * PROJECTION_SCALE;

        const zFactor = (Math.abs(worldPos.z) / SPHERE_RADIUS) * 0.6 + 0.4;
        const baseRadius =
          zFactor * DISC_BASE_SCALE * perspective * PROJECTION_SCALE;

        const alpha = Math.max(0.1, (worldPos.z / SPHERE_RADIUS) * 0.45 + 0.55);

        discs.push({
          screenX: sx,
          screenY: sy,
          radius: baseRadius,
          alpha: alpha,
          z: worldPos.z,
          itemIndex: i % itemLen,
        });
      }
      discs.sort((a, b) => a.z - b.z);
      scheduleOnRN(updateDiscData, discs);
    });

    const panGesture = Gesture.Pan()
      .onBegin((e) => {
        "worklet";
        prevX.value = e.x;
        prevY.value = e.y;
        isDown.value = true;
      })
      .onUpdate((e) => {
        "worklet";
        const intensity = 0.3;
        const amplification = 5;

        const midX = prevX.value + (e.x - prevX.value) * intensity;
        const midY = prevY.value + (e.y - prevY.value) * intensity;

        const dx = midX - prevX.value;
        const dy = midY - prevY.value;

        if (dx * dx + dy * dy > 0.1) {
          const p = projectToSphere(midX, midY);
          const q = projectToSphere(prevX.value, prevY.value);
          const newRot = quatFromVectors(p, q, amplification);

          prx.value = newRot.x;
          pry.value = newRot.y;
          prz.value = newRot.z;
          prw.value = newRot.w;

          prevX.value = midX;
          prevY.value = midY;
        }
      })
      .onEnd(() => {
        "worklet";
        isDown.value = false;
      })
      .onFinalize(() => {
        "worklet";
        isDown.value = false;
      });

    const fadeAnim = useMemo<RNAnimated.Value>(
      () => new RNAnimated.Value(1),
      [],
    );
    const scaleAnim = useMemo<RNAnimated.Value>(
      () => new RNAnimated.Value(1),
      [],
    );

    useEffect(() => {
      RNAnimated.parallel([
        RNAnimated.timing(fadeAnim, {
          toValue: isMoving ? 0 : 1,
          duration: isMoving ? 100 : 500,
          useNativeDriver: true,
        }),
        RNAnimated.timing(scaleAnim, {
          toValue: isMoving ? 0 : 1,
          duration: isMoving ? 100 : 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, [isMoving, fadeAnim, scaleAnim]);

    return (
      <GestureHandlerRootView
        style={[
          styles.container,
          {
            backgroundColor,
          },
          style,
        ]}
      >
        <GestureDetector gesture={panGesture}>
          <Canvas style={styles.canvas}>
            {discData.map((disc, idx) => (
              <DiscComponent
                key={`disc-${idx}`}
                x={disc.screenX}
                y={disc.screenY}
                radius={disc.radius}
                alpha={disc.alpha}
                image={loadedImages[disc.itemIndex] || null}
              />
            ))}
          </Canvas>
        </GestureDetector>
      </GestureHandlerRootView>
    );
  },
);

const styles = StyleSheet.create({
  container: {},
  canvas: {
    flex: 1,
  },
});

export default memo<
  React.FC<IInfiniteMenu> & React.FunctionComponent<IInfiniteMenu>
>(InfiniteMenu);

export type { IMenuItem, IInfiniteMenu, IDisc, IDiscComponent };
