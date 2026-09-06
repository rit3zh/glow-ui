import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Tray, useTray } from "@/components";
import { Showcase } from "~/showcase";

const TINT = "#f6f3ec";
const MUTED = "rgba(246,243,236,0.45)";
const HAIRLINE = "rgba(246,243,236,0.08)";

const NETWORKS = ["Ethereum", "Base", "Arbitrum", "Optimism"];

const RECIPIENTS = [
  { name: "vitalik.eth", address: "0xd8dA…6045" },
  { name: "jesse.base.eth", address: "0x8492…1f0c" },
  { name: "hayden.eth", address: "0x11e4…9a37" },
  { name: "Cold wallet", address: "0x4a9f…c3B1" },
];

const SPEEDS = [
  { id: "standard", label: "Standard", detail: "~30s · $1.24" },
  { id: "fast", label: "Fast", detail: "~10s · $2.60" },
  { id: "instant", label: "Instant", detail: "~3s · $4.80" },
];

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"];

const RATE = 3164;

const ASSETS = [
  { symbol: "ETH", name: "Ethereum", amount: "1.284", value: "$4,061.20" },
  { symbol: "BTC", name: "Bitcoin", amount: "0.0412", value: "$2,884.00" },
  { symbol: "SOL", name: "Solana", amount: "18.5", value: "$1,203.75" },
  { symbol: "USDC", name: "USD Coin", amount: "820.00", value: "$820.00" },
  { symbol: "LINK", name: "Chainlink", amount: "42.0", value: "$588.00" },
  { symbol: "ARB", name: "Arbitrum", amount: "310.5", value: "$264.00" },
  { symbol: "OP", name: "Optimism", amount: "96.2", value: "$182.78" },
  { symbol: "AAVE", name: "Aave", amount: "1.9", value: "$164.35" },
  { symbol: "UNI", name: "Uniswap", amount: "22.4", value: "$148.60" },
  { symbol: "MATIC", name: "Polygon", amount: "480.0", value: "$96.00" },
  { symbol: "DAI", name: "Dai", amount: "60.00", value: "$60.00" },
  { symbol: "ENS", name: "ENS", amount: "2.1", value: "$42.10" },
];

function ActionPill({ icon, label }: { icon: string; label: string }) {
  return (
    <Tray.Trigger style={styles.action}>
      <Feather name={icon as never} size={17} color={TINT} />
      <Text style={styles.actionLabel}>{label}</Text>
    </Tray.Trigger>
  );
}

function Field({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.field} onPress={onPress} disabled={!onPress}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldValue}>
        <Text style={styles.fieldText}>{value}</Text>
        {onPress ? (
          <Feather name="chevron-right" size={16} color={MUTED} />
        ) : null}
      </View>
    </Pressable>
  );
}

function TrayHead({ title, back }: { title: string; back?: boolean }) {
  return (
    <Tray.Header>
      <View style={styles.headerRow}>
        {back ? (
          <Tray.Back>
            {({ color, size }) => (
              <Feather name="chevron-left" size={size} color={color} />
            )}
          </Tray.Back>
        ) : null}
        <Tray.Title>{title}</Tray.Title>
      </View>
      <Tray.Close>
        {({ color, size }) => <Feather name="x" size={size} color={color} />}
      </Tray.Close>
    </Tray.Header>
  );
}

function SendTray() {
  const [network, setNetwork] = useState<string>("Ethereum");
  const [recipient, setRecipient] = useState(RECIPIENTS[0]);
  const [speed, setSpeed] = useState(SPEEDS[0]);
  const [amount, setAmount] = useState("0.045");

  return (
    <Tray
      theme="dark"
      defaultView="send"
      motion={{
        viewAxis: "x",
        viewSlide: 90,
        viewStartScale: 1,
        startScale: 0.5,
      }}
    >
      <ActionPill icon="arrow-up-right" label="Send" />

      <Tray.Content>
        <SendView
          amount={amount}
          network={network}
          recipient={recipient}
          speed={speed}
        />
        <AmountView amount={amount} onChange={setAmount} />
        <RecipientView selected={recipient} onSelect={setRecipient} />
        <NetworkView selected={network} onSelect={setNetwork} />
        <SpeedView selected={speed} onSelect={setSpeed} />
        <ReviewView
          amount={amount}
          network={network}
          recipient={recipient}
          speed={speed}
        />
        <SendingView />
        <SuccessView amount={amount} recipient={recipient} />
      </Tray.Content>
    </Tray>
  );
}

