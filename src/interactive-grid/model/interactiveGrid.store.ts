import { createStore } from "zustand";
import { InteractiveGridStore } from "./interactiveGrid.types";
import { localStoragePersistMiddleware } from "../../helpers";

export const INTERACTIVE_GRID_LOCAL_STORAGE_KEY = "interactive-grid";

export const interactiveGridStore = createStore<InteractiveGridStore>()(
  localStoragePersistMiddleware(
    (set) => ({
      interactiveGridKeys: {},
      setWidgetPositions: (key, positions) =>
        set((state) => {
          return {
            interactiveGridKeys: {
              ...state.interactiveGridKeys,
              [key]: [...positions],
            },
          };
        }),
    }),
    INTERACTIVE_GRID_LOCAL_STORAGE_KEY
  )
);
