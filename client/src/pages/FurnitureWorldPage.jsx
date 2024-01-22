import { ScrollControls } from "@react-three/drei";
import { Room } from "../components/world/Room";
import { UI } from "../components/world/UI";
import { Canvas } from "@react-three/fiber";
import { SocketManager, socket } from "../components/world/SocketManager";
import { useEffect } from "react";
import { getQueryParam } from "../utils/Helper";

export const FurnitureWorldPage = () => {
  useEffect(() => {
    socket.emit("join", getQueryParam());
  }, []);

  return (
    <>
      <SocketManager />
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 30 }}>
        <color attach="background" args={["#ececec"]} />
        <ScrollControls pages={4}>
          <Room />
        </ScrollControls>
      </Canvas>
      <UI />
    </>
  );
};
