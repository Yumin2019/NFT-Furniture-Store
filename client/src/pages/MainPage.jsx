import { NftCard } from "../components/NftCard";
import {
  Button,
  Grid,
  Center,
  useDisclosure,
  Box,
  Toast,
  useToast,
} from "@chakra-ui/react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { RoomDialog } from "../components/dialog/RoomDialog";
import { nftDialogTextAtom } from "../components/tabs/item/NftItem";
import { BasicDialog } from "../components/dialog/BasicDialog";
import { InputDialog } from "../components/dialog/InputDialog";
import { NftDetailDialog } from "../components/dialog/NftDetailDialog";
import { BiSolidLogIn, BiWorld } from "react-icons/bi";
import { FaUser, FaPlusSquare } from "react-icons/fa";
import { api } from "../utils/Axios";
import { useEffect } from "react";
import { useAtom, atom } from "jotai";
import { errorToast, successToast } from "../utils/Helper";

const PageNumber = ({ number }) => {
  return (
    <Button
      colorScheme="teal"
      size="sm"
      fontSize={18}
      variant="ghost"
      fontWeight="bold"
    >
      {number}
    </Button>
  );
};

export const loginAtom = atom({});

export const MainPage = () => {
  const { isOpen: isRoomOpen, onOpen, onClose: onRoomClose } = useDisclosure();
  const [loginInfo, setLoginInfo] = useAtom(loginAtom);
  const toast = useToast();
  const navigate = useNavigate();

  const checkLogin = async () => {
    try {
      let res = await api.get("/loginStatus");
      console.log(res.data);
      setLoginInfo(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const clickLogout = async () => {
    if (!loginInfo.id) return;
    try {
      let res = await api.post("/logout");
      if (res.status === 200) {
        setLoginInfo({});
        navigate("/");
        successToast(toast, `Logout Success`);
      } else {
        errorToast(toast, `Logout Failed`);
      }
    } catch (e) {
      console.log(e);
      errorToast(toast, `Logout Failed`);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  // 블록체인 네트워크상 내 NFT 정보만 가져온 경우 예시
  let blockInfo = [
    {
      nftId: 1, // 0th nft
      itemId: 0, // item idx
      price: 5,
      isSelling: true,
      author: "kym",
    },
    {
      nftId: 2, // 0th nft
      itemId: 0, // item idx
      price: 0,
      isSelling: false,
      author: "kym", // current author
    },
    {
      nftId: 3, // 0th nft
      itemId: 0, // item idx
      price: 1,
      isSelling: true,
      author: "FSSAD", // current author
    },
  ];

  // DB에서 Item 테이블을 조회하여 정보가 있는 상황
  // dbInfo[itemId]
  let dbInfo = {
    0: {
      image: "/image/profile_image.png",
      name: "Furniture Coupon A",
      text: "this is really good a nft",
      couponType: "furniture",
    },
  };

  // NFT 이전 정보를 DB에서 가져왔다고 가정한다.
  // transferInfoList[nftId]
  let transferInfoList = {
    1: [
      {
        from: "A",
        to: "B",
        date: "2023-12-15 11:00:00",
        price: 5,
      },
      {
        from: "B",
        to: "kym",
        date: "2023-12-15 12:00:00",
        price: 1,
      },
    ],
    2: [
      {
        from: "A",
        to: "B",
        date: "2023-12-15 11:00:00",
        price: 5,
      },
      {
        from: "B",
        to: "kym",
        date: "2023-12-15 12:00:00",
        price: 1,
      },
    ],
  };

  const {
    isOpen: isBasicOpen,
    onOpen: onBasicOpen,
    onClose: onBasicClose,
  } = useDisclosure();

  const {
    isOpen: isSellOpen,
    onOpen: onSellOpen,
    onClose: onSellClose,
  } = useDisclosure();

  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose,
  } = useDisclosure();

  const [dialogTextAtom, setDialogTextAtom] = useAtom(nftDialogTextAtom);

  return (
    <>
      <RoomDialog isOpen={isRoomOpen} onClose={onRoomClose} />

      <BasicDialog
        isOpen={isBasicOpen}
        onClose={onBasicClose}
        title={dialogTextAtom.nftDialogTitle}
        text={dialogTextAtom.nftDialogText}
        yesText={dialogTextAtom.nftDialogYesText}
        noText="Cancel"
      />

      <InputDialog
        isOpen={isSellOpen}
        onClose={onSellClose}
        title={dialogTextAtom.nftDialogTitle}
        text={dialogTextAtom.nftDialogText}
        yesText={dialogTextAtom.nftDialogYesText}
        noText="Cancel"
        initialText={"0.01"}
      />

      <NftDetailDialog
        isOpen={isDetailOpen}
        onClose={onDetailClose}
        onBasicOpen={onBasicOpen}
        onSellOpen={onSellOpen}
        dbInfo={dbInfo[0]}
        blockInfo={blockInfo[0]}
        transferInfoList={transferInfoList[1]}
      />

      <Box
        w="100%"
        zIndex={100}
        position="fixed"
        top="0"
        backgroundColor="teal"
        height={75}
        pt={2.5}
        pl={8}
      >
        <header>
          <h1
            style={{
              color: "white",
              display: "inline-block",
              fontSize: 30,
              fontWeight: "bold",
            }}
          >
            Furniture NFT Store
          </h1>
          <div style={{ margin: 10, float: "right" }}>
            {!loginInfo.id && (
              <Link to={"/login"}>
                <Button
                  colorScheme="gray"
                  size="sm"
                  mr={4}
                  rightIcon={<BiSolidLogIn />}
                >
                  Login
                </Button>
              </Link>
            )}
            {loginInfo.id && (
              <Button
                colorScheme="gray"
                size="sm"
                mr={4}
                rightIcon={<BiSolidLogIn />}
                onClick={clickLogout}
              >
                Logout
              </Button>
            )}

            {loginInfo.id && (
              <Link to={`/userInfo/${loginInfo.id}`}>
                <Button
                  colorScheme="gray"
                  size="sm"
                  mr={4}
                  rightIcon={<FaUser />}
                >
                  My Info
                </Button>
              </Link>
            )}
            {!loginInfo.id && (
              <Link to={"/register"}>
                <Button
                  colorScheme="gray"
                  size="sm"
                  mr={4}
                  rightIcon={<FaPlusSquare />}
                >
                  Register
                </Button>
              </Link>
            )}
            {loginInfo.id && (
              <Button
                colorScheme="gray"
                size="sm"
                mr={4}
                onClick={onOpen}
                rightIcon={<BiWorld />}
              >
                Furniture World
              </Button>
            )}
          </div>
        </header>
      </Box>

      {/* Nft List 최대 10개까지 출력하고 페이징을 이용한다. */}
      <Center paddingTop={100}>
        <Grid templateColumns="repeat(5, 1fr)" gap={6}>
          {blockInfo.map((v, index) => {
            let itemInfo = dbInfo[v.itemId];
            return (
              <NftCard
                key={index}
                image={itemInfo.image}
                name={itemInfo.name}
                text={itemInfo.text}
                author={v.author}
                type={itemInfo.couponType}
                isSelling={v.isSelling}
                isMyNft={v.author === "kym"}
                price={v.price}
                onBasicOpen={onBasicOpen}
                onSellOpen={onSellOpen}
                onItemClick={(e) => {
                  console.log("clicked");
                  onDetailOpen();
                }}
              />
            );
          })}
        </Grid>
      </Center>
      <div style={{ margin: 16 }} />

      {/* Pagination  */}
      {/* <Center>
        <Button
          colorScheme="teal"
          size="sm"
          variant="ghost"
          fontSize={30}
          mr={1}
          pb={1}
        >
          «
        </Button>
        <PageNumber number={1} />
        <PageNumber number={2} />
        <PageNumber number={3} />
        <Button
          colorScheme="teal"
          size="sm"
          variant="ghost"
          fontSize={30}
          ml={1}
          pb={1}
        >
          »
        </Button>
      </Center> */}
    </>
  );
};
