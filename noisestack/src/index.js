import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/store";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7dcc4a",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
  typography: {
    h1: {
      fontSize: "2.5rem",
      fontWeight: 500,
      marginBottom: "1rem",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
      marginBottom: "0.75rem",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 500,
      marginBottom: "0.5rem",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 400,
    },
    body1: {
      fontSize: "0.85rem",
    },
    body2: {
      fontSize: "0.75rem",
    },
  },
  spacing: 6,
});

const GlobalStyles = () => (
  <style>
    {`
      ::-webkit-scrollbar {
        width: 8px; 
      }

      ::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1); 
        border-radius: 10px;
      }

      ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3); 
        border-radius: 10px;
        &:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      }
    `}
  </style>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <GlobalStyles />
      <App />
    </ThemeProvider>
  </Provider>
);
