export interface ColorShade {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  systemRed: string;
  systemOrange: string;
  systemYellow: string;
  systemGreen: string;
  systemMint: string;
  systemTeal: string;
  systemCyan: string;
  systemBlue: string;
  systemIndigo: string;
  systemPurple: string;
  systemPink: string;
  systemBrown: string;

  background: string;
  secondaryBackground: string;
  tertiaryBackground: string;

  label: string;
  secondaryLabel: string;
  tertiaryLabel: string;
  quaternaryLabel: string;

  slate: ColorShade;
  gray: ColorShade;
  zinc: ColorShade;
  neutral: ColorShade;
  stone: ColorShade;
  red: ColorShade;
  orange: ColorShade;
  amber: ColorShade;
  yellow: ColorShade;
  lime: ColorShade;
  green: ColorShade;
  emerald: ColorShade;
  teal: ColorShade;
  cyan: ColorShade;
  sky: ColorShade;
  blue: ColorShade;
  indigo: ColorShade;
  violet: ColorShade;
  purple: ColorShade;
  fuchsia: ColorShade;
  pink: ColorShade;
  rose: ColorShade;
}

export interface ColorSystem {
  light: ThemeColors;
  dark: ThemeColors;
}
