import React from "react";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import {
  Charges,
  PaymentIntentsAutomatic,
  PaymentIntentsManual
} from "./checkouts";
import { GlobalStyles, Navigation } from "./components";

type Props = {};

type State = {
  selectedCheckout?: string;
};

const Content = styled.div`
  background: #f8fbfd;
  width: calc(100% - 325px);
`;

class App extends React.Component<Props, State> {
  state: State = {
    selectedCheckout: undefined
  };

  private navItems = [
    { label: "Charges", value: "Charges" },
    { label: "PaymentIntents (Automatic)", value: "PaymentIntentsAutomatic" },
    { label: "PaymentIntents (Manual)", value: "PaymentIntentsManual" }
  ];

  handleNavItemSelected = (navItemValue: string) => {
    this.setState({ selectedCheckout: navItemValue });
  };

  getSelectedCheckout = (selectedCheckout?: string) => {
    const GetStarted = styled.div`
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      display: flex;
      width: calc(100% - 325px);
      align-items: center;
      justify-content: center;
    `;

    const GetStartedTitle = styled.div`
      font-size: 30px;
    `;

    switch (selectedCheckout) {
      case "Charges":
        return <Charges />;
      case "PaymentIntentsAutomatic":
        return <PaymentIntentsAutomatic />;
      case "PaymentIntentsManual":
        return <PaymentIntentsManual />;
      default:
        return (
          <GetStarted>
            <GetStartedTitle>select a checkout flow ➟</GetStartedTitle>
          </GetStarted>
        );
    }
  };

  render() {
    const { selectedCheckout } = this.state;

    const checkout = this.getSelectedCheckout(selectedCheckout);

    return (
      <div>
        <GlobalStyles />
        <Content>{checkout}</Content>
        <Navigation
          items={this.navItems}
          selectedItemValue={selectedCheckout}
          onItemSelected={this.handleNavItemSelected}
        />
        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          draggable
          pauseOnHover
        />
      </div>
    );
  }
}

export default App;
