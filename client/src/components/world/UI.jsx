import { atom, useAtom } from "jotai";
import { Flex, IconButton } from "@chakra-ui/react";
import { GiPunchBlast, GiAnticlockwiseRotation } from "react-icons/gi";
import { PiHandWavingFill } from "react-icons/pi";
import { BsEmojiHeartEyesFill } from "react-icons/bs";
import { FaFaceRollingEyes, FaBagShopping } from "react-icons/fa6";
import { IoBuild } from "react-icons/io5";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { loginAtom } from "../../pages/MainPage";
import { useEffect, useState } from "react";
import { api } from "../../utils/Axios";

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

  const [loginInfo, setLoginInfo] = useAtom(loginAtom);
  const [worldId, setWorldId] = useState(0);

  const checkLogin = async () => {
    try {
      let res = await api.get("/loginStatus");
      console.log(res.data);
      setLoginInfo(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setWorldId(window.location.pathname.split("/")[2]);
    checkLogin();
  }, []);

  return (
    <>
      {/* 애니메이션 인터페이스(Wave, Yes, No, Punch) */}
      {!buildMode && !shopMode && (
        <Flex
          gap={1}
          position="absolute"
          bottom={4}
          left="50%"
          transform="translate(-50%, 0%)"
        >
          <IconButton
            colorScheme="blue"
            border="0.5px solid black"
            padding={6}
            icon={<PiHandWavingFill size={30} />}
            onClick={() => {
              window.postMessage("Wave");
            }}
          />

          <IconButton
            colorScheme="green"
            border="0.5px solid black"
            padding={6}
            icon={<BsEmojiHeartEyesFill size={30} />}
            onClick={() => {
              window.postMessage("Yes");
            }}
          />

          <IconButton
            colorScheme="pink"
            border="0.5px solid black"
            padding={6}
            icon={<FaFaceRollingEyes size={30} />}
            onClick={() => {
              window.postMessage("No");
            }}
          />

          <IconButton
            colorScheme="red"
            border="0.5px solid black"
            padding={6}
            icon={<GiPunchBlast size={30} />}
            onClick={() => {
              window.postMessage("Punch");
            }}
          />
        </Flex>
      )}

      {/* 상단 가구 배치 인터페이스  */}
      {loginInfo.id === Number(worldId) && (
        <Flex gap={2} position="absolute" top={2} left={2}>
          {/* 뒤로 가기 */}
          {(buildMode || shopMode) && draggedItem === null && (
            <IconButton
              colorScheme="blue"
              border="0.5px solid black"
              icon={<IoMdArrowRoundBack size={30} />}
              onClick={() => {
                if (shopMode) {
                  setShopMode(false);
                } else {
                  setBuildMode(false);
                }
              }}
            />
          )}

          {/* 빌드버튼 */}
          {!buildMode && !shopMode && (
            <IconButton
              colorScheme="blue"
              border="0.5px solid black"
              icon={<IoBuild size={30} />}
              onClick={() => {
                setBuildMode(true);
              }}
            />
          )}

          {/* 상점 버튼  */}
          {buildMode && !shopMode && draggedItem === null && (
            <IconButton
              colorScheme="green"
              border="0.5px solid black"
              icon={<FaBagShopping size={30} />}
              onClick={() => {
                setShopMode(true);
              }}
            />
          )}

          {/* 회전 버튼 */}
          {buildMode && !shopMode && draggedItem !== null && (
            <IconButton
              colorScheme="blue"
              border="0.5px solid black"
              icon={<GiAnticlockwiseRotation size={30} />}
              onClick={() => {
                setDraggedItemRotation(
                  draggedItemRotation === 3 ? 0 : draggedItemRotation + 1
                );
              }}
            />
          )}

          {/* 취소버튼  */}
          {buildMode && !shopMode && draggedItem !== null && (
            <IconButton
              colorScheme="pink"
              border="0.5px solid black"
              icon={<MdCancel size={30} />}
              onClick={() => {
                window.postMessage({ type: "deleteItem", idx: draggedItem });
              }}
            />
          )}
        </Flex>
      )}
    </>
  );
};
