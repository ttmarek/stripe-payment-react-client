import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  body {
      font-size: 15px;
      line-height: 1.4em;
      color: #525f7f;
      margin: 0;
      padding: 0;
      background: #f8fbfd;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  }

  .center {
    text-align: center;
  }

 /**
  * The CSS shown here will not be introduced in the Quickstart guide, but shows
  * how you can use CSS to style your Element's container.
  */

.StripeElement {
  box-sizing: border-box;

  height: 40px;

  padding: 10px 12px;

  border: 1px solid transparent;
  border-radius: 4px;
  background-color: white;

  box-shadow: 0 1px 3px 0 #e6ebf1;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}

.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

.StripeElement--invalid {
  border-color: #fa755a;
}

.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
}
`;
