import {
  createRef,
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Widget } from "./interactiveGrid.types";
import { setWidgetPositions, useWidgetPosition } from "./model";
import { GridStack, GridStackNode, GridStackWidget } from "gridstack";

const DEFAULT_WIDGET_WIDTH = 4;
const DEFAULT_WIDGET_HEIGHT = 2;

export type InteractiveGridProps = {
  name: string;
  widgets: Widget[];
};

export const InteractiveGrid: FC<InteractiveGridProps> = ({
  name,
  widgets,
}) => {
  const positions = useWidgetPosition(name);
  const refs = useRef<Record<string, MutableRefObject<HTMLDivElement>>>({});

  if (Object.keys(refs.current).length !== widgets.length) {
    widgets.forEach(({ id }) => {
      refs.current[id] = refs.current[id] || createRef();
    });
  }

  const saveLayoutToStore = useCallback((grid: GridStack) => {
    const layout = grid.save(false) as GridStackWidget[];
    const updatedItems = layout.map((widget: GridStackNode) => ({
      id: widget.id as string,
      x: widget.x as number,
      y: widget.y as number,
      w: widget.w as number,
      h: widget.h as number,
    }));

    setWidgetPositions(name, updatedItems);
  }, []);

  useEffect(() => {
    const grid = GridStack.init({
      float: false,
      cellHeight: "168px",
    });

    grid.removeAll(false);

    widgets.forEach(({ id }) => {
      const element = refs.current[id]?.current;
      if (element) {
        grid.makeWidget(element);
      }
    });

    positions?.forEach(({ id, x, y, w, h }) => {
      const element = refs.current[id]?.current;
      if (element) {
        grid.update(element, { x, y, w, h });
      }
    });

    grid.on("change", () => {
      saveLayoutToStore(grid);
    });
    return () => {
      grid.destroy(false);
    };
  }, [widgets, positions, saveLayoutToStore]);

  return (
    <div className="grid-stack">
      {widgets?.map((item) => (
        <div
          id={item.id}
          ref={refs.current[item.id]}
          key={item.id}
          className="grid-stack-item"
          gs-w={item.w || DEFAULT_WIDGET_WIDTH}
          gs-h={item.h || DEFAULT_WIDGET_HEIGHT}
          gs-id={item.id}
        >
          <div className="grid-stack-item-content">{item.content}</div>
        </div>
      ))}
    </div>
  );
};
