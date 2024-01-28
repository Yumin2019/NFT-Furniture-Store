import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useFrame, useGraph } from "@react-three/fiber";
import { useAtom } from "jotai";
import { socket, userAtom } from "./SocketManager";
import { usePersonControls } from "../../hooks/usePersonControls";
import { Clock, Vector3 } from "three";

const getAnimName = (name) => {
  return `CharacterArmature|CharacterArmature|CharacterArmature|${name}`;
};

const clock = new Clock();

export function Rabbit({
  hairColor = "green",
  id,
  curAnim,
  position,
  rotation,
  ...props
}) {
  const group = useRef();
  const { scene, materials, animations } = useGLTF("/models/Rabbit.glb");
  const { actions } = useAnimations(animations, group);
  const [animation, setAnimation] = useState(getAnimName("Idle"));
  const [user] = useAtom(userAtom);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone);

  // 다른 유저의 움직임이나 애니메이션을 동기화한다. (자신의 것은 자기가 직접 처리하고 나머지 정보는 서버로부터 받음)
  useEffect(() => {
    group.current.position.x = position[0];
    group.current.position.z = position[1];
    group.current.rotation.y = rotation;
  }, [position, rotation]);

  useEffect(() => {
    setAnimation(curAnim);
  }, [curAnim]);

  // 현재 유저에 대한 애니메이션 변경 및 움직임을 처리한다.
  useEffect(() => {
    if (actions[animation]) {
      actions[animation].reset().fadeIn(0.32).play();

      // 내 애니메이션이 변경된 경우 서버에 이벤트를 전달한다.
      if (id === user) {
        socket.emit("changeAnim", animation);
      }
    }
    return () => actions[animation]?.fadeOut(0.32);
  }, [animation]);

  // UI에서 던지는 애니메이션을 처리한다. (자기 캐릭터에만 등록)
  useEffect(() => {
    const onMessage = async (event) => {
      if (
        event.data === "Wave" ||
        event.data === "Yes" ||
        event.data === "No" ||
        event.data === "Punch"
      ) {
        setAnimation(getAnimName(event.data));
      }
    };

    if (id === user) window.addEventListener("message", onMessage);
    return () => {
      if (id === user) window.removeEventListener("message", onMessage);
    };
  }, []);

  const { forward, backward, left, right } = usePersonControls(id === user);

  useFrame((state) => {
    // 자신의 캐릭터인 경우, 움직임을 처리한다.
    if (id === user) {
      let isMoved = false;
      let velocity = 3;
      let delta = clock.getDelta();

      if (forward || backward) {
        let vector = new Vector3(0, 0, forward ? 1 : -1).applyQuaternion(
          group.current.quaternion
        );

        let pos = group.current.position;
        let moveX = vector.x * velocity * delta;
        let moveZ = vector.z * velocity * delta;

        pos.x += moveX;
        pos.z += moveZ;
        isMoved = true;

        if (pos.x < 0) pos.x = 0;
        else if (pos.x > 10) pos.x = 10;
        if (pos.z < 0) pos.z = 0;
        else if (pos.z > 10) pos.z = 10;

        if (left) {
          group.current.rotation.y -= 4.5 * delta;
        } else if (right) {
          group.current.rotation.y += 4.5 * delta;
        }
      }

      if (isMoved) {
        setAnimation(getAnimName("Run"));
        socket.emit(
          "move",
          [group.current.position.x, group.current.position.z],
          group.current.rotation.y
        );
      } else if (
        animation !== getAnimName("Punch") &&
        animation !== getAnimName("Yes") &&
        animation !== getAnimName("No") &&
        animation !== getAnimName("Wave")
      ) {
        setAnimation(getAnimName("Idle"));
      }

      state.camera.position.x = group.current.position.x + 8;
      state.camera.position.y = group.current.position.y + 8;
      state.camera.position.z = group.current.position.z + 8;
      state.camera.lookAt(group.current.position);
    }
  });

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      name={`character-${id}`}
      scale={[0.35, 0.35, 0.35]}
    >
      <group name="Root_Scene">
        <group name="RootNode">
          <group
            name="CharacterArmature"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <primitive object={nodes.Root} />
          </group>
          <skinnedMesh
            name="Rabbit"
            geometry={nodes.Rabbit.geometry}
            material={materials.AtlasMaterial}
            skeleton={nodes.Rabbit.skeleton}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={140}
            castShadow
          />
          <skinnedMesh
            name="Eyes"
            geometry={nodes.Eyes.geometry}
            material={materials.AtlasMaterial}
            skeleton={nodes.Eyes.skeleton}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={140}
            castShadow
          />
          <skinnedMesh
            name="Hair"
            geometry={nodes.Hair.geometry}
            material={materials.AtlasMaterial}
            skeleton={nodes.Hair.skeleton}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={140}
            castShadow
          >
            <meshStandardMaterial color={hairColor} />
          </skinnedMesh>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/Rabbit.glb");
