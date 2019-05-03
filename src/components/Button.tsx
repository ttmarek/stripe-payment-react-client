import styled from "styled-components";

export const Button = styled.button`
  display: block;
  background: #666ee8;
  color: #fff;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  border: 0;
  font-weight: 700;
  width: 100%;
  height: 40px;
  outline: none;
  opacity: ${props => (props.disabled ? 0.8 : 1)};
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  transition: all 0.15s ease;
`;
