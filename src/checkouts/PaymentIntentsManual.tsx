import React, { Component } from "react";
import axios from "axios";
import faker from "faker";

import {
  CheckoutCard,
  StripeContext,
  CardInput,
  Steps,
  WebHooks,
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
   set confirmation_method and capture_method
   to "manual"`,

  `wait for user to fill in card details`,

  `create a PaymentMethod with billing_details (name, address)`,

  `update the PaymentIntent amount with final amount of 
   sale (or higher estimate)`,

  `save the PaymentMethod to the Customer, and try to authorize
   (confirm) the PaymentIntent`,

  `handle any Card Actions if necessary`,

  `authorize (confirm) the PaymentIntent if needed`,

  `simulate a delay`,

  `capture the PaymentIntent`
];

export class PaymentIntentsManual extends Component<Props, State> {
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

    let intent: any;

    this.onStep(3);
    const result = await this.createPaymentMethod(cardElement);

    this.onStep(4);
    await this.updatePaymentIntentAmount();

    this.onStep(5);
    intent = (await this.confirmPaymentIntentAndSavePaymentMethod(
      result.paymentMethod.id
    )).data;

    this.onStep(6);
    if (intent.status === "requires_action") {
      const authResult = await this.handleCardAction();

      if (authResult.error) {
        this.setState({ isInProgress: false });
        return;
      }

      intent = authResult.paymentIntent;
    }

    this.onStep(7);
    if (intent.status === "requires_confirmation") {
      intent = (await this.confirmPaymentIntent()).data;
    }

    if (intent.status === "requires_capture") {
      this.onStep(8);
      await new Promise(resolve => setTimeout(resolve, 4000)); // wait a bit

      this.onStep(9);
      intent = await this.capturePaymentIntent();

      this.onStep(10);
    }

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
      confirmation_method: "manual",
      customer: this.customerId
    });

  private createPaymentMethod = async (cardElement: any) =>
    this.context.createPaymentMethod("card", cardElement, {
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
    });

  private updatePaymentIntentAmount = async () =>
    axios.post(`/payment_intents/${this.paymentIntentId}`, {
      amount: faker.commerce.price(1000, 100000, 0)
    });

  private confirmPaymentIntentAndSavePaymentMethod = async (
    paymentMethodId: string
  ) =>
    axios.post(`/payment_intents/${this.paymentIntentId}/confirm`, {
      payment_method: paymentMethodId,
      save_payment_method: true
    });

  private handleCardAction = async () =>
    this.context.handleCardAction(this.paymentIntentSecret);

  private confirmPaymentIntent = async () =>
    axios.post(`/payment_intents/${this.paymentIntentId}/confirm`);

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
