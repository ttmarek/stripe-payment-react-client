import React, { Component } from "react";
import styled from "styled-components";
import { WebHookCard } from "./WebHookCard";

type Props = {};

type State = {
  webhooks: any[];
};

const initialState: State = {
  webhooks: []
};

const Container = styled.div``;

export class WebHooks extends Component<Props, State> {
  componentDidMount() {
    this.websocket = new WebSocket(
      process.env.REACT_APP_SERVER_SOCKET_URL || ""
    );
    this.websocket.onmessage = this.handleMessages;
  }

  componentWillUnmount() {
    if (this.websocket) {
      this.websocket.close();
    }
  }

  state: State = initialState;

  websocket?: WebSocket;

  private handleMessages = (message: any) => {
    try {
      const data = JSON.parse(message.data);

      this.setState({
        webhooks: [...this.state.webhooks, data]
      });

      console.group(`WebHook: ${data.type}`);
      console.log(data);
      console.groupEnd();
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { webhooks } = this.state;

    const cards = webhooks.map((webhook, index) => (
      <WebHookCard webhook={webhook} key={index} />
    ));

    return <Container>{cards}</Container>;
  }
}
