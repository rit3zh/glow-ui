interface IAuraLiftContext {
  toggle: () => void;
  readonly isRunning?: boolean;
}

interface IAuraLiftProvider {
  children: React.ReactNode;
  readonly duration?: number;
}

export type { IAuraLiftContext, IAuraLiftProvider };
