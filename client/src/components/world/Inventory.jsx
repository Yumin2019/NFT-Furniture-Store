import { useAtom } from "jotai";
import { itemsAtom, mapAtom } from "./SocketManager";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useScroll } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useGrid } from "../../hooks/useGrid";

const InventoryItem = ({ item, ...props }) => {
  const { name, size } = item;
  const { scene } = useGLTF(`/models/items/${name}.glb`);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { gridToVector3 } = useGrid();

  return (
    <group {...props}>
      <group position={gridToVector3([0, 0], size[0], size[1])}>
        <primitive object={clone} />
      </group>
    </group>
  );
};

export const Inventory = ({ onItemSelected }) => {
  const [items] = useAtom(itemsAtom);
  const [map] = useAtom(mapAtom);
  const shopContainer = useRef();
  const scrollData = useScroll();
  const maxX = useRef(0);

  // 아이템을 배치한다.
  const InventoryItems = useMemo(() => {
    let x = 0;
    return Object.values(items).map((item, index) => {
      const xPos = x;
      x += item.size[0] / map.gridDivision + 1;
      maxX.current = x; // width

      return (
        <InventoryItem
          key={index}
          position-x={xPos}
          item={item}
          onClick={(e) => {
            // Prevents the onPlaneClicked from firing just after we pick up an item
            e.stopPropagation();
            onItemSelected(item);
          }}
        />
      );
    });
  }, [items]);

  useFrame(() => {
    shopContainer.current.position.x = -scrollData.offset * maxX.current;
  });

  return <group ref={shopContainer}>{InventoryItems}</group>;
};
