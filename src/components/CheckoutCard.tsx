import React from "react";
import styled from "styled-components";

export const Container = styled.div`
  border: 1px solid #e8e8fb;
  padding: 30px 20px;
  margin-top: 20px;
  border-radius: 4px;
`;

export const Title = styled.div`
  font-size: 18px;
  margin-bottom: 20px;
`;

type Props = {
  title?: string;
  children: React.ReactChild;
};

export const CheckoutCard = ({ title, children }: Props) => {
  return (
    <Container>
      {title && <Title>{title}</Title>}
      {children}
    </Container>
  );
};
