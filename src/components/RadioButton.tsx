import React from "react";
import styled from "styled-components";

const RadioButtonContainer = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  margin-left: 10px;
  cursor: pointer;
`;

type Props = {
  groupName: string;
  value: string;
  label: string;
  isChecked: boolean;
  onSelect: React.ReactEventHandler<HTMLInputElement>;
};

const RadioButton = ({
  groupName,
  value,
  isChecked,
  label,
  onSelect
}: Props) => {
  const uniqueId = `${label}-${value}`;

  return (
    <RadioButtonContainer>
      <input
        type="radio"
        id={uniqueId}
        name={groupName}
        value={value}
        checked={isChecked}
        onChange={onSelect}
      />
      <Label htmlFor={uniqueId}>{label}</Label>
    </RadioButtonContainer>
  );
};

export default RadioButton;
