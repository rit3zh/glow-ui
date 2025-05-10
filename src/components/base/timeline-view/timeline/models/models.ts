export interface ITimeline {
  date: number;
  data: ITimelineData[];
}

export interface ITimelineData {
  title: string;
  subtitle: string;
  date: number;
}
