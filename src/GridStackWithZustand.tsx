import {
  createRef,
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { charts } from "./charts/charts";
import { GridStack, GridStackNode, GridStackWidget } from "gridstack";

export interface Widget {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  content: JSX.Element;
}

export type GridItem = Omit<Widget, "content">;

interface GridProps {
  items: Widget[];
  onChangeItems: (updatedItems: GridItem []) => void;
}

export const GridStackWithZustand: FC<GridProps> = ({
  items,
  onChangeItems,
}) => {
  const refs = useRef<Record<number, MutableRefObject<HTMLDivElement>>>({});

  if (Object.keys(refs.current).length !== charts.length) {
    charts.forEach(({ id }) => {
      refs.current[id] = refs.current[id] || createRef();
    });
  }

  const handleGridChange = useCallback(
    (grid: GridStack) => {
      const layout = grid.save(false) as GridStackWidget[];

      // Преобразуем layout в формат массива виджетов (без content)
      const updatedItems = layout.map((widget: GridStackNode) => ({
        id: widget.id,
        x: widget.x as number,
        y: widget.y as number,
        w: widget.w as number,
        h: widget.h as number,
      }));

      onChangeItems(updatedItems);
    },
    [onChangeItems]
  );

  useEffect(() => {
    const grid = GridStack.init({
      float: false,
      cellHeight: "168px",
    });

    grid.removeAll(false);

    items.forEach(({ id, x, y, w, h }) => {
      const element = refs.current[id]?.current;
      if (element) {
        grid.makeWidget(element);
        grid.update(element, { x, y, w, h });
      }
    });

    grid.on("change", () => {
      handleGridChange(grid);
    });

    return () => {
      grid.destroy(false);
    };
  }, [items, handleGridChange]);

  return (
    <div className="grid-stack">
      {items?.map((item) => (
        <div
          id={String(item.id)}
          ref={refs.current[item.id]}
          key={item.id}
          className="grid-stack-item"
          gs-w={item.w}
          gs-h={item.h}
          gs-id={item.id}
        >
          <div className="grid-stack-item-content">{item.content}</div>
        </div>
      ))}
    </div>
  );
};
