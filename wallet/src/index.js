import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { LoginPage } from "./pages/LoginPage";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { IntroPage } from "./pages/IntroPage";
import { MainPage } from "./pages/MainPage";
import { CreateWalletPage } from "./pages/createWallet/CreateWalletPage";
import { ImportWalletPage } from "./pages/importWallet/ImportWalletPage";
import { useAtom, atom } from "jotai";

export const tabAtom = atom(false);
const router = createMemoryRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/intro",
    element: <IntroPage />,
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

const Root = () => {
  const [isTabAtom] = useAtom(tabAtom);

  return (
    <React.StrictMode>
      <ChakraProvider>
        <Box
          w={!isTabAtom ? "375px" : "600px"}
          h={!isTabAtom ? "575px" : "800px"}
        >
          <RouterProvider router={router} />
        </Box>
      </ChakraProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
