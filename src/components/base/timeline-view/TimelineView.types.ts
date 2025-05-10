interface Data {
  title: () => JSX.Element | React.ReactNode;
  content: () => JSX.Element | React.ReactNode;
  lineComponent?: () => JSX.Element | React.ReactNode;
  completed?: () => JSX.Element | React.ReactNode;
}

export interface TimelineViewProps {
  data: Data[];
}

export interface TimelineTitleProps {
  children: React.ReactNode;
}
