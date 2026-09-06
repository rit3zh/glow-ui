import { LinearTransition } from "react-native-reanimated";

import { SHELL_SPRING } from "./const";

function shellLayout() {
  return LinearTransition.springify()
    .damping(SHELL_SPRING.damping as number)
    .stiffness(SHELL_SPRING.stiffness as number)
    .mass(SHELL_SPRING.mass as number);
}

export { shellLayout };
