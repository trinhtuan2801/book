import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ScrollToTop from "./ultils/ScrollToTop";
import { Provider } from 'react-redux'
import store from "./redux/store";
import { SnackbarProvider, useSnackbar } from 'notistack'
import { IconButton } from "@material-ui/core";
import { Clear } from "@material-ui/icons";

ReactDOM.render(
  // <React.StrictMode>
  <BrowserRouter>
    <Provider store={store}>
      <ScrollToTop />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'top'
        }}
        autoHideDuration={4000}
        action={id => {
          const { closeSnackbar } = useSnackbar()
          return (
            <IconButton size='small' onClick={() => closeSnackbar(id)}>
              <Clear />
            </IconButton>
          )
        }}
      >
        <App />
      </SnackbarProvider>
    </Provider>
  </BrowserRouter>
  // </React.StrictMode>,
  ,
  document.getElementById('root')
)