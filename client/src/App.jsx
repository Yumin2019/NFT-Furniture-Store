import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { SocketManager } from "./components/SocketManager";
import { UI } from "./components/UI";
import { ScrollControls } from "@react-three/drei";
import { MainPage, loginAtom } from "./pages/MainPage";
import { LoginPage } from "./pages/LoginPage";
import { Route, Routes } from "react-router-dom";
import { FindPasswordPage } from "./pages/FindPasswordPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { UserInfoPage } from "./pages/UserInfoPage";
import { useEffect, useState } from "react";
import { atom, useAtom } from "jotai";
import { useToast } from "@chakra-ui/react";
import { api } from "./utils/Axios";
import { useNavigate } from "react-router-dom";
import { errorToast, isMainPage, successToast } from "./utils/Helper";

export const accountAtom = atom("");

function App() {
  const toast = useToast();
  const navigate = useNavigate();
  const [account, setAccount] = useAtom(accountAtom);
  const [loginInfo, setLoginInfo] = useAtom(loginAtom);

  const txHandler = async (tx) => {
    if (tx.method === "registerAccount") {
      // User 정보에 account를 등록한다.
      let res = await api.post("/registerAccount", { address: tx.from });
      if (res.status === 200) {
        successToast(toast, "Account is registered");
        navigate(0);
      } else {
        errorToast(toast, "Failed to register");
      }
    }
  };

  useEffect(() => {
    window.addEventListener("message", async (event) => {
      if (event.data.type === "getAccountsRes") {
        let curAccount = event.data.list[event.data.accountIdx];
        console.log("curAccount", curAccount);
        setAccount(curAccount);
      } else if (event.data.type === "accountChanged") {
        let curAccount = event.data.data.account;
        console.log("curAccount", curAccount);
        setAccount(curAccount);
      } else if (event.data.type === "txRes") {
        console.log(event.data);
        console.log("txRes on page");
        txHandler(event.data.data);
      }
    });
  }, []);

  useEffect(() => {
    // 블록체인 계정이 변경되었을 경우, 실제 DB에서 매칭되는 계정 주소로 로그인한다. (있는 경우))
    changeWalletAccount();
  }, [account]);

  const redirect = () => {
    if (!isMainPage()) navigate("/");
    navigate(0);
  };

  // 월렛 계정을 변경한 경우, 해당 하는 계정으로 로그인한다.
  const changeWalletAccount = async () => {
    if (!account || account.length === 0 || loginInfo.walletAddress === account)
      return;
    console.log(loginInfo);

    try {
      console.log(`account ${account}`);
      let res = await api.post("loginWithAddress", {
        address: account,
      });

      if (res.status === 200) {
        loginProcesss(res.data.email, res.data.password);
      }
    } catch (e) {
      // 매칭되는 주소 정보가 없는 경우, 로그아웃 처리한다.
      if (e.response && e.response.status === 400) {
        logoutProcess();
      }
    }
  };

  const loginProcesss = async (email, password) => {
    try {
      let res = await api.post("login", {
        email,
        password,
      });

      if (res.status === 200) {
        console.log("로그인 성공 with address");
      }
    } catch (e) {
      console.log(e);
    }

    redirect();
  };

  const logoutProcess = async () => {
    try {
      let res = await api.post("/logout");
      if (res.status === 200) {
        setLoginInfo({});
      }
    } catch (e) {
      console.log(e);
    }

    redirect();
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/findPassword" element={<FindPasswordPage />} />
        <Route path="/resetPassword/:token" element={<ResetPasswordPage />} />
        <Route path="/userInfo/:userId" element={<UserInfoPage />} />
      </Routes>
      {/* <SocketManager />
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 30 }}>
        <color attach="background" args={["#ececec"]} />
        <ScrollControls pages={4}>
          <Experience />
        </ScrollControls>
      </Canvas>
      <UI /> */}
    </>
  );
}

export default App;
