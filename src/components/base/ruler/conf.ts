import type { WithSpringConfig } from "react-native-reanimated";

const SPRING_CONFIG: WithSpringConfig = {
  damping: 12,
  stiffness: 150,
  mass: 0.5,
};

const SPRING_CONFIG_SOFT: WithSpringConfig = {
  damping: 10,
  stiffness: 129,
  mass: 0.5,
};

const SPRING_CONFIG_RESPONSIVE: WithSpringConfig = {
  damping: 10,
  stiffness: 190,
  mass: 0.5,
};

export { SPRING_CONFIG, SPRING_CONFIG_SOFT, SPRING_CONFIG_RESPONSIVE };
