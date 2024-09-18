export interface WidgetPosition {
  id: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

export type Widget = {
  content: JSX.Element;
} & WidgetPosition;
