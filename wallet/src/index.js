import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { LoginPage } from "./pages/LoginPage";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { IntroPage } from "./pages/IntroPage";
import { MainPage } from "./pages/MainPage";
import { CreateWalletPage } from "./pages/createWallet/CreateWalletPage";
import { ImportWalletPage } from "./pages/importWallet/ImportWalletPage";

const router = createMemoryRouter([
  {
    path: "/",
    element: <IntroPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/main",
    element: <MainPage />,
  },
  {
    path: "/createWallet",
    element: <CreateWalletPage />,
  },
  {
    path: "/importWallet",
    element: <ImportWalletPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
