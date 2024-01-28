import { Environment, Grid, OrbitControls } from "@react-three/drei";

import { useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { useGrid } from "../../hooks/useGrid";
import { Rabbit } from "./Rabbit";
import { FurnitureItem } from "./FurnitureItem";
import { charactersAtom, mapAtom, socket, userAtom } from "./SocketManager";
import {
  buildModeAtom,
  draggedItemAtom,
  draggedItemRotationAtom,
  shopModeAtom,
} from "./UI";
import { loginAtom } from "../../pages/MainPage";
import { Inventory } from "./Inventory";

export const Room = () => {
  const { vector3ToGrid, gridToVector3 } = useGrid();
  const [loginInfo] = useAtom(loginAtom);

  // 상점 여부, 빌드 모드 여부, 가구 목록
  const [buildMode, setBuildMode] = useAtom(buildModeAtom);
  const [shopMode, setShopMode] = useAtom(shopModeAtom);

  // 캐릭터 정보, 맵 정보(size, gridDivision, items), 수정하는 아이템 정보
  const [characters] = useAtom(charactersAtom);
  const [map] = useAtom(mapAtom);
  const [items, setItems] = useState(map?.items);

  // 드래그 아이템, 로테이션, 드래그 포지션 정보
  const [draggedItem, setDraggedItem] = useAtom(draggedItemAtom);
  const [draggedItemRotation, setDraggedItemRotation] = useAtom(
    draggedItemRotationAtom
  );

  const [deleteIdx, setDeleteIdx] = useState(-1);
  const [dragPosition, setDragPosition] = useState([0, 0]);
  const [canDrop, setCanDrop] = useState(false);

  const onPlaneClick = (e) => {
    if (!buildMode || draggedItem === null) return;

    // 아이템 드래그를 놓았을 때에 대한 처리를 진행한다.
    if (canDrop) {
      setItems((prev) => {
        const newItems = [...prev];
        delete newItems[draggedItem].tmp;
        newItems[draggedItem].gridPosition = vector3ToGrid(e.point);
        newItems[draggedItem].rotation = draggedItemRotation;

        console.log("dragged: ", newItems[draggedItem]);
        return newItems;
      });
    }

    setDraggedItem(null);
  };

  useEffect(() => {
    if (draggedItem === null) {
      // 드래깅에 사용한 tmp가 있거나, deleteIdx와 매칭되는 경우 삭제한다.
      // deleteIdx를 사용한 이후에 -1로 바꿔서 다시 처리되지 않도록 한다.
      setItems((prev) =>
        prev.filter((item, index) => !item.tmp && index !== deleteIdx)
      );

      setDeleteIdx(-1);
    }
  }, [draggedItem]);

  // 빌드 모드에서 특정 가구를 삭제하는 이벤트를 처리한다. (draggedItem으로 잘 안 되서 useState 사용)
  useEffect(() => {
    const onMessage = async (event) => {
      if (event.data.type === "deleteItem") {
        // 삭제할 인덱스를 설정한다.
        let deleteIdx = event.data.idx;
        setDeleteIdx(deleteIdx);
        setDraggedItem(null);

        console.log("deleteIdx", deleteIdx);
      }
    };
    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);

      // 방을 나가는 경우를 처리한다.
      socket.emit("exit");
    };
  }, []);

  useEffect(() => {
    if (draggedItem === null) {
      return;
    }

    const item = items[draggedItem];
    const width =
      draggedItemRotation === 1 || draggedItemRotation === 3
        ? item.size[1]
        : item.size[0];
    const height =
      draggedItemRotation === 1 || draggedItemRotation === 3
        ? item.size[0]
        : item.size[1];

    let droppable = true;

    // check if item is in bounds (맵을 넘어가는지)
    if (
      dragPosition[0] < 0 ||
      dragPosition[0] + width > map.size[0] * map.gridDivision
    ) {
      droppable = false;
    }

    if (
      dragPosition[1] < 0 ||
      dragPosition[1] + height > map.size[1] * map.gridDivision
    ) {
      droppable = false;
    }

    // check if item is not colliding with other items (충돌 처리 할 수 있는 가구만 처리)
    if (!item.walkable && !item.wall) {
      items.forEach((otherItem, idx) => {
        // ignore self
        if (idx === draggedItem) {
          return;
        }

        // ignore wall & floor
        if (otherItem.walkable || otherItem.wall) {
          return;
        }

        // check item overlap
        const otherWidth =
          otherItem.rotation === 1 || otherItem.rotation === 3
            ? otherItem.size[1]
            : otherItem.size[0];
        const otherHeight =
          otherItem.rotation === 1 || otherItem.rotation === 3
            ? otherItem.size[0]
            : otherItem.size[1];

        // 사각형 충돌 조건을 잡는다.
        // r1.r < r2.l
        // r1.l > r2.r
        // r1.t > r2.b
        // r1.b < r2.t
        if (
          dragPosition[0] < otherItem.gridPosition[0] + otherWidth &&
          dragPosition[0] + width > otherItem.gridPosition[0] &&
          dragPosition[1] < otherItem.gridPosition[1] + otherHeight &&
          dragPosition[1] + height > otherItem.gridPosition[1]
        ) {
          droppable = false;
        }
      });
    }

    setCanDrop(droppable);
  }, [dragPosition, draggedItem, items, draggedItemRotation]);

  const controls = useRef();
  const state = useThree((state) => state);

  // 아이템을 수정한 다음에 buildMode가 풀리면 호출된다.
  useEffect(() => {
    let hasGrant =
      loginInfo.id === Number(window.location.pathname.split("/")[2]);
    if (buildMode) {
      setItems(map?.items || []);
      // cotrols가 카메라를 처리한다. (0, 0, 0)
      state.camera.position.set(8, 8, 8);
      controls.current.target.set(0, 0, 0);
    } else if (hasGrant) {
      socket.emit("itemsUpdate", items);
    }
  }, [buildMode]);

  useEffect(() => {
    if (shopMode) {
      state.camera.position.set(0, 4, 8);
      controls.current.target.set(0, 0, 0);
    } else {
      state.camera.position.set(8, 8, 8);
      controls.current.target.set(0, 0, 0);
    }
  }, [shopMode]);

  // 인벤토리에서 아이템을 선택한 경우
  const onItemSelected = (item) => {
    setItems((prev) => [
      ...prev,
      {
        ...item,
        gridPosition: [0, 0],
        tmp: true,
      },
    ]);

    setDraggedItem(items.length);
    console.log("setDraggedItem", items.length);
    setDraggedItemRotation(0);
    setShopMode(false);
  };

  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[-4, 4, -4]}
        castShadow
        intensity={0.35}
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera
          attach={"shadow-camera"}
          args={[-map.size[0], map.size[1], 10, -10]}
          far={map.size[0] + map.size[1]}
        />
      </directionalLight>

      {/* 카메라 공전을 위한 컴포넌트 */}
      <OrbitControls
        ref={controls}
        minDistance={5}
        maxDistance={20}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        screenSpacePanning={false}
        enableZoom={!shopMode}
      />

      {shopMode && (
        <Inventory onItemSelected={onItemSelected} buildItems={items} />
      )}

      {!shopMode &&
        (buildMode ? items : map.items).map((v, idx) => {
          return (
            <FurnitureItem
              key={`${v.name}-${idx}`}
              item={v}
              onClick={() => {
                if (!buildMode) {
                  return;
                }

                setDraggedItem(idx);
                setDraggedItemRotation(v.rotation || 0);

                console.log("draggedItem", idx);
              }}
              isDragging={draggedItem === idx}
              dragPosition={dragPosition}
              dragRotation={draggedItemRotation}
              canDrop={canDrop}
            />
          );
        })}

      {/* 하단 메시(바닥)를 처리한다. */}
      {!shopMode && (
        <mesh
          rotation-x={-Math.PI / 2}
          position-y={-0.002}
          onClick={onPlaneClick}
          onPointerMove={(e) => {
            if (!buildMode) {
              return;
            }

            // 값이 변하는 경우 업데이트 해준다.
            const newPosition = vector3ToGrid(e.point);
            if (
              !dragPosition ||
              newPosition[0] !== dragPosition[0] ||
              newPosition[1] !== dragPosition[1]
            ) {
              setDragPosition(newPosition);
            }
          }}
          position-x={map.size[0] / 2}
          position-z={map.size[1] / 2}
          receiveShadow
        >
          <planeGeometry args={map.size} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
      )}

      {/* 가구 보기 모드 */}
      {buildMode && !shopMode && (
        <Grid infiniteGrid fadeDistance={50} fadeStrength={5} />
      )}

      {!buildMode &&
        characters &&
        Object.values(characters).map((character) => (
          <Rabbit
            key={character.id}
            id={character.id}
            position={character.position}
            rotation={character.rotation}
            curAnim={character.curAnim}
            hairColor={character.hairColor}
          />
        ))}
    </>
  );
};