function fiat(amount: string) {
  const value = Number(amount) * RATE;
  return Number.isFinite(value)
    ? `$${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
    : "$0.00";
}

function SendView({
  amount,
  network,
  recipient,
  speed,
}: {
  amount: string;
  network: string;
  recipient: (typeof RECIPIENTS)[number];
  speed: (typeof SPEEDS)[number];
}) {
  const { setView } = useTray();
  return (
    <Tray.View id="send">
      <TrayHead title="Send" />
      <Tray.Body>
        <Pressable style={styles.amount} onPress={() => setView("amount")}>
          <Text style={styles.amountValue}>{amount || "0"} ETH</Text>
          <Text style={styles.amountFiat}>{fiat(amount)}</Text>
        </Pressable>
        <View style={styles.fields}>
          <Field
            label="To"
            value={recipient.name}
            onPress={() => setView("recipient")}
          />
          <Field
            label="Network"
            value={network}
            onPress={() => setView("network")}
          />
          <Field
            label="Speed"
            value={speed.label}
            onPress={() => setView("speed")}
          />
        </View>
      </Tray.Body>
      <Tray.Footer>
        <Pressable style={styles.primary} onPress={() => setView("review")}>
          <Text style={styles.primaryLabel}>Review</Text>
        </Pressable>
      </Tray.Footer>
    </Tray.View>
  );
}

function AmountView({
  amount,
  onChange,
}: {
  amount: string;
  onChange: (amount: string) => void;
}) {
  const { goBack } = useTray();

  const press = (key: string) => {
    if (key === "back") {
      onChange(amount.slice(0, -1));
      return;
    }
    if (key === "." && amount.includes(".")) return;
    if (amount.length > 9) return;
    onChange(amount === "0" && key !== "." ? key : amount + key);
  };

  return (
    <Tray.View id="amount">
      <TrayHead title="Amount" back />
      <Tray.Body>
        <View style={styles.amount}>
          <Text style={styles.amountValue}>{amount || "0"} ETH</Text>
          <Text style={styles.amountFiat}>{fiat(amount)}</Text>
        </View>
        <View style={styles.keypad}>
          {KEYS.map((key) => (
            <Pressable key={key} style={styles.key} onPress={() => press(key)}>
              {key === "back" ? (
                <Feather name="delete" size={20} color={TINT} />
              ) : (
                <Text style={styles.keyLabel}>{key}</Text>
              )}
            </Pressable>
          ))}
        </View>
      </Tray.Body>
      <Tray.Footer>
        <Pressable style={styles.primary} onPress={goBack}>
          <Text style={styles.primaryLabel}>Done</Text>
        </Pressable>
      </Tray.Footer>
    </Tray.View>
  );
}

function RecipientView({
  selected,
  onSelect,
}: {
  selected: (typeof RECIPIENTS)[number];
  onSelect: (recipient: (typeof RECIPIENTS)[number]) => void;
}) {
  const { goBack } = useTray();
  return (
    <Tray.View id="recipient">
      <TrayHead title="To" back />
      <Tray.Body>
        {RECIPIENTS.map((recipient) => (
          <Pressable
            key={recipient.name}
            style={styles.option}
            onPress={() => {
              onSelect(recipient);
              goBack();
            }}
          >
            <View style={styles.optionMeta}>
              <Text style={styles.optionLabel}>{recipient.name}</Text>
              <Text style={styles.optionDetail}>{recipient.address}</Text>
            </View>
            {recipient.name === selected.name ? (
              <Feather name="check" size={18} color={TINT} />
            ) : null}
          </Pressable>
        ))}
      </Tray.Body>
    </Tray.View>
  );
}

function NetworkView({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (network: string) => void;
}) {
  const { goBack } = useTray();
  return (
    <Tray.View id="network">
      <TrayHead title="Network" back />
      <Tray.Body>
        {NETWORKS.map((network) => (
          <Pressable
            key={network}
            style={styles.option}
            onPress={() => {
              onSelect(network);
              goBack();
            }}
          >
            <Text style={styles.optionLabel}>{network}</Text>
            {network === selected ? (
              <Feather name="check" size={18} color={TINT} />
            ) : null}
          </Pressable>
        ))}
      </Tray.Body>
    </Tray.View>
  );
}

function SpeedView({
  selected,
  onSelect,
}: {
  selected: (typeof SPEEDS)[number];
  onSelect: (speed: (typeof SPEEDS)[number]) => void;
}) {
  const { goBack } = useTray();
  return (
    <Tray.View id="speed">
      <TrayHead title="Speed" back />
      <Tray.Body>
        {SPEEDS.map((speed) => (
          <Pressable
            key={speed.id}
            style={styles.option}
            onPress={() => {
              onSelect(speed);
              goBack();
            }}
          >
            <View style={styles.optionMeta}>
              <Text style={styles.optionLabel}>{speed.label}</Text>
              <Text style={styles.optionDetail}>{speed.detail}</Text>
            </View>
            {speed.id === selected.id ? (
              <Feather name="check" size={18} color={TINT} />
            ) : null}
          </Pressable>
        ))}
      </Tray.Body>
    </Tray.View>
  );
}

function ReviewView({
  amount,
  network,
  recipient,
  speed,
}: {
  amount: string;
  network: string;
  recipient: (typeof RECIPIENTS)[number];
  speed: (typeof SPEEDS)[number];
}) {
  const { setView } = useTray();
  return (
    <Tray.View id="review">
      <TrayHead title="Review" back />
      <Tray.Body>
        <View style={styles.amount}>
          <Text style={styles.amountValue}>{amount || "0"} ETH</Text>
          <Text style={styles.amountFiat}>{fiat(amount)}</Text>
        </View>
        <View style={styles.fields}>
          <Field label="To" value={recipient.address} />
          <Field label="Network" value={network} />
          <Field label="Speed" value={speed.label} />
          <Field label="Network fee" value={speed.detail.split(" · ")[1]} />
        </View>
      </Tray.Body>
      <Tray.Footer>
        <Pressable style={styles.primary} onPress={() => setView("sending")}>
          <Text style={styles.primaryLabel}>Confirm</Text>
        </Pressable>
      </Tray.Footer>
    </Tray.View>
  );
}

function SendingView() {
  const { view, setView } = useTray();

  useEffect(() => {
    if (view !== "sending") return;
    const timer = setTimeout(() => setView("success"), 1400);
    return () => clearTimeout(timer);
  }, [view, setView]);

  return (
    <Tray.View id="sending">
      <Tray.Body>
        <View style={styles.status}>
          <ActivityIndicator color={TINT} />
          <Text style={styles.statusTitle}>Sending</Text>
          <Text style={styles.statusDetail}>Broadcasting to the network…</Text>
        </View>
      </Tray.Body>
    </Tray.View>
  );
}

function SuccessView({
  amount,
  recipient,
}: {
  amount: string;
  recipient: (typeof RECIPIENTS)[number];
}) {
  const { close } = useTray();
  return (
    <Tray.View id="success">
      <Tray.Body>
        <View style={styles.status}>
          <View style={styles.successMark}>
            <Feather name="check" size={26} color="#111111" />
          </View>
          <Text style={styles.statusTitle}>Sent {amount || "0"} ETH</Text>
          <Text style={styles.statusDetail}>to {recipient.name}</Text>
        </View>
      </Tray.Body>
      <Tray.Footer>
        <Pressable style={styles.primary} onPress={close}>
          <Text style={styles.primaryLabel}>Done</Text>
        </Pressable>
      </Tray.Footer>
    </Tray.View>
  );
}

function AssetsTray() {
  return (
    <Tray theme="dark" defaultView="assets">
      <ActionPill icon="pie-chart" label="Assets" />

      <Tray.Content>
        <Tray.View id="assets">
          <TrayHead title="Assets" />
          <Tray.ScrollView contentContainerStyle={styles.list}>
            {ASSETS.map((asset, index) => (
              <View
                key={asset.symbol}
                style={[styles.asset, index > 0 && styles.assetDivider]}
              >
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{asset.symbol[0]}</Text>
                </View>
                <View style={styles.assetMeta}>
                  <Text style={styles.assetName}>{asset.name}</Text>
                  <Text style={styles.assetAmount}>
                    {asset.amount} {asset.symbol}
                  </Text>
                </View>
                <Text style={styles.assetValue}>{asset.value}</Text>
              </View>
            ))}
          </Tray.ScrollView>
        </Tray.View>
      </Tray.Content>
    </Tray>
  );
}

function ReceiveTray() {
  return (
    <Tray theme="dark" defaultView="receive">
      <ActionPill icon="arrow-down-left" label="Receive" />

      <Tray.Content>
        <Tray.View id="receive">
          <TrayHead title="Receive" />
          <Tray.Body>
            <View style={styles.qr}>
              <Feather name="grid" size={64} color="rgba(246,243,236,0.16)" />
            </View>
            <Text style={styles.address}>0x4a9f…c3B1</Text>
            <Pressable style={styles.ghost}>
              <Feather name="copy" size={16} color={TINT} />
              <Text style={styles.ghostLabel}>Copy address</Text>
            </Pressable>
          </Tray.Body>
        </Tray.View>
      </Tray.Content>
    </Tray>
  );
}

export default function TrayScreen() {
  return (
    <Showcase>
      <View style={styles.screen}>
        <Text style={styles.balanceLabel}>Total balance</Text>
        <Text style={styles.balance}>$8,412.90</Text>

        <View style={styles.actions}>
          <SendTray />
          <ReceiveTray />
          <AssetsTray />
        </View>
      </View>
    </Showcase>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  balanceLabel: { color: MUTED, fontSize: 14 },
  balance: {
    color: TINT,
    fontSize: 44,
    fontWeight: "600",
    letterSpacing: -1.2,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 30,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#232320",
  },
  actionLabel: { color: TINT, fontSize: 15, fontWeight: "500" },

  headerRow: { flexDirection: "row", alignItems: "center", gap: 6 },

  amount: { alignItems: "center", paddingVertical: 12 },
  amountValue: {
    color: TINT,
    fontSize: 34,
    fontWeight: "600",
    letterSpacing: -0.8,
  },
  amountFiat: { color: MUTED, fontSize: 15, marginTop: 4 },

  fields: { marginTop: 12 },
  field: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
  },
  fieldLabel: { color: MUTED, fontSize: 15 },
  fieldValue: { flexDirection: "row", alignItems: "center", gap: 6 },
  fieldText: { color: TINT, fontSize: 15, fontWeight: "500" },

  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  optionLabel: { color: TINT, fontSize: 16 },
  optionMeta: { gap: 3 },
  optionDetail: { color: MUTED, fontSize: 13 },

  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  key: {
    width: "33.333%",
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  keyLabel: { color: TINT, fontSize: 24, fontWeight: "500" },

  status: { alignItems: "center", gap: 10, paddingVertical: 26 },
  statusTitle: { color: TINT, fontSize: 20, fontWeight: "600" },
  statusDetail: { color: MUTED, fontSize: 14 },
  successMark: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: TINT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },

  list: { paddingHorizontal: 20, paddingBottom: 16 },
  asset: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    paddingVertical: 13,
  },
  assetDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: HAIRLINE,
  },
  badge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#2b2a25",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: TINT, fontSize: 15, fontWeight: "600" },
  assetMeta: { flex: 1, gap: 2 },
  assetName: { color: TINT, fontSize: 15, fontWeight: "500" },
  assetAmount: { color: MUTED, fontSize: 13 },
  assetValue: { color: TINT, fontSize: 15, fontWeight: "500" },

  qr: {
    height: 150,
    borderRadius: 20,
    backgroundColor: "#232320",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  address: {
    color: TINT,
    fontSize: 17,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 16,
  },
  ghost: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: "#232320",
  },
  ghostLabel: { color: TINT, fontSize: 15, fontWeight: "500" },

  primary: {
    backgroundColor: TINT,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 4,
  },
  primaryLabel: { color: "#111111", fontSize: 16, fontWeight: "600" },
});
