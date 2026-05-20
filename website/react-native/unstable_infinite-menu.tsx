// @ts-check
import React, { useCallback, useMemo, useState, memo, useEffect } from "react";
import { View, StyleSheet, Animated as RNAnimated } from "react-native";
import {
  Canvas,
  Circle,
  Group,
  Image,
  Skia,
  Fill,
  Shader,
  ImageShader,
} from "@shopify/react-native-skia";
import { useSharedValue, useFrameCallback } from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useLoadImages } from "./hooks";
import type { IQuat, IVec3 } from "./maths-type";
import type {
  IDisc,
  IDiscComponent,
  IMenuItem,
  IUnstableInfiniteMenu,
} from "./types";
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
  vec3Cross,
} from "./maths";
import {
  screenWidth,
  screenHeight,
  SPHERE_RADIUS_BASE,
  DISC_BASE_SCALE,
  CAMERA_Z_BASE,
  PROJECTION_SCALE,
} from "./const";
import { discShader } from "./conf";
import { scheduleOnRN } from "react-native-worklets";

const DiscComponent: React.FC<IDiscComponent> = memo<IDiscComponent>(
  ({
    x,
    y,
    radius,
    alpha,
    stretchAmount,
    stretchAngle,
    image,
  }: IDiscComponent):
    | (React.ReactNode & React.JSX.Element & React.ReactElement)
    | null => {
    if (radius < 1) return null;

    const stretchScale = 1 + stretchAmount;
    const shrinkScale = 1 / stretchScale;

    if (!image) {
      return (
        <Group
          transform={[
            { translateX: x },
            { translateY: y },
            { rotate: stretchAngle },
            { scaleX: stretchScale },
            { scaleY: shrinkScale },
            { rotate: -stretchAngle },
            { translateX: -x },
            { translateY: -y },
          ]}
          opacity={alpha}
        >
          <Circle cx={x} cy={y} r={radius} color="rgba(80, 80, 80, 1)" />
        </Group>
      );
    }

    const clipPath = Skia.Path.Make();
    clipPath.addCircle(x, y, radius);

    if (!discShader) {
      return (
        <Group
          transform={[
            { translateX: x },
            { translateY: y },
            { rotate: stretchAngle },
            { scaleX: stretchScale },
            { scaleY: shrinkScale },
            { rotate: -stretchAngle },
            { translateX: -x },
            { translateY: -y },
          ]}
          opacity={alpha}
        >
          <Group clip={clipPath}>
            <Image
              image={image}
              x={x - radius}
              y={y - radius}
              width={radius * 2}
              height={radius * 2}
              fit="cover"
            />
          </Group>
        </Group>
      );
    }

    const stretchDirX = Math.cos(stretchAngle);
    const stretchDirY = Math.sin(stretchAngle);

    const uniforms = {
      resolution: [radius * 2, radius * 2],
      alpha: alpha,
      stretchAmount: stretchAmount,
      stretchDir: [stretchDirX, stretchDirY],
    };

    return (
      <Group
        transform={[
          { translateX: x },
          { translateY: y },
          { rotate: stretchAngle },
          { scaleX: stretchScale },
          { scaleY: shrinkScale },
          { rotate: -stretchAngle },
          { translateX: -x },
          { translateY: -y },
        ]}
      >
        <Group clip={clipPath}>
          <Group
            transform={[{ translateX: x - radius }, { translateY: y - radius }]}
          >
            <Fill>
              <Shader source={discShader} uniforms={uniforms}>
                <ImageShader
                  image={image}
                  fit="cover"
                  x={0}
                  y={0}
                  width={radius * 2}
                  height={radius * 2}
                />
              </Shader>
            </Fill>
          </Group>
        </Group>
      </Group>
    );
  },
);

