import React, { useCallback, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type ViewStyle,
} from "react-native";
import Svg, { Path } from "react-native-svg";

import {
  BARCODE_HEIGHT,
  BARCODE_WIDTH,
  BAR_COUNT,
  DEFAULT_PALETTE,
  MONO_FONT,
  NOTCH_RADIUS,
  STUB_WIDTH,
  TICKET_RADIUS,
  TICKET_WIDTH,
} from "./const";
import { EventTicketCardContext, useEventTicketCard } from "./context";
import { buildBars, buildTicketPath } from "./helpers";
import type {
  IEventTicketCardBarcode,
  IEventTicketCardCode,
  IEventTicketCardContext,
  IEventTicketCardDetail,
  IEventTicketCardRoot,
  IEventTicketCardSlot,
  IEventTicketCardText,
} from "./types";

import { createCompoundComponent } from "@/utils/create-compound-component";

const EventTicketCardRoot: React.FC<IEventTicketCardRoot> = ({
  children,
  palette,
  width = TICKET_WIDTH,
  radius = TICKET_RADIUS,
  stubWidth = STUB_WIDTH,
  notchRadius = NOTCH_RADIUS,
  perforation = "dashed",
  stubSide = "right",
  style,
}: IEventTicketCardRoot): React.JSX.Element => {
  // The silhouette is drawn as an SVG behind the content, so it can only be
  // painted once the content has told us how tall the ticket ended up.
  const [height, setHeight] = useState<number>(0);

  const onLayout = useCallback((event: LayoutChangeEvent): void => {
    setHeight(event.nativeEvent.layout.height);
  }, []);

  const context = useMemo<IEventTicketCardContext>(
    () => ({
      palette: { ...DEFAULT_PALETTE, ...palette },
      fontFamily: MONO_FONT,
      stubWidth,
      perforation,
      stubSide,
    }),
    [palette, stubWidth, perforation, stubSide],
  );

  const path = useMemo<string>(
    () =>
      buildTicketPath({
        width,
        height,
        radius,
        tearX: stubSide === "right" ? width - stubWidth : stubWidth,
        notchRadius,
      }),
    [width, height, radius, stubSide, stubWidth, notchRadius],
  );

  const direction: ViewStyle["flexDirection"] =
    stubSide === "right" ? "row" : "row-reverse";

  return (
    <EventTicketCardContext.Provider value={context}>
      <View style={[{ width }, style]}>
        {height > 0 && (
          <Svg
            width={width}
            height={height}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          >
            <Path d={path} fill={context.palette.surface} fillRule="evenodd" />
          </Svg>
        )}
        <View style={{ flexDirection: direction }} onLayout={onLayout}>
          {children}
        </View>
      </View>
    </EventTicketCardContext.Provider>
  );
};

const EventTicketCardMain: React.FC<IEventTicketCardSlot> = ({
  children,
  style,
}: IEventTicketCardSlot): React.JSX.Element => (
  <View style={[styles.main, style]}>{children}</View>
);

const EventTicketCardEyebrow: React.FC<IEventTicketCardText> = ({
  children,
  numberOfLines = 1,
  style,
}: IEventTicketCardText): React.JSX.Element => {
  const { palette, fontFamily } = useEventTicketCard("EventTicketCard.Eyebrow");

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[styles.eyebrow, { color: palette.muted, fontFamily }, style]}
    >
      {children}
    </Text>
  );
};

const EventTicketCardTitle: React.FC<IEventTicketCardText> = ({
  children,
  numberOfLines = 1,
  style,
}: IEventTicketCardText): React.JSX.Element => {
  const { palette } = useEventTicketCard("EventTicketCard.Title");

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[styles.title, { color: palette.ink }, style]}
    >
      {children}
    </Text>
  );
};

const EventTicketCardHolder: React.FC<IEventTicketCardText> = ({
  children,
  numberOfLines = 1,
  style,
}: IEventTicketCardText): React.JSX.Element => {
  const { palette } = useEventTicketCard("EventTicketCard.Holder");

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[styles.holder, { color: palette.muted }, style]}
    >
      {children}
    </Text>
  );
};

const EventTicketCardDetails: React.FC<IEventTicketCardSlot> = ({
  children,
  style,
}: IEventTicketCardSlot): React.JSX.Element => (
  <View style={[styles.details, style]}>{children}</View>
);

const EventTicketCardDetail: React.FC<IEventTicketCardDetail> = ({
  label,
  value,
  style,
  labelStyle,
  valueStyle,
}: IEventTicketCardDetail): React.JSX.Element => {
  const { palette, fontFamily } = useEventTicketCard("EventTicketCard.Detail");

  return (
    <View style={[styles.detail, style]}>
      <Text
        numberOfLines={1}
        style={[
          styles.detailLabel,
          { color: palette.muted, fontFamily },
          labelStyle,
        ]}
      >
        {label}
      </Text>
      <Text
        numberOfLines={1}
        style={[styles.detailValue, { color: palette.ink }, valueStyle]}
      >
        {value}
      </Text>
    </View>
  );
};

