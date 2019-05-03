import React, { Component } from "react";
import styled from "styled-components";

import { Button } from "./Button";
import ErrorMessage from "./ErrorMessage";

const Container = styled.div`
  height: 100px;
  border: 1px solid #e8e8fb;
  padding: 20px;
  border-radius: 4px;
`;

const Card = styled.div`
  margin-bottom: 15px;
`;

type Props = {
  stripe: any;
  onSubmit: Function;
  buttonText?: string;
};

type State = {
  error?: string;
  isDisabled?: boolean;
};

const initialState: State = {
  isDisabled: false
};

export class CardInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.cardInputContainer = React.createRef();
  }

  state: State = initialState;
  card: any;
  cardInputContainer: React.RefObject<HTMLDivElement>;
  cardInputStyles = {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  };

  componentDidMount() {
    this.card = this.initCardElement();
  }

  private initCardElement = () => {
    const elements = this.props.stripe.elements();

    const card = elements.create("card", {
      style: this.cardInputStyles,
      hidePostalCode: true
    });

    card.mount(this.cardInputContainer.current);

    card.addEventListener("change", this.handleInput);

    return card;
  };

  private handleSubmit = () => {
    this.props.onSubmit(this.card);
  };

  private handleInput = (event: any) => {
    this.setState({
      error: event.error ? event.error.message : undefined,
      isDisabled: event.complete
    });
  };

  render() {
    const { buttonText } = this.props;
    const { error } = this.state;

    return (
      <div>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Card ref={this.cardInputContainer} />
        <Button disabled={!this.state.isDisabled} onClick={this.handleSubmit}>
          {buttonText ? buttonText : "Submit"}
        </Button>
      </div>
    );
  }
}
