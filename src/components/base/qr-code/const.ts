import { ReduceMotion, WithSpringConfig } from "react-native-reanimated";

const BACKGROUND_COLOR = "#eeedf4";
const QR_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

const SPRING_CONFIG: WithSpringConfig = {
  stiffness: 135,
  damping: 12.5,
  mass: 0.5,
  reduceMotion: ReduceMotion.System,
};

const PRESSABLE_SPRING_CONFIG: WithSpringConfig = {
  stiffness: 250,
  damping: 30,
  mass: 0.5,
  reduceMotion: ReduceMotion.System,
};

export { BACKGROUND_COLOR, QR_URL, SPRING_CONFIG, PRESSABLE_SPRING_CONFIG };
