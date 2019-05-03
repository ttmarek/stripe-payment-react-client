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

  `create a new PaymentIntent for $1.00, 
   attach it to the Customer,
   and set capture_method set to "manual`,

  `wait for user to fill in card details`,

  `update paymentIntent amount with final amount of 
   sale (or higher estimate)`,

  `call handleCardPayment`,

  `(simulate a delay)`,

  `capture the PaymentIntent`
];

export class PaymentIntentsAutomatic extends Component<Props, State> {
  static contextType = StripeContext;

  componentDidMount() {
    this.handleCheckoutStart();
  }

  state: State = initialState;
  customerId?: string;
  paymentIntentId?: string;
  paymentIntentSecret?: string;

  private handleCheckoutStart = async () => {
    this.onStep(0);
    this.customerId = (await this.createCustomer()).data.id;

    this.onStep(1);
    const paymentIntent = (await this.createPaymentIntent()).data;
    this.paymentIntentId = paymentIntent.id;
    this.paymentIntentSecret = paymentIntent.client_secret;

    this.onStep(2);
  };

  private handleCheckoutSubmit = async (cardElement: any) => {
    this.setState({ hasSubmitted: true, isInProgress: true });

    this.onStep(3);
    await this.updatePaymentIntentAmount();

    this.onStep(4);
    const { error } = await this.handleCardPayment(cardElement);

    if (error) {
      this.setState({ isInProgress: false });
      return;
    }

    this.onStep(5);
    await new Promise(resolve => setTimeout(resolve, 4000)); // wait a bit

    this.onStep(6);
    await this.capturePaymentIntent();

    this.onStep(7);
    this.setState({ isInProgress: false });
  };

  private createCustomer = async () =>
    axios.post("/customers", {
      email: faker.internet.email(),
      name: faker.name.findName()
    });

  private createPaymentIntent = async () =>
    axios.post("/payment_intents", {
      amount: 100,
      currency: "usd",
      capture_method: "manual",
      customer: this.customerId
    });

  private updatePaymentIntentAmount = async () =>
    axios.post(`/payment_intents/${this.paymentIntentId}`, {
      amount: faker.commerce.price(1000, 100000, 0)
    });

  private handleCardPayment = async (cardElement: any) =>
    this.context.handleCardPayment(this.paymentIntentSecret, cardElement, {
      save_payment_method: true,
      payment_method_data: {
        billing_details: {
          name: faker.name.findName(),
          address: {
            line1: faker.address.streetAddress(),
            postal_code: faker.address.zipCode(),
            state: faker.address.state(),
            country: faker.address.country(),
            city: faker.address.city()
          }
        }
      }
    });

  private capturePaymentIntent = async () =>
    axios.post(`/payment_intents/${this.paymentIntentId}/capture`);

  private onStep = (index: number) => {
    this.setState({ currentStepIndex: index });
  };

  private handleRunAgain = () => {
    this.customerId = undefined;
    this.paymentIntentId = undefined;
    this.paymentIntentSecret = undefined;

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
