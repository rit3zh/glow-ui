// @ts-check
import React, { useCallback, useMemo, useState, useRef, memo } from "react";
import { StyleSheet, Dimensions, type LayoutChangeEvent } from "react-native";
import { Canvas, Circle, Group, Image, Skia } from "@shopify/react-native-skia";
import Animated, {
  Easing,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useLoadImages } from "./hooks";
import { Quat, Vec3 } from "./maths-type";
import type {
  Fit,
  IDisc,
  IDiscComponent,
  IInfiniteMenu,
  IMenuState,
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
} from "./maths";
import { scheduleOnRN } from "react-native-worklets";

const DiscComponent: React.FC<IDiscComponent> = memo<IDiscComponent>(
  ({
    x,
    y,
    radius,
    alpha,
    image,
    fit = "cover",
    placeholderColor = "rgb(80, 80, 80)",
    borderWidth = 0,
    borderColor = "rgba(255, 255, 255, 0.25)",
    minRadius = 1,
  }: IDiscComponent): React.ReactElement | null => {
    const clipPath = useMemo(() => {
      const path = Skia.Path.Make();
      path.addCircle(x, y, radius);
      return path;
    }, [x, y, radius]);

    if (radius < minRadius) return null;

    const border =
      borderWidth > 0 ? (
        <Circle
          cx={x}
          cy={y}
          r={radius - borderWidth / 2}
          color={borderColor}
          style="stroke"
          strokeWidth={borderWidth}
          opacity={alpha}
        />
      ) : null;

    if (!image) {
      return (
        <Group>
          <Circle
            cx={x}
            cy={y}
            r={radius}
            color={placeholderColor}
            opacity={alpha}
          />
          {border}
        </Group>
      );
    }

    return (
      <Group>
        <Group clip={clipPath} opacity={alpha}>
          <Image
            image={image}
            x={x - radius}
            y={y - radius}
            width={radius * 2}
            height={radius * 2}
            fit={fit as Fit}
          />
        </Group>
        {border}
      </Group>
    );
  },
);

