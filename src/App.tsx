import { FC } from "react";
import { InteractiveGrid } from "./interactive-grid";
import styled from "@emotion/styled";
import "gridstack/dist/gridstack.min.css";

const Item = styled.div`
  border: 1px solid lightgray;
  border-radius: 6px;
  background-color: lightseagreen;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 16px;
`;

export const App: FC = () => {
  return (
    <InteractiveGrid
      name="test-grid"
      widgets={[
        {
          id: "1",
          content: <Item>Lorem ipsum dolor sit. - 1</Item>,
        },
        {
          id: "2",
          content: <Item>Lorem ipsum dolor sit. - 2</Item>,
        },
        {
          id: "3",
          content: <Item>Lorem ipsum dolor sit. - 3</Item>,
        },
      ]}
    />
  );
};
