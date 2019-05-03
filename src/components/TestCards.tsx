import React from "react";
import styled from "styled-components";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify";

const Container = styled.div`
  background: #f8fbfd;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
`;

const TestCard = styled.div`
  cursor: pointer;
  margin: 15px 0;
  color: #666ee8;
`;

const showNotification = () => {
  toast.info("copied!", { bodyClassName: "center" });
};

export const TestCards = () => {
  return (
    <Container>
      <CopyToClipboard text={"4242424242424242"} onCopy={showNotification}>
        <TestCard>4242 4242 4242 4242 (default)</TestCard>
      </CopyToClipboard>
      <CopyToClipboard text={"4000000000003063"} onCopy={showNotification}>
        <TestCard>4000 0000 0000 3063 (3DS)</TestCard>
      </CopyToClipboard>
      <TestCard />
    </Container>
  );
};