export const UnstableInfiniteMenu: React.FC<IUnstableInfiniteMenu> &
  React.FunctionComponent<IUnstableInfiniteMenu> = memo<IUnstableInfiniteMenu>(
  ({
    items,
    scale = 1,
    stretchIntensity = 15,
    friction = 0.1,
    snapStrength = 0.2,
    discSize = 1,
    backgroundColor = "black",
  }: IUnstableInfiniteMenu):
    | (React.ReactElement & React.ReactNode & React.JSX.Element)
    | null => {
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

    const SPHERE_RADIUS = SPHERE_RADIUS_BASE * scale;
    const CAMERA_Z = CAMERA_Z_BASE * scale;

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

    const rotAxisX = useSharedValue<number>(1);
    const rotAxisY = useSharedValue<number>(0);
    const rotAxisZ = useSharedValue<number>(0);
    const smoothRotVelocity = useSharedValue<number>(0);

    const fadeAnim = useMemo(() => new RNAnimated.Value(1), []);
    const scaleAnim = useMemo(() => new RNAnimated.Value(1), []);

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

    useFrameCallback((info) => {
      "worklet";
      const dt = info.timeSincePreviousFrame || 16;
      const ts = dt / 16 + 0.0001;
      const IDENTITY: IQuat = { x: 0, y: 0, z: 0, w: 1 };

      const orientation: IQuat = {
        x: qx.value,
        y: qy.value,
        z: qz.value,
        w: qw.value,
      };
      const pointerRot: IQuat = {
        x: prx.value,
        y: pry.value,
        z: prz.value,
        w: prw.value,
      };

      const dampIntensity = friction * ts;
      const dampenedPR = quatSlerp(pointerRot, IDENTITY, dampIntensity);
      prx.value = dampenedPR.x;
      pry.value = dampenedPR.y;
      prz.value = dampenedPR.z;
      prw.value = dampenedPR.w;

      let snapRot: IQuat = IDENTITY;

      if (!isDown.value) {
        const snapDir: IVec3 = { x: 0, y: 0, z: -1 };
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
        const snapIntensity = snapStrength * ts * distFactor;
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
      const s = Math.sin(rad / 2);
      let rv = 0;
      if (s > 0.000001) {
        rv = rad / (2 * Math.PI);
        rotAxisX.value = combined.x / s;
        rotAxisY.value = combined.y / s;
        rotAxisZ.value = combined.z / s;
      }

      const RV_INTENSITY = 0.5 * ts;
      smoothRotVelocity.value += (rv - smoothRotVelocity.value) * RV_INTENSITY;
      rotVelocity.value = smoothRotVelocity.value / ts;

      const targetZ = isDown.value
        ? CAMERA_Z + rotVelocity.value * 80 + 2.5
        : CAMERA_Z;
      const damping = isDown.value ? 7 / ts : 5 / ts;
      camZ.value += (targetZ - camZ.value) / damping;

      const moving = isDown.value || Math.abs(smoothRotVelocity.value) > 0.01;
      scheduleOnRN(updateIsMoving, moving);

      const discs: IDisc[] = [];
      const currentCamZ = camZ.value;
      const itemLen = Math.max(1, items.length);
      const currentRotVel = Math.min(
        0.15,
        smoothRotVelocity.value * stretchIntensity,
      );
      const rotAxis: IVec3 = {
        x: rotAxisX.value,
        y: rotAxisY.value,
        z: rotAxisZ.value,
      };

      for (let i = 0; i < verticesRef.length; i++) {
        const v = verticesRef[i];
        const worldPos = quatRotateVec3(newOrientation, v);

        const stretchDir = vec3Cross(worldPos, rotAxis);
        const stretchLen = Math.sqrt(
          stretchDir.x * stretchDir.x +
            stretchDir.y * stretchDir.y +
            stretchDir.z * stretchDir.z,
        );

        let stretchAngle = 0;
        if (stretchLen > 0.001) {
          const normStretchDir = {
            x: stretchDir.x / stretchLen,
            y: stretchDir.y / stretchLen,
            z: stretchDir.z / stretchLen,
          };
          stretchAngle = Math.atan2(normStretchDir.y, normStretchDir.x);
        }

        const perspective = currentCamZ / (currentCamZ - worldPos.z);
        const sx = centerX + worldPos.x * perspective * PROJECTION_SCALE;
        const sy = centerY - worldPos.y * perspective * PROJECTION_SCALE;

        const zFactor = (Math.abs(worldPos.z) / SPHERE_RADIUS) * 0.6 + 0.4;
        const baseRadius =
          zFactor * DISC_BASE_SCALE * discSize * perspective * PROJECTION_SCALE;

        const normalizedZ = worldPos.z / SPHERE_RADIUS;
        const alpha = (normalizedZ * 0.5 + 0.5) * 0.9 + 0.1;

        discs.push({
          screenX: sx,
          screenY: sy,
          radius: baseRadius,
          alpha: Math.max(0.1, Math.min(1, alpha)),
          z: worldPos.z,
          itemIndex: i % itemLen,
          stretchAmount: currentRotVel,
          stretchAngle: stretchAngle,
        });
      }

      discs.sort((a, b) => a.z - b.z);
      scheduleOnRN(updateDiscData, discs);
    });

    const panGesture = Gesture.Pan()
      .minDistance(1)
      .onStart((e) => {
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
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.container}>
          <GestureDetector gesture={panGesture}>
            <Canvas style={[styles.canvas, { backgroundColor }]}>
              <Fill color={backgroundColor} />
              {discData.map((disc, idx) => (
                <DiscComponent
                  key={`disc-${idx}`}
                  x={disc.screenX}
                  y={disc.screenY}
                  radius={disc.radius}
                  alpha={disc.alpha}
                  stretchAmount={disc.stretchAmount}
                  stretchAngle={disc.stretchAngle}
                  image={loadedImages[disc.itemIndex] || null}
                />
              ))}
            </Canvas>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  canvas: {
    flex: 1,
    backgroundColor: "#000000",
  },
  titleContainer: {
    position: "absolute",
    left: 24,
    top: "50%",
    marginTop: -30,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#fff",
  },
  descriptionContainer: {
    position: "absolute",
    right: 24,
    top: "50%",
    marginTop: -30,
    maxWidth: 120,
  },
  description: {
    fontSize: 14,
    color: "#fff",
    textAlign: "right",
  },
  actionButtonContainer: {
    position: "absolute",
    bottom: 50,
    left: "50%",
    marginLeft: -30,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#00ffff",
    borderWidth: 4,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 24,
    color: "#060010",
    fontWeight: "bold",
  },
});

export default UnstableInfiniteMenu;

export type {
  IDisc,
  IDiscComponent,
  IMenuItem,
  IUnstableInfiniteMenu,
} from "./types";
