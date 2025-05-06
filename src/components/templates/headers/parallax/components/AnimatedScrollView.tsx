import { Animated, ScrollView } from "react-native";
import React, { forwardRef } from "react";
import { HEADER_HEIGHT, IMG_HEADER_HEIGHT } from "../constants";
import { useAnimateScrollView } from "../hooks/useAnimatedScrollView";
import { AnimatedHeader } from "./AnimatedHeader";
import AnimatedNavbar from "./AnimatedNavBar";

import type { AnimatedScrollViewProps } from "../types/index";

export const AnimatedScrollView = forwardRef<
  ScrollView,
  AnimatedScrollViewProps
>(
  (
    {
      TopNavBarComponent,
      HeaderNavbarComponent,
      HeaderComponent,
      headerMaxHeight,
      topBarHeight,
      topBarElevation,
      headerImage,
      disableScale,
      children,
      imageStyle,
      renderHeaderComponent,
      OverlayHeaderContent,
      renderOveralComponent,
      renderTopNavBarComponent,
      renderToHardwareTextureAndroid,
      renderHeaderNavBarComponent,
      ...props
    }: AnimatedScrollViewProps,
    ref
  ) => {
    const imageHeight = headerMaxHeight || IMG_HEADER_HEIGHT;
    const headerNavHeight = topBarHeight || HEADER_HEIGHT;
    const headerElevation = topBarElevation || 0;
    const [scroll, onScroll, scale, translateYDown, translateYUp] =
      useAnimateScrollView(imageHeight, disableScale);

    return (
      <>
        <Animated.ScrollView
          ref={ref}
          onScroll={onScroll}
          scrollEventThrottle={16}
          {...props}
        >
          <AnimatedHeader
            HeaderComponent={
              renderHeaderComponent ? renderHeaderComponent!() : HeaderComponent
            }
            headerImage={headerImage}
            imageStyle={imageStyle}
            imageHeight={imageHeight}
            translateYDown={translateYDown}
            translateYUp={translateYUp}
            scale={scale}
            OverlayHeaderContent={
              renderOveralComponent
                ? renderOveralComponent!()
                : OverlayHeaderContent
            }
          />
          {children}
        </Animated.ScrollView>
        <AnimatedNavbar
          headerElevation={headerElevation}
          headerHeight={headerNavHeight}
          scroll={scroll}
          imageHeight={imageHeight}
          OverflowHeaderComponent={
            renderHeaderNavBarComponent
              ? renderHeaderNavBarComponent!()
              : HeaderNavbarComponent
          }
          TopNavbarComponent={
            renderTopNavBarComponent
              ? renderTopNavBarComponent()
              : TopNavBarComponent
          }
        />
      </>
    );
  }
);
