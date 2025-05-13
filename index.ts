import { App } from "./App";
import { registerRootComponent } from "expo";
// @ts-ignore
import type { InitialProps } from "./index.types";

registerRootComponent<InitialProps>(App);
