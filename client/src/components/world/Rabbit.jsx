import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useFrame, useGraph } from "@react-three/fiber";
import { useAtom } from "jotai";
import { userAtom } from "./SocketManager";
import { useGrid } from "../../hooks/useGrid";

const getAnimName = (name) => {
  return `CharacterArmature|CharacterArmature|CharacterArmature|${name}`;
};

const MOVEMENT_SPEED = 0.062;

export function Rabbit({ hairColor = "green", id, ...props }) {
  const position = useMemo(() => props.position, []);
  const [path, setPath] = useState();
  const { gridToVector3 } = useGrid();
  const group = useRef();
  const { scene, materials, animations } = useGLTF("/models/Rabbit.glb");
  const { actions } = useAnimations(animations, group);
  const [animation, setAnimation] = useState(getAnimName("Idle"));
  const [user] = useAtom(userAtom);

  // Skinned mesh cannot be re-used in threejs without cloning them
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // useGraph creates two flat object collections for nodes and materials
  const { nodes } = useGraph(clone);

  // 각 캐릭터의 pathfinding 처리
  useEffect(() => {
    console.log("props 바뀌었음");
    const path = [];
    props.path?.forEach((gridPosition) => {
      path.push(gridToVector3(gridPosition));
    });

    setPath(path);
  }, [props.path]);

  useEffect(() => {
    actions[animation].reset().fadeIn(0.32).play();
    return () => actions[animation]?.fadeOut(0.32);
  }, [animation]);

  useFrame((state) => {
    // 패스파인딩 처리를 진행한다. 움직여야 하는 경우, 일정 거리 미만인 경우(하나 없애기), 멈추는 경우
    if (path?.length && group.current.position.distanceTo(path[0]) > 0.5) {
      const direction = group.current.position
        .clone()
        .sub(path[0])
        .normalize()
        .multiplyScalar(MOVEMENT_SPEED);

      group.current.position.sub(direction);
      group.current.lookAt(path[0]);
      setAnimation(getAnimName("Run"));
    } else if (path?.length) {
      path.shift();
    } else {
      setAnimation(getAnimName("Idle"));
    }

    // 자신의 캐릭터를 처리하는 경우에는 카메라도 옮긴다.
    if (id === user) {
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
