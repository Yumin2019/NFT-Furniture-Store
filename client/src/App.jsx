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

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/findPassword" element={<FindPasswordPage />} />
        <Route path="/resetPassword" element={<ResetPasswordPage />} />
        <Route path="/userInfo" element={<UserInfoPage />} />
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