const EventTicketCardStub: React.FC<IEventTicketCardSlot> = ({
  children,
  style,
}: IEventTicketCardSlot): React.JSX.Element => {
  const { palette, stubWidth, perforation, stubSide } = useEventTicketCard(
    "EventTicketCard.Stub",
  );

  const tearLine: ViewStyle =
    perforation === "none"
      ? {}
      : stubSide === "right"
        ? {
            borderLeftWidth: 1,
            borderStyle: perforation,
            borderColor: palette.perforation,
          }
        : {
            borderRightWidth: 1,
            borderStyle: perforation,
            borderColor: palette.perforation,
          };

  return (
    <View style={[styles.stub, { width: stubWidth }, tearLine, style]}>
      {children}
    </View>
  );
};

const EventTicketCardBarcode: React.FC<IEventTicketCardBarcode> = ({
  code,
  height = BARCODE_HEIGHT,
  width = BARCODE_WIDTH,
  color,
  style,
}: IEventTicketCardBarcode): React.JSX.Element => {
  const { palette } = useEventTicketCard("EventTicketCard.Barcode");

  const bars = useMemo<number[]>(() => buildBars(code, BAR_COUNT), [code]);

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.barcode, { height, width }, style]}
    >
      {bars.map((barHeight, i) => (
        <View
          key={`${code}-${i}`}
          style={{
            width: "100%",
            height: barHeight,
            backgroundColor: color ?? palette.bars,
          }}
        />
      ))}
    </View>
  );
};

const EventTicketCardCode: React.FC<IEventTicketCardCode> = ({
  children,
  vertical = true,
  style,
}: IEventTicketCardCode): React.JSX.Element => {
  const { palette, fontFamily } = useEventTicketCard("EventTicketCard.Code");

  // `writing-mode: vertical-rl` has no RN equivalent; a rotation is the
  // closest thing, so the text is rotated inside a fixed-height box.
  return (
    <View style={vertical ? styles.codeBox : undefined}>
      <Text
        numberOfLines={1}
        style={[
          styles.code,
          { color: palette.muted, fontFamily },
          vertical && styles.codeVertical,
          style,
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    minWidth: 0,
    padding: 20,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  title: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  holder: {
    marginTop: 2,
    fontSize: 13,
  },
  details: {
    marginTop: 20,
    flexDirection: "row",
    gap: 24,
  },
  detail: {
    minWidth: 0,
  },
  detailLabel: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  detailValue: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: "600",
  },
  stub: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 12,
  },
  barcode: {
    justifyContent: "space-between",
  },
  codeBox: {
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  code: {
    fontSize: 12,
    letterSpacing: 3,
  },
  codeVertical: {
    transform: [{ rotate: "90deg" }],
  },
});

const Root = createCompoundComponent(
  "EventTicketCard.Root",
  EventTicketCardRoot,
);
const Main = createCompoundComponent(
  "EventTicketCard.Main",
  EventTicketCardMain,
);
const Eyebrow = createCompoundComponent(
  "EventTicketCard.Eyebrow",
  EventTicketCardEyebrow,
);
const Title = createCompoundComponent(
  "EventTicketCard.Title",
  EventTicketCardTitle,
);
const Holder = createCompoundComponent(
  "EventTicketCard.Holder",
  EventTicketCardHolder,
);
const Details = createCompoundComponent(
  "EventTicketCard.Details",
  EventTicketCardDetails,
);
const Detail = createCompoundComponent(
  "EventTicketCard.Detail",
  EventTicketCardDetail,
);
const Stub = createCompoundComponent(
  "EventTicketCard.Stub",
  EventTicketCardStub,
);
const Barcode = createCompoundComponent(
  "EventTicketCard.Barcode",
  EventTicketCardBarcode,
);
const Code = createCompoundComponent(
  "EventTicketCard.Code",
  EventTicketCardCode,
);

const EventTicketCard = createCompoundComponent(
  "EventTicketCard",
  EventTicketCardRoot,
  {
    Root,
    Main,
    Eyebrow,
    Title,
    Holder,
    Details,
    Detail,
    Stub,
    Barcode,
    Code,
  },
);

export {
  EventTicketCard,
  Root,
  Main,
  Eyebrow,
  Title,
  Holder,
  Details,
  Detail,
  Stub,
  Barcode,
  Code,
  useEventTicketCard,
};
export default EventTicketCard;
export type {
  IEventTicketCardRoot,
  IEventTicketCardSlot,
  IEventTicketCardText,
  IEventTicketCardDetail,
  IEventTicketCardBarcode,
  IEventTicketCardCode,
  TTicketPalette,
  TTicketPerforation,
  TTicketStubSide,
} from "./types";
