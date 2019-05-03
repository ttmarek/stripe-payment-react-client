import React from "react";
import axios from "axios";
import ReactDOM from "react-dom";

import App from "./App";
import { StripeContext } from "./components";

// const webSocket = new WebSocket(process.env.REACT_APP_SERVER_SOCKET_URL || "");

// webSocket.onopen = () => {
//   webSocket.send("hello from js");
// };

// webSocket.onerror = error => {
//   console.log(error);
// };

// webSocket.onmessage = e => {
//   try {
//     const data = JSON.parse(e.data);
//     console.group(`WebHook: ${data.type}`);
//     console.log(data);
//     console.groupEnd();
//   } catch (error) {
//     console.log(error);
//   }
// };

axios.defaults.baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const stripe = (window as any).Stripe(process.env.REACT_APP_STRIPE_KEY);

ReactDOM.render(
  <StripeContext.Provider value={stripe}>
    <App />
  </StripeContext.Provider>,
  document.getElementById("root")
);