export const InfiniteMenu: React.FC<IInfiniteMenu> &
  React.FunctionComponent<IInfiniteMenu> = memo<IInfiniteMenu>(
  ({
    items,
    scale = 1,
    projectionScale: projectionScaleProp,
    backgroundColor = "#000000",
    style,

    subdivisions = 1,
    sphereRadius = 2,
    cameraDistance = 3,
    discSize = 0.25,

    opacityRange = [0.1, 1],
    depthScaleRange = [0.4, 1],
    placeholderColor,
    imageFit = "cover",
    discBorderWidth = 0,
    discBorderColor,
    minDiscRadius = 1,

    gesturesEnabled = true,
    dragSensitivity = 0.3,
    dragAmplification = 5,
    inertia = 0.1,
    snapEnabled = true,
    snapStrength = 0.2,
    zoomOnDrag = 2.5,
    autoRotateSpeed = 0,

    onActiveItemChange,
    onItemPress,
    renderOverlay,
    overlayFadeInDuration = 100,
    overlayFadeOutDuration = 500,
    overlayRestingScale = 0.9,
  }: IInfiniteMenu) => {
    const { width: screenWidth, height: screenHeight } =
      Dimensions.get("window");

    const layoutWidth = useSharedValue<number>(screenWidth);
    const layoutHeight = useSharedValue<number>(screenHeight);

    const onLayout = useCallback(
      (e: LayoutChangeEvent): void => {
        const { width, height } = e.nativeEvent.layout;
        if (width > 0 && height > 0) {
          layoutWidth.value = width;
          layoutHeight.value = height;
        }
      },
      [layoutWidth, layoutHeight],
    );

    const imageUrls = useMemo(
      () => items.map<string>((item) => item.image),
      [items],
    );
    const loadedImages = useLoadImages<string[]>(imageUrls);

    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [isMoving, setIsMoving] = useState<boolean>(false);
    const [discData, setDiscData] = useState<IDisc[]>([]);
    const discRef = useRef<IDisc[]>([]);

    const DISC_BASE_SCALE = discSize;
    const SPHERE_RADIUS = sphereRadius;
    const CAMERA_Z = cameraDistance;
    const FIT_DIVISOR = 6.2;
    const explicitProjection = projectionScaleProp ?? 0;

    const sphereVertices = useMemo(
      () => generateIcosahedronVertices(subdivisions, SPHERE_RADIUS),
      [subdivisions, SPHERE_RADIUS],
    );

    const verticesRef = useMemo(() => [...sphereVertices], [sphereVertices]);

    const [minOpacity, maxOpacity] = opacityRange;
    const [minDepthScale, maxDepthScale] = depthScaleRange;

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
        setActiveIndex(itemIndex);
        onActiveItemChange?.(items[itemIndex], itemIndex);
      },
      [items, onActiveItemChange],
    );

    const updateIsMoving = useCallback((moving: boolean) => {
      setIsMoving(moving);
    }, []);

    const updateDiscData = useCallback((data: IDisc[]) => {
      discRef.current = data;
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

      const dampIntensity = inertia * ts;
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

        if (snapEnabled && autoRotateSpeed === 0) {
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
        } else if (autoRotateSpeed !== 0) {
          const angle = (autoRotateSpeed * dt) / 1000 / 2;
          snapRot = { x: 0, y: Math.sin(angle), z: 0, w: Math.cos(angle) };
        }

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

      const targetZ =
        isDown.value && zoomOnDrag !== 0
          ? CAMERA_Z + rotVelocity.value * 80 + zoomOnDrag
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
      const autoFit =
        (Math.min(layoutWidth.value, layoutHeight.value) / FIT_DIVISOR) * scale;
      const projScale = explicitProjection > 0 ? explicitProjection : autoFit;
      const itemLen = Math.max(1, items.length);

      for (let i = 0; i < verticesRef.length; i++) {
        const v = verticesRef[i];
        const worldPos = quatRotateVec3(newOrientation, v);

        const perspective = currentCamZ / (currentCamZ - worldPos.z);
        const sx = layoutWidth.value / 2 + worldPos.x * perspective * projScale;
        const sy =
          layoutHeight.value / 2 - worldPos.y * perspective * projScale;

        const depthT = Math.abs(worldPos.z) / SPHERE_RADIUS;
        const zFactor =
          minDepthScale + (maxDepthScale - minDepthScale) * depthT;
        const baseRadius = zFactor * DISC_BASE_SCALE * perspective * projScale;

        const alphaT = (worldPos.z / SPHERE_RADIUS + 1) / 2;
        const alpha = Math.max(
          minOpacity,
          minOpacity + (maxOpacity - minOpacity) * alphaT,
        );

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

    const handlePress = useCallback(
      (x: number, y: number) => {
        if (!onItemPress || items.length === 0) return;
        for (let i = discRef.current.length - 1; i >= 0; i--) {
          const d = discRef.current[i];
          const dx = x - d.screenX;
          const dy = y - d.screenY;
          if (dx * dx + dy * dy <= d.radius * d.radius) {
            onItemPress(items[d.itemIndex], d.itemIndex);
            return;
          }
        }
      },
      [onItemPress, items],
    );

    const panGesture = useMemo(
      () =>
        Gesture.Pan()
          .enabled(gesturesEnabled)
          .onBegin((e) => {
            "worklet";
            prevX.value = e.x;
            prevY.value = e.y;
            isDown.value = true;
          })
          .onUpdate((e) => {
            "worklet";
            const midX = prevX.value + (e.x - prevX.value) * dragSensitivity;
            const midY = prevY.value + (e.y - prevY.value) * dragSensitivity;

            const dx = midX - prevX.value;
            const dy = midY - prevY.value;

            if (dx * dx + dy * dy > 0.1) {
              const p = projectToSphere(
                midX,
                midY,
                layoutWidth.value,
                layoutHeight.value,
              );
              const q = projectToSphere(
                prevX.value,
                prevY.value,
                layoutWidth.value,
                layoutHeight.value,
              );
              const newRot = quatFromVectors(p, q, dragAmplification);

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
          }),
      [
        gesturesEnabled,
        dragSensitivity,
        dragAmplification,
        prevX,
        prevY,
        isDown,
        prx,
        pry,
        prz,
        prw,
        layoutWidth,
        layoutHeight,
      ],
    );

    const tapGesture = useMemo(
      () =>
        Gesture.Tap()
          .enabled(gesturesEnabled && !!onItemPress)
          .onEnd((e) => {
            "worklet";
            scheduleOnRN(handlePress, e.x, e.y);
          }),
      [gesturesEnabled, onItemPress, handlePress],
    );

    const composedGesture = useMemo(
      () => Gesture.Simultaneous(panGesture, tapGesture),
      [panGesture, tapGesture],
    );

    const overlayStyle = useAnimatedStyle(() => {
      const moving = lastMoving.value;
      const timing = {
        duration: moving ? overlayFadeInDuration : overlayFadeOutDuration,
        easing: Easing.out(Easing.quad),
      };
      return {
        opacity: withTiming(moving ? 0 : 1, timing),
        transform: [
          { scale: withTiming(moving ? overlayRestingScale : 1, timing) },
        ],
      };
    }, [overlayFadeInDuration, overlayFadeOutDuration, overlayRestingScale]);

    const menuState = useMemo<IMenuState>(
      () => ({
        activeItem: items[activeIndex] ?? null,
        activeIndex,
        isMoving,
      }),
      [items, activeIndex, isMoving],
    );

    return (
      <GestureHandlerRootView
        onLayout={onLayout}
        style={[styles.container, { backgroundColor }, style]}
      >
        <GestureDetector gesture={composedGesture}>
          <Canvas style={styles.canvas}>
            {discData.map((disc, idx) => (
              <DiscComponent
                key={`disc-${idx}`}
                x={disc.screenX}
                y={disc.screenY}
                radius={disc.radius}
                alpha={disc.alpha}
                image={loadedImages[disc.itemIndex] || null}
                fit={imageFit}
                placeholderColor={placeholderColor}
                borderWidth={discBorderWidth}
                borderColor={discBorderColor}
                minRadius={minDiscRadius}
              />
            ))}
          </Canvas>
        </GestureDetector>

        {renderOverlay ? (
          <Animated.View
            pointerEvents="box-none"
            style={[styles.overlay, overlayStyle]}
          >
            {renderOverlay(menuState)}
          </Animated.View>
        ) : null}
      </GestureHandlerRootView>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  canvas: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo<
  React.FC<IInfiniteMenu> & React.FunctionComponent<IInfiniteMenu>
>(InfiniteMenu);

export type {
  IMenuItem,
  IMenuState,
  IInfiniteMenu,
  IDisc,
  IDiscComponent,
} from "./types";
