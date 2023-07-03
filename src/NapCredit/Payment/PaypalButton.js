import React from "react";
import ReactDOM from "react-dom";
import "./_paypal.scss";
const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
export default function PayPal({ value }) {
  const style = {
    color: "blue",
    shape: "pill",
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: value,
            currency_code: "USD",
          },
          // invoice_id: "abcdef",
          // custom_id: "ccdefg",
        },
      ],
    });
  };
  const onApprove = (data, actions) => {
    // window.location.href = "/payment/confirm";
    return actions.order.capture();
  };
  const onError = (error) => {
    console.error(error);
  };
  return (
    <div className="paypal-container">
      <PayPalButton
        createOrder={(data, actions) => createOrder(data, actions)}
        onApprove={(data, actions) => onApprove(data, actions)}
        onError={(error) => onError(error)}
        style={style}
      />
    </div>
  );
}
