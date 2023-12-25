import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { SocketManager } from "./components/SocketManager";
import { UI } from "./components/UI";
import { ScrollControls } from "@react-three/drei";
import { MainPage } from "./pages/MainPage";
import { LoginPage } from "./pages/LoginPage";
import { Route, Routes } from "react-router-dom";
import { FindPasswordPage } from "./pages/FindPasswordPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { UserInfoPage } from "./pages/UserInfoPage";
import { useEffect, useState } from "react";
import { atom, useAtom } from "jotai";

export const accountAtom = atom("");

function App() {
  const [account, setAccount] = useAtom(accountAtom);

  // 메타마스크 연동 테스트 코드
  const getAccount = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        console.log(accounts[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAccount();
  }, []);

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
