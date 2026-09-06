import React, {
  Children,
  isValidElement,
  useMemo,
  type ReactElement,
  type ReactNode,
} from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import {
  BARCODE_HEIGHT,
  BARCODE_WIDTH,
  BAR_COUNT,
  DEFAULT_PALETTE,
  MONO_FONT,
  PAPER_PADDING,
  PAPER_WIDTH,
  TEETH_HEIGHT,
  TEETH_WIDTH,
  TILT_ANGLE,
} from "./const";
import { ReceiptCardContext, useReceiptCard } from "./context";
import type {
  IReceiptCardBarcode,
  IReceiptCardContext,
  IReceiptCardItem,
  IReceiptCardRoot,
  IReceiptCardSeparator,
  IReceiptCardSlot,
  IReceiptCardText,
  IReceiptCardTornEdge,
  IReceiptCardTotal,
  TReceiptPalette,
} from "./types";

import { createCompoundComponent } from "@/utils/create-compound-component";

const EDGE_ROLE = "edge";

const isEdge = (
  child: ReactNode,
): child is ReactElement<IReceiptCardTornEdge> =>
  isValidElement(child) &&
  (child.type as { role?: string })?.role === EDGE_ROLE;

const ReceiptCardRoot: React.FC<IReceiptCardRoot> = ({
  children,
  palette,
  width = PAPER_WIDTH,
  tilted = true,
  style,
  paperStyle,
}: IReceiptCardRoot): React.JSX.Element => {
  const context = useMemo<IReceiptCardContext>(
    () => ({
      palette: { ...DEFAULT_PALETTE, ...palette },
      fontFamily: MONO_FONT,
      width,
    }),
    [palette, width],
  );

  const { topEdge, bottomEdge, body } = useMemo(() => {
    let top: ReactNode = null;
    let bottom: ReactNode = null;
    const rest: ReactNode[] = [];

    Children.forEach(children, (child) => {
      if (!isEdge(child)) {
        rest.push(child);
        return;
      }
      if (child.props.side === "top") top = child;
      else bottom = child;
    });

    return { topEdge: top, bottomEdge: bottom, body: rest };
  }, [children]);

  return (
    <ReceiptCardContext.Provider value={context}>
      <View
        style={[
          styles.root,
          { width },
          tilted && { transform: [{ rotate: TILT_ANGLE }] },
          style,
        ]}
      >
        {topEdge}
        <View
          style={[
            styles.paper,
            { backgroundColor: context.palette.paper },
            paperStyle,
          ]}
        >
          {body}
        </View>
        {bottomEdge}
      </View>
    </ReceiptCardContext.Provider>
  );
};

const ReceiptCardHeader: React.FC<IReceiptCardSlot> = ({
  children,
  style,
}: IReceiptCardSlot): React.JSX.Element => (
  <View style={[styles.header, style]}>{children}</View>
);

const ReceiptCardStore: React.FC<IReceiptCardText> = ({
  children,
  style,
}: IReceiptCardText): React.JSX.Element => {
  const { palette, fontFamily } = useReceiptCard("ReceiptCard.Store");

  return (
    <Text style={[styles.store, { color: palette.accent, fontFamily }, style]}>
      {children}
    </Text>
  );
};

const ReceiptCardMeta: React.FC<IReceiptCardText> = ({
  children,
  style,
}: IReceiptCardText): React.JSX.Element => {
  const { palette, fontFamily } = useReceiptCard("ReceiptCard.Meta");

  return (
    <Text style={[styles.meta, { color: palette.muted, fontFamily }, style]}>
      {children}
    </Text>
  );
};

const ReceiptCardSeparator: React.FC<IReceiptCardSeparator> = ({
  variant = "dashed",
  color,
  style,
}: IReceiptCardSeparator): React.JSX.Element => {
  const { palette } = useReceiptCard("ReceiptCard.Separator");

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.separator,
        { borderColor: color ?? palette.rule, borderStyle: variant },
        style,
      ]}
    />
  );
};

