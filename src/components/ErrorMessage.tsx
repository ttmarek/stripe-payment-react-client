import React from "react";
import styled from "styled-components";

const Container = styled.div``;

type Props = {
  children: React.ReactNode;
};

const ErrorMessage = (props: Props) => {
  return <Container>{props.children}</Container>;
};

export default ErrorMessage;
