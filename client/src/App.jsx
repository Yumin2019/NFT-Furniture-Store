import { MainPage, loginAtom } from "./pages/MainPage";
import { LoginPage } from "./pages/LoginPage";
import { Route, Routes } from "react-router-dom";
import { FindPasswordPage } from "./pages/FindPasswordPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { UserInfoPage } from "./pages/UserInfoPage";
import { useEffect, useState } from "react";
import { atom, useAtom } from "jotai";
import { api } from "./utils/Axios";
import { useNavigate } from "react-router-dom";
import { isMainPage } from "./utils/Helper";
import { FurnitureWorldPage } from "./pages/FurnitureWorldPage";

export const accountAtom = atom("");
export const txHandlerAtom = atom({
  handler: async (tx) => {
    console.log("handler");
  },
});

export const setTxHandler = (handler) => {
  txHandler = handler;
};

let txHandler = async (tx) => {
  console.log("handler");
};

function App() {
  const navigate = useNavigate();
  const [account, setAccount] = useAtom(accountAtom);
  const [loginInfo, setLoginInfo] = useAtom(loginAtom);

  useEffect(() => {
    const onMessage = async (event) => {
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
    };

    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
    };
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
        <Route
          path="/furnitureWorld/:userId"
          element={<FurnitureWorldPage />}
        />
      </Routes>
    </>
  );
}

export default App;