const ReceiptCardItems: React.FC<IReceiptCardSlot> = ({
  children,
  style,
}: IReceiptCardSlot): React.JSX.Element => (
  <View style={[styles.items, style]}>{children}</View>
);

const ReceiptCardItem: React.FC<IReceiptCardItem> = ({
  label,
  value,
  leader = true,
  style,
  labelStyle,
  valueStyle,
}: IReceiptCardItem): React.JSX.Element => {
  const { palette, fontFamily } = useReceiptCard("ReceiptCard.Item");

  return (
    <View style={[styles.item, style]}>
      <Text style={[styles.itemLabel, { fontFamily }, labelStyle]}>
        {label}
      </Text>
      {leader && (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[styles.leader, { borderColor: palette.leader }]}
        />
      )}
      <Text style={[styles.itemValue, { fontFamily }, valueStyle]}>
        {value}
      </Text>
    </View>
  );
};

const ReceiptCardTotal: React.FC<IReceiptCardTotal> = ({
  label = "Total",
  value,
  style,
  labelStyle,
  valueStyle,
}: IReceiptCardTotal): React.JSX.Element => {
  const { palette, fontFamily } = useReceiptCard("ReceiptCard.Total");

  return (
    <View style={[styles.total, style]}>
      <Text
        style={[
          styles.totalText,
          { color: palette.accent, fontFamily },
          labelStyle,
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.totalText,
          styles.tabular,
          { color: palette.accent, fontFamily },
          valueStyle,
        ]}
      >
        {value}
      </Text>
    </View>
  );
};

const ReceiptCardNote: React.FC<IReceiptCardText> = ({
  children,
  style,
}: IReceiptCardText): React.JSX.Element => {
  const { palette, fontFamily } = useReceiptCard("ReceiptCard.Note");

  return (
    <Text style={[styles.note, { color: palette.muted, fontFamily }, style]}>
      {children}
    </Text>
  );
};

const ReceiptCardBarcode: React.FC<IReceiptCardBarcode> = ({
  code,
  showCode = true,
  height = BARCODE_HEIGHT,
  width = BARCODE_WIDTH,
  color,
  style,
  codeStyle,
}: IReceiptCardBarcode): React.JSX.Element => {
  const { palette, fontFamily } = useReceiptCard("ReceiptCard.Barcode");

  const bars = useMemo<number[]>(() => {
    const seed = code.length > 0 ? code : "receipt";
    return Array.from(
      { length: BAR_COUNT },
      (_, i) => 1 + ((seed.charCodeAt(i % seed.length) + i * 3) % 3),
    );
  }, [code]);

  return (
    <View style={[styles.barcode, style]}>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[styles.bars, { height, width }]}
      >
        {bars.map((barWidth, i) => (
          <View
            key={`${code}-${i}`}
            style={{
              width: barWidth,
              height: "100%",
              backgroundColor: color ?? palette.ink,
            }}
          />
        ))}
      </View>
      {showCode && (
        <Text
          style={[styles.code, { color: palette.muted, fontFamily }, codeStyle]}
        >
          {code}
        </Text>
      )}
    </View>
  );
};

const ReceiptCardTornEdge: React.FC<IReceiptCardTornEdge> = ({
  side = "bottom",
  toothWidth = TEETH_WIDTH,
  toothHeight = TEETH_HEIGHT,
  color,
  style,
}: IReceiptCardTornEdge): React.JSX.Element => {
  const { palette, width } = useReceiptCard("ReceiptCard.TornEdge");

  const path = useMemo<string>(() => {
    const teeth = Math.ceil(width / toothWidth);
    const base = side === "bottom" ? 0 : toothHeight;
    const tip = side === "bottom" ? toothHeight : 0;
    const segments: string[] = [`M0 ${base}`];

    for (let i = 0; i < teeth; i += 1) {
      const start = i * toothWidth;
      segments.push(`L${start + toothWidth / 2} ${tip}`);
      segments.push(`L${start + toothWidth} ${base}`);
    }

    return `${segments.join(" ")} Z`;
  }, [side, toothHeight, toothWidth, width]);

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ width, height: toothHeight }, style]}
    >
      <Svg width={width} height={toothHeight}>
        <Path d={path} fill={color ?? palette.paper} />
      </Svg>
    </View>
  );
};

