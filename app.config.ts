import { ExpoConfig, ConfigContext } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "YourAppName",
  slug: "your-app-slug",
  ios: {
    ...config.ios,
    bundleIdentifier: "com.anonymous.glow-ui",
  },
});
