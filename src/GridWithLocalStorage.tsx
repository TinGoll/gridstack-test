import {
  createRef,
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { GridStack, GridStackNode, GridStackWidget } from "gridstack";
import { charts } from "./charts/charts";
import styled from "@emotion/styled";


const Item = styled.div`
  border: 1px solid lightgray;
  border-radius: 6px;
  background-color: lightseagreen;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 16px;
`;

export const GridWithLocalStorage: FC = () => {
  const refs = useRef<Record<number, MutableRefObject<HTMLDivElement>>>({});

  if (Object.keys(refs.current).length !== charts.length) {
    charts.forEach(({ id }) => {
      refs.current[id] = refs.current[id] || createRef();
    });
  }

  const saveLayoutToLocalStorage = useCallback((grid: GridStack) => {
    const layout = grid.save(false) as GridStackWidget[];

    // Фильтрация дубликатов (если идентификаторы уникальны)
    const uniqueLayout = layout.reduce((acc: any[], curr: GridStackNode) => {
      if (!acc.find((item) => item.id === curr.id)) {
        acc.push(curr);
      }
      return acc;
    }, []);

    localStorage.setItem("grid-layout", JSON.stringify(uniqueLayout)); // сохраняем уникальное состояние
  }, []);

  const loadLayoutFromLocalStorage = useCallback((grid: GridStack) => {
    const layout = localStorage.getItem("grid-layout");
    if (layout) {
      const gridData = JSON.parse(layout);
      console.log("gridData", gridData);

      gridData.forEach((widget: GridStackNode) => {
        const { x, y, w, h, id } = widget;

        const element = document.getElementById(String(id));

        if (element) {
          grid.update(element, { x, y, w, h }); // восстанавливаем только координаты и размеры
        }
      });
    }
  }, []);

  useEffect(() => {
    const grid = GridStack.init({
      float: false,
      cellHeight: "168px",
    });

    grid.removeAll(false);

    charts.forEach(({ id }) => {
      grid.makeWidget(refs.current[id].current);
    });

    loadLayoutFromLocalStorage(grid);

    grid
      .on("change", () => {
        saveLayoutToLocalStorage(grid);
      })
      .on("dragstop", (_, element) => {
        const node = element.gridstackNode;
        const id = element.id;
        console.log(`Блок ${id} перемещен на ${node?.x},${node?.y}`);
      });

    return () => {
      grid.destroy(false);
    };
  }, [charts]);
  return (
    <div className="grid-stack">
      {charts?.map((item) => {
        return (
          <div
            id={String(item.id)}
            ref={refs.current[item.id]}
            key={item.id}
            className="grid-stack-item"
            gs-w="4"
            gs-h="2"
            gs-id={item.id}
          >
            <div className="grid-stack-item-content">
              <Item>Lorem ipsum dolor sit amet. {item.id}</Item>
            </div>
          </div>
        );
      })}
    </div>
  );
};
