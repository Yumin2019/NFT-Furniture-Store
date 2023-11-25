import {
  Environment,
  OrbitControls,
  ContactShadows,
  useCursor,
} from "@react-three/drei";
import { AnimatedWoman } from "./AnimatedWoman";
import { useAtom } from "jotai";
import { charactersAtom, mapAtom, socket } from "./SocketManager";
import * as THREE from "three";
import { useState } from "react";
import { Item } from "./item";

export const Experience = () => {
  const [characters] = useAtom(charactersAtom);
  const [map] = useAtom(mapAtom);
  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);

  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.3} />
      <ContactShadows blur={2} />
      <OrbitControls />

      {map?.items.map((item, idx) => (
        <Item key={`${item.name}-${idx}`} item={item} />
      ))}

      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-0.001}
        onClick={(e) => socket.emit("move", [e.point.x, 0, e.point.z])}
        onPointerDown={() => setOnFloor(true)}
        onPointerLeave={() => setOnFloor(false)}
        position-x={map?.size[0] / 2}
        position-z={map?.size[1] / 2}
      >
        <planeGeometry args={map.size} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      {characters.map((character) => (
        <AnimatedWoman
          key={character.id}
          id={character.id}
          position={
            new THREE.Vector3(
              character.position[0],
              character.position[1],
              character.position[2]
            )
          }
          hairColor={character.hairColor}
          topColor={character.topColor}
          bottomColor={character.bottomColor}
        />
      ))}
    </>
  );
};
