import { useEffect, useRef } from "react";
import { Chart } from "./charts/charts";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";

interface GridStackComponentProps {
  charts: Chart[];
}

export const GridStackComponent: React.FC<GridStackComponentProps> = ({
  charts,
}) => {
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Проверяем, что gridRef.current не равен null, прежде чем передавать его в GridStack.init
    if (gridRef.current) {
      const grid = GridStack.init({
        float: false,
      }, gridRef.current);

      return () => {
        if (grid) {
          grid.destroy(false);
        }
      };
    }
  }, []);

  return (
    <div ref={gridRef} className="grid-stack">
      {charts.map((chart) => (
        <div
          key={chart.id}
          className="grid-stack-item"
          data-gs-width="4"
          data-gs-height="2"
        >
          <div className="grid-stack-item-content">
            <h3>{chart.name}</h3>
            {/* Подключение графика через iframe */}
            <iframe
              src={chart.src}
              title={chart.name}
              style={{ width: "100%", height: "100%" }}
            ></iframe>
          </div>
        </div>
      ))}
    </div>
  );
};
