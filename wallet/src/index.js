import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { LoginPage } from "./pages/LoginPage";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { IntroPage } from "./pages/IntroPage";
import { CreateWalletPage } from "./pages/createWallet/CreateWalletPage";

const router = createMemoryRouter([
  {
    path: "/",
    element: <IntroPage />, // MainPage
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/intro",
    element: <IntroPage />,
  },
  {
    path: "/createWallet",
    element: <CreateWalletPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
