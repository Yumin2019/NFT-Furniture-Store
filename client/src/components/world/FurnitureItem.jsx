import { useCursor, useGLTF } from "@react-three/drei";
import { useAtom } from "jotai";
import { mapAtom } from "./SocketManager";
import { useEffect, useMemo, useState } from "react";
import { SkeletonUtils } from "three-stdlib";
import { useGrid } from "../../hooks/useGrid";
import { buildModeAtom } from "./UI";

export const FurnitureItem = ({
  item,
  onClick,
  isDragging,
  dragPosition,
  canDrop,
  dragRotation,
}) => {
  const { name, gridPosition, size, rotation: itemRotation } = item;
  const rotation = isDragging ? dragRotation : itemRotation;
  const { gridToVector3 } = useGrid();
  const [map] = useAtom(mapAtom);
  const { scene } = useGLTF(`/models/items/${name}.glb`);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // 아이템의 회전 방향에 따라 width, heigh를 계산한다.
  const width = rotation === 1 || rotation === 3 ? size[1] : size[0];
  const height = rotation === 1 || rotation === 3 ? size[0] : size[1];

  const [hover, setHover] = useState(false);
  const [buildMode] = useAtom(buildModeAtom);
  useCursor(buildMode ? hover : undefined);

  useEffect(() => {
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, []);

  return (
    <group
      onClick={onClick}
      position={gridToVector3(
        isDragging ? dragPosition : gridPosition,
        width,
        height
      )}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <primitive object={clone} rotation-y={((rotation || 0) * Math.PI) / 2} />
      {/* 드래그 중인 경우에는 green mesh 또는 red mesh로 영역을 표시한다. (가구 배치) */}
      {isDragging && (
        <mesh>
          <boxGeometry
            args={[width / map.gridDivision, 0.2, height / map.gridDivision]}
          />
          <meshBasicMaterial
            color={canDrop ? "green" : "red"}
            opacity={0.3}
            transparent
          />
        </mesh>
      )}
    </group>
  );
};
