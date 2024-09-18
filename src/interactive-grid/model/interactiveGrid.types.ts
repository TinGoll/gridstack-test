import { WidgetPosition } from "../interactiveGrid.types";

export type InteractiveGridData = {
  interactiveGridKeys: { [key: string]: WidgetPosition[] };
};
export type InteractiveGridActions = {
  setWidgetPositions: (key: string, positions: WidgetPosition[]) => void;
};

export type InteractiveGridStore = InteractiveGridData & InteractiveGridActions;
