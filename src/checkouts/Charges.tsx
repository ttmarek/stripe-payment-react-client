import React, { Component } from "react";
import axios from "axios";
import faker from "faker";

import {
  StripeContext,
  CardInput,
  Steps,
  WebHooks,
  CheckoutCard,
  CheckoutContainer,
  CheckoutContainerColumn
} from "../components";

type Props = {};

type State = {
  hasSubmitted: boolean;
  isInProgress: boolean;
  currentStepIndex?: number;
};

const initialState: State = {
  isInProgress: false,
  hasSubmitted: false
};

const steps: string[] = [
  `create a new Customer`,

  `wait for user to fill in card details`,

  `create a token`,

  `attach the token to the Customer`,

  `authorize (confirm) the Charge`,

  `simulate a delay`,

  `capture the Charge`
];

export class Charges extends Component<Props, State> {
  static contextType = StripeContext;

  componentDidMount() {
    this.handleCheckoutStart();
  }

  state: State = initialState;
  customerId?: string;

  private handleCheckoutStart = async () => {
    this.onStep(0);
    this.customerId = (await this.createCustomer()).data.id;

    this.onStep(1);
  };

  private handleCheckoutSubmit = async (card: any) => {
    this.setState({ hasSubmitted: true, isInProgress: true });

    this.onStep(2);
    const { token } = await this.createToken(card);

    this.onStep(3);
    await this.addTokenToCustomer(token.id);

    this.onStep(4);
    const { data: charge } = await this.authorizeTheCharge();

    if (charge.code === "card_declined") {
      this.setState({ isInProgress: false });
      return;
    }

    this.onStep(5);
    await new Promise(resolve => setTimeout(resolve, 4000)); // wait a bit

    this.onStep(6);
    await this.captureTheCharge(charge.id);

    this.onStep(7);
    this.setState({ isInProgress: false });
  };

  private createCustomer = async () =>
    axios.post("/customers", {
      email: faker.internet.email(),
      name: faker.name.findName()
    });

  private createToken = async (card: any) =>
    this.context.createToken(card, {
      name: faker.name.findName(),
      address_line1: faker.address.streetAddress(),
      address_city: faker.address.city(),
      address_state: faker.address.state(),
      address_zip: faker.address.zipCode(),
      address_country: faker.address.countryCode()
    });

  private addTokenToCustomer = async (tokenId: string) =>
    axios.post(`/customers/${this.customerId}`, {
      source: tokenId
    });

  private authorizeTheCharge = async () =>
    axios.post("/charges", {
      amount: faker.commerce.price(1000, 100000, 0),
      currency: "usd",
      capture: false,
      customer: this.customerId
    });

  private captureTheCharge = async (chargeId: string) =>
    axios.post(`/charges/${chargeId}/capture`);

  private onStep = (index: number) => {
    this.setState({ currentStepIndex: index });
  };

  private handleRunAgain = () => {
    this.customerId = undefined;
    this.setState(initialState, () => {
      this.handleCheckoutStart();
    });
  };

  render() {
    const { currentStepIndex, hasSubmitted, isInProgress } = this.state;

    const form = hasSubmitted ? (
      <CardInput
        buttonText={isInProgress ? "In Progress..." : "Run Again"}
        onSubmit={isInProgress ? () => {} : this.handleRunAgain}
        stripe={this.context}
      />
    ) : (
      <CardInput onSubmit={this.handleCheckoutSubmit} stripe={this.context} />
    );

    return (
      <CheckoutContainer>
        <CheckoutContainerColumn>
          <CheckoutCard>{form}</CheckoutCard>
          <CheckoutCard title="Events">
            <WebHooks />
          </CheckoutCard>
        </CheckoutContainerColumn>
        <CheckoutContainerColumn>
          <Steps steps={steps} currentStepIndex={currentStepIndex} />
        </CheckoutContainerColumn>
      </CheckoutContainer>
    );
  }
}
