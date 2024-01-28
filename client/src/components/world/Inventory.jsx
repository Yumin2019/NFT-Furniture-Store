import { useAtom } from "jotai";
import { itemsAtom, mapAtom } from "./SocketManager";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useScroll } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useGrid } from "../../hooks/useGrid";
import { getQueryParam } from "../../utils/Helper";
import { api } from "../../utils/Axios";

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

export const Inventory = ({ onItemSelected, buildItems }) => {
  const [items] = useAtom(itemsAtom);
  const [map] = useAtom(mapAtom);
  const shopContainer = useRef();
  const scrollData = useScroll();
  const maxX = useRef(0);
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    getFurnitures();
  }, []);

  // 가진 가구의 개수를 토대로 선택할 수 있는 가구를 생성한다.
  const getFurnitures = async () => {
    try {
      const userId = getQueryParam();
      let res = await api.get(`/getFurnitures/${userId}`);
      let data = res.data.furnitures;
      console.log("furnitures", data);
      console.log("items", items);
      console.log("buildItems", buildItems);

      // 기존에 설치된 가구의 수를 파악한다. {a: 3, b: 1 ...}
      let counts = {};
      buildItems.map((v) => {
        if (!counts[v.name]) {
          counts[v.name] = 1;
        } else {
          ++counts[v.name];
        }
      });

      let itemList = data.map((v) => {
        let used = counts[v.name] || 0;
        return { item: items[v.name], count: v.count - used };
      });

      console.log("counts", counts);
      console.log("itemList", itemList);

      setItemList(itemList);
    } catch (e) {
      console.log(e);
    }

    return [];
  };

  useFrame(() => {
    shopContainer.current.position.x = -scrollData.offset * maxX.current;
  });

  let x = 0;
  return (
    <group ref={shopContainer}>
      {itemList.map((v, index) => {
        if (v.count <= 0) return;

        console.log(v);
        const xPos = x;
        x += v.item.size[0] / map.gridDivision + 1;
        maxX.current = x; //
        return (
          <InventoryItem
            key={index}
            position-x={xPos}
            item={v.item}
            onClick={(e) => {
              // Prevents the onPlaneClicked from firing just after we pick up an item
              e.stopPropagation();
              onItemSelected(v.item);
            }}
          />
        );
      })}
    </group>
  );
};
