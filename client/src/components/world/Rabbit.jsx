import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useFrame, useGraph } from "@react-three/fiber";
import { useAtom } from "jotai";
import { userAtom } from "./SocketManager";
import { useGrid } from "../../hooks/useGrid";
import { usePersonControls } from "../../hooks/usePersonControls";
import { Clock, Vector3 } from "three";

const getAnimName = (name) => {
  return `CharacterArmature|CharacterArmature|CharacterArmature|${name}`;
};

const clock = new Clock();

export function Rabbit({ hairColor = "green", id, ...props }) {
  const { gridToVector3 } = useGrid();
  const group = useRef();
  const { scene, materials, animations } = useGLTF("/models/Rabbit.glb");
  const { actions } = useAnimations(animations, group);
  const [animation, setAnimation] = useState(getAnimName("Idle"));
  const [user] = useAtom(userAtom);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // useGraph creates two flat object collections for nodes and materials
  const { nodes } = useGraph(clone);

  useEffect(() => {
    actions[animation].reset().fadeIn(0.32).play();
    return () => actions[animation]?.fadeOut(0.32);
  }, [animation]);

  // Movement Logic
  const { forward, backward, left, right } = usePersonControls(id === user);

  useFrame((state) => {
    // 자신의 캐릭터인 경우, 움직임을 처리한다.
    if (id === user) {
      let isMoved = false;
      let velocity = 3;
      let delta = clock.getDelta();

      if (forward) {
        let frontVec = new Vector3(0, 0, 1).applyQuaternion(
          group.current.quaternion
        );

        let pos = group.current.position;
        let moveX = frontVec.x * velocity * delta;
        let moveZ = frontVec.z * velocity * delta;

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
      } else {
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
