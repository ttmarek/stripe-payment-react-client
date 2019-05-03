import React, { Component } from "react";
import styled from "styled-components";
import JSONTree from "react-json-tree";

type Props = {
  webhook: any;
};

type State = {
  isOpen: boolean;
};

const initialState: State = {
  isOpen: false
};

const Container = styled.div`
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const Title = styled.div`
  height: 50px;
  border-radius: 4px;
  color: #24b47e;
  padding: 0px 30px;
  border-left: 2px solid #24b47e
  box-shadow: 0 1px 3px 0 rgba(50, 50, 93, 0.15),
    0 4px 6px 0 rgba(112, 157, 199, 0.15);
  line-height: 50px;
  font-size: 18px;
  cursor: pointer;
`;

const DataDisplay = styled.div<{ isOpen: boolean }>`
  height: auto;
  overflow: scroll;
  max-height: ${props => (props.isOpen ? "700px" : 0)};
  transition: max-height 0.4s ease;
`;

const theme = {
  scheme: "monokai",
  base00: "#272822",
  base01: "#383830",
  base02: "#49483e",
  base03: "#75715e",
  base04: "#a59f85",
  base05: "#f8f8f2",
  base06: "#f5f4f1",
  base07: "#f9f8f5",
  base08: "#f92672",
  base09: "#fd971f",
  base0A: "#f4bf75",
  base0B: "#a6e22e",
  base0C: "#a1efe4",
  base0D: "#66d9ef",
  base0E: "#ae81ff",
  base0F: "#cc6633"
};

export class WebHookCard extends Component<Props, State> {
  state: State = initialState;

  private handleTitleClick = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const { isOpen } = this.state;
    const { webhook } = this.props;

    return (
      <Container>
        <Title onClick={this.handleTitleClick}>{webhook.type}</Title>
        <DataDisplay isOpen={isOpen}>
          <JSONTree
            theme={theme}
            data={webhook.data.object}
            invertTheme={true}
          />
        </DataDisplay>
      </Container>
    );
  }
}
