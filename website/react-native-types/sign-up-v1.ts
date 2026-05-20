interface IBackgroundGradient<T> {
  colors?: T[];
  children?: React.ReactNode;
}

interface IGoogleIcon {
  size?: number;
}

interface IGithubIcon extends IGoogleIcon {}

export type { IBackgroundGradient, IGoogleIcon, IGithubIcon };
