import { atom, useAtom } from "jotai";

export const buildModeAtom = atom(false);
export const shopModeAtom = atom(false);
export const draggedItemAtom = atom(null);
export const draggedItemRotationAtom = atom(0);

export const UI = () => {
  const [buildMode, setBuildMode] = useAtom(buildModeAtom);
  const [shopMode, setShopMode] = useAtom(shopModeAtom);
  const [draggedItem, setDraggedItem] = useAtom(draggedItemAtom);
  const [draggedItemRotation, setDraggedItemRotation] = useAtom(
    draggedItemRotationAtom
  );

  return (
    <>
      {/* 뒤로가기 */}
      {(buildMode || shopMode) && !draggedItem && (
        <button
          onClick={() => {
            shopMode ? setShopMode(false) : setBuildMode(false);
          }}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
          }}
        >
          뒤로가기
        </button>
      )}
      {/* 빌드버튼 */}
      {!buildMode && !shopMode && (
        <button
          onClick={() => {
            setBuildMode(true);
          }}
          style={{
            position: "absolute",
            left: 0,
            top: 25,
          }}
        >
          빌드
        </button>
      )}
      {/* 상점 버튼  */}
      {buildMode && !shopMode && !draggedItem && (
        <button
          onClick={() => {
            setShopMode(true);
          }}
          style={{
            position: "absolute",
            left: 150,
            top: 0,
          }}
        >
          상점
        </button>
      )}

      {/* 회전 버튼 */}
      {buildMode && !shopMode && draggedItem && (
        <button
          onClick={() => {
            setDraggedItemRotation(
              draggedItemRotation === 3 ? 0 : draggedItem + 1
            );
          }}
          style={{
            position: "absolute",
            left: 300,
            top: 0,
          }}
        >
          회전
        </button>
      )}

      {/* 취소버튼  */}
      {buildMode && !shopMode && draggedItem && (
        <button
          onClick={() => {
            setDraggedItem(null);
          }}
          style={{
            position: "absolute",
            left: 300,
            top: 25,
          }}
        >
          취소
        </button>
      )}
    </>
  );
};
