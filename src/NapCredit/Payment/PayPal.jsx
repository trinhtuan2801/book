import { Box, Typography } from "@material-ui/core";
import { useEffect, useRef, useState } from "react";

export function PayPal({ product }) {
  const [paidFor, setPaidFor] = useState(false);
  const [error, setError] = useState(null);
  const paypalRef = useRef();

  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: product.description,
                amount: {
                  currency_code: 'USD',
                  value: product.price,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          setPaidFor(true);
        },
        onError: err => {
          setError(err);
          console.error(err);
        },
      })
      .render(paypalRef.current);
  }, [product.description, product.price]);

  if (paidFor) {
    return (
      <div>
        <h1>Congrats, you just bought {product.name}!</h1>
      </div>
    );
  }

  return (
    <Box
      marginLeft={1}
      marginTop={1}
      maxWidth='500px'
    >
      {/* <Typography>
        {product.description} for ${product.price}
      </Typography> */}
      {error && <Typography color='secondary'>*ERROR*</Typography>}

      <div ref={paypalRef} />
    </Box>
  );
}
