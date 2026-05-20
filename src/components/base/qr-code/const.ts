import { Easing, type WithTimingConfig } from "react-native-reanimated";

const BACKGROUND_COLOR = "#eeedf4";
const QR_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

const TIMING_CONFIG: WithTimingConfig = {
  duration: 650,
  easing: Easing.bezier(0.22, 1, 0.36, 1),
};

export { BACKGROUND_COLOR, TIMING_CONFIG, QR_URL };
