import { useStore } from "zustand";
import { interactiveGridStore } from "./interactiveGrid.store";
import { WidgetPosition } from "../interactiveGrid.types";

export const { setWidgetPositions } = interactiveGridStore.getState();

export const useWidgetPosition = (key: string): WidgetPosition[] | undefined =>
  useStore(interactiveGridStore, (state) => state.interactiveGridKeys?.[key]);
