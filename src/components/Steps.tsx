import React from "react";
import styled from "styled-components";

type Props = {
  steps: string[];
  currentStepIndex?: number;
};

type ListItemStyleType = "pending" | "inProgress" | "done";

const List = styled.ol`
  counter-reset: listitem;
  list-style: none;
  margin: 0;
`;

const listItemStyles: {
  [key: string]: { color: string; background: string };
} = {
  pending: {
    color: "#697386",
    background: "#e3e8ee"
  },
  inProgress: {
    color: "#c85d42",
    background: "#fdbc72"
  },
  done: {
    color: "#0a7261",
    background: "#74e4a2"
  }
};

const ListItem = styled.li<{ itemStyle: ListItemStyleType }>`
  position: relative;
  margin: 15px 0;
  padding-left: 30px;

  &::before {
    counter-increment: listitem;
    content: counter(listitem);
    background: ${props => listItemStyles[props.itemStyle].background};
    color: ${props => listItemStyles[props.itemStyle].color};
    font-size: 13px;
    font-weight: 500;
    line-height: 11px;
    text-align: center;
    padding: 4px 0;
    height: 11px;
    width: 19px;
    border-radius: 10px;
    position: absolute;
    left: 0;
    top: 3px;
  }
`;

export const Steps = ({ steps, currentStepIndex }: Props) => {
  const listItems = steps.map((step, index) => {
    let listItemStyle: ListItemStyleType = "pending";

    if (currentStepIndex !== undefined) {
      if (index === currentStepIndex) {
        listItemStyle = "inProgress";
      } else if (index < currentStepIndex || currentStepIndex >= steps.length) {
        listItemStyle = "done";
      }
    }

    return (
      <ListItem key={index} itemStyle={listItemStyle}>
        {step}
      </ListItem>
    );
  });

  return <List>{listItems}</List>;
};