(ReceiptCardTornEdge as { role?: string }).role = EDGE_ROLE;

const styles = StyleSheet.create({
  root: {
    alignSelf: "center",
  },
  paper: {
    paddingHorizontal: PAPER_PADDING,
    paddingTop: 24,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  header: {
    alignItems: "center",
    gap: 4,
  },
  store: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 4,
    textAlign: "center",
    textTransform: "uppercase",
  },
  meta: {
    fontSize: 12,
    letterSpacing: 2,
    textAlign: "center",
    textTransform: "uppercase",
  },
  separator: {
    borderTopWidth: 1,
    marginVertical: 16,
  },
  items: {
    gap: 6,
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  itemLabel: {
    flexShrink: 0,
    fontSize: 13,
    textTransform: "uppercase",
  },
  leader: {
    flex: 1,
    minWidth: 16,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderStyle: "dotted",
  },
  itemValue: {
    flexShrink: 0,
    fontSize: 13,
    fontVariant: ["tabular-nums"],
  },
  total: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  tabular: {
    fontVariant: ["tabular-nums"],
  },
  note: {
    marginTop: 16,
    fontSize: 12,
    letterSpacing: 2,
    textAlign: "center",
    textTransform: "uppercase",
  },
  barcode: {
    marginTop: 16,
    alignItems: "center",
    gap: 6,
  },
  bars: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
  },
  code: {
    fontSize: 12,
    letterSpacing: 5,
  },
});

const Root = createCompoundComponent("ReceiptCard.Root", ReceiptCardRoot);
const Header = createCompoundComponent("ReceiptCard.Header", ReceiptCardHeader);
const Store = createCompoundComponent("ReceiptCard.Store", ReceiptCardStore);
const Meta = createCompoundComponent("ReceiptCard.Meta", ReceiptCardMeta);
const Separator = createCompoundComponent(
  "ReceiptCard.Separator",
  ReceiptCardSeparator,
);
const Items = createCompoundComponent("ReceiptCard.Items", ReceiptCardItems);
const Item = createCompoundComponent("ReceiptCard.Item", ReceiptCardItem);
const Total = createCompoundComponent("ReceiptCard.Total", ReceiptCardTotal);
const Note = createCompoundComponent("ReceiptCard.Note", ReceiptCardNote);
const Barcode = createCompoundComponent(
  "ReceiptCard.Barcode",
  ReceiptCardBarcode,
);
const TornEdge = createCompoundComponent(
  "ReceiptCard.TornEdge",
  ReceiptCardTornEdge,
);

const ReceiptCard = createCompoundComponent("ReceiptCard", ReceiptCardRoot, {
  Root,
  Header,
  Store,
  Meta,
  Separator,
  Items,
  Item,
  Total,
  Note,
  Barcode,
  TornEdge,
});

export {
  ReceiptCard,
  Root,
  Header,
  Store,
  Meta,
  Separator,
  Items,
  Item,
  Total,
  Note,
  Barcode,
  TornEdge,
  useReceiptCard,
};
export default ReceiptCard;
export type {
  IReceiptCardRoot,
  IReceiptCardSlot,
  IReceiptCardText,
  IReceiptCardSeparator,
  IReceiptCardItem,
  IReceiptCardTotal,
  IReceiptCardBarcode,
  IReceiptCardTornEdge,
  TReceiptPalette,
  TReceiptEdgeSide,
} from "./types";
