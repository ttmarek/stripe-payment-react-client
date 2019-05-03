import React from "react";
import styled from "styled-components";
import RadioButton from "./RadioButton";
import { TestCards } from "./TestCards";

type Props = {
  items: Array<{ value: string; label: string }>;
  selectedItemValue?: string;
  onItemSelected: (itemValue: string) => void;
};

const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  width: 300px;
  padding-left: 25px;
  padding-top: 40px;
  right: 0;
  overflow: auto;
  height: 100%;
  background: #fff;
  box-shadow: 0 2px 19px 4px rgba(0, 0, 0, 0.04);
`;

export const Navigation = ({
  items,
  selectedItemValue,
  onItemSelected
}: Props) => {
  const radioButtons = items.map(item => (
    <RadioButton
      key={item.value}
      groupName="navigation"
      value={item.value}
      label={item.label}
      isChecked={item.value === selectedItemValue}
      onSelect={event => onItemSelected(event.currentTarget.value)}
    />
  ));

  return (
    <Container>
      <TestCards />
      {radioButtons}
    </Container>
  );
};
