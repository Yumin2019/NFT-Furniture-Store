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
import { NftItem, nftDialogTextAtom } from "../components/tabs/item/NftItem";
import { BasicDialog } from "../components/dialog/BasicDialog";
import { InputDialog } from "../components/dialog/InputDialog";
import { NftDetailDialog } from "../components/dialog/NftDetailDialog";
import { BiSolidLogIn, BiWorld } from "react-icons/bi";
import { FaUser, FaPlusSquare } from "react-icons/fa";
import { api } from "../utils/Axios";
import { useEffect, useState } from "react";
import { useAtom, atom } from "jotai";
import { errorToast, successToast } from "../utils/Helper";
import { accountAtom, setTxHandler } from "../App";
import { furnitureTokenAddress, tokenContract } from "../contracts/contract";

export const loginAtom = atom({});

export const MainPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen: isRoomOpen, onOpen, onClose: onRoomClose } = useDisclosure();
  const [loginInfo, setLoginInfo] = useAtom(loginAtom);
  const [account, setAccount] = useAtom(accountAtom);
  const [nftList, setNftList] = useState([]);
  const [nftInfoList, setNftInfoList] = useState({});

  const checkLogin = async () => {
    try {
      let res = await api.get("/loginStatus");
      console.log(res.data);
      setLoginInfo(res.data);
      setAccount(res.data.walletAddress);
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

  const getNftInfoList = async () => {
    try {
      let res = await api.get("/getAllNftItems");
      console.log(res.data);
      setNftInfoList(res.data.items);
    } catch (e) {
      console.log(e);
    }
  };

  const getSalesToken = async () => {
    try {
      let res = await tokenContract.methods.getSaleTokens().call();
      console.log(res);
      setNftList(res);
    } catch (e) {
      setNftList([]);
      console.log(e);
    }
  };

  const getUserList = async () => {
    try {
      let res = await api.get("/getUserList");
      console.log(res.data);
      setUserList(res.data.users);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    checkLogin();
    getSalesToken();
    getNftInfoList();
    getUserList();

    // 트랜잭션 처리 callback 등록
    setTxHandler(async (tx) => {
      if (tx.method === "cancelTokenSales") {
        successToast(toast, "Your nft is not on sale.");
        getSalesToken();
        if (isDetailOpen) onDetailClose();
      } else if (tx.method === "buyToken") {
        successToast(toast, "You bought NFT");
        getSalesToken();
        if (isDetailOpen) onDetailClose();
      }
    });
  }, []);

  const cancelSales = async () => {
    try {
      let token = dialogTextAtom.token;
      let bytecode = tokenContract.methods
        .cancelTokenSales(token.tokenId)
        .encodeABI();
      console.log(bytecode);

      let tx = {
        from: loginInfo.walletAddress,
        to: furnitureTokenAddress,
        data: bytecode,
        url: `${window.location.protocol}//${window.location.host}`,
        method: "cancelTokenSales",
      };

      let data = { type: "sendTx", tx: tx };
      window.postMessage(data);
    } catch (e) {
      errorToast(toast, "Failed to transact");
      console.log(e);
    }
  };

  const buyToken = async () => {
    try {
      let token = dialogTextAtom.token;
      let bytecode = tokenContract.methods.buyToken(token.tokenId).encodeABI();
      console.log(bytecode);

      let tx = {
        from: loginInfo.walletAddress,
        to: furnitureTokenAddress,
        data: bytecode,
        value: Number(token.price),
        url: `${window.location.protocol}//${window.location.host}`,
        method: "buyToken",
      };

      let data = { type: "sendTx", tx: tx };
      window.postMessage(data);
    } catch (e) {
      errorToast(toast, "Failed to buy NFT");
      console.log(e);
    }
  };

  const clickBasicDialogOk = () => {
    onBasicClose();

    let text = dialogTextAtom.nftDialogYesText;
    if (text === "Buy") {
      buyToken();
    } else {
      cancelSales();
    }
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

  const [selectedInfo, setSelectedInfo] = useState({});
  const [dialogTextAtom, setDialogTextAtom] = useAtom(nftDialogTextAtom);
  const [userList, setUserList] = useState([]);

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
        onClick={clickBasicDialogOk}
      />

      <NftDetailDialog
        isOpen={isDetailOpen}
        onClose={onDetailClose}
        onBasicOpen={onBasicOpen}
        onSellOpen={onSellOpen}
        token={selectedInfo?.token}
        info={selectedInfo?.info}
        owner={(userList && userList[selectedInfo?.token?.userId]?.name) || ""}
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
      <Center paddingTop={100}>
        <Grid templateColumns="repeat(5, 1fr)" gap={6}>
          {nftInfoList &&
            userList &&
            nftList &&
            nftList.map((v, index) => {
              return (
                <NftCard
                  key={index}
                  token={v}
                  info={nftInfoList[v.nftItemId]}
                  owner={userList[v.userId]?.name}
                  onBasicOpen={onBasicOpen}
                  onSellOpen={onSellOpen}
                  onItemClick={(e) => {
                    console.log("clicked");
                    setSelectedInfo({
                      token: v,
                      info: nftInfoList[v.nftItemId],
                    });
                    onDetailOpen();
                  }}
                />
              );
            })}
        </Grid>
      </Center>
    </>
  );
};
