import { Box, Divider, useDisclosure, useToast } from "@chakra-ui/react";
import { BasicDialog } from "./../dialog/BasicDialog";
import { InputDialog } from "../dialog/InputDialog";
import { NftDetailDialog } from "./../dialog/NftDetailDialog";
import { useAtom } from "jotai";
import { NftItem, nftDialogTextAtom } from "./item/NftItem";
import { useState } from "react";
import {
  furnitureTokenAddress,
  tokenContract,
  web3,
} from "../../contracts/contract";
import { accountAtom } from "../../App";
import { errorToast, successToast } from "../../utils/Helper";
import { api } from "../../utils/Axios";
import { loginAtom } from "../../pages/MainPage";
import { useEffect } from "react";
import { setNftTabHandlers as setTxHandlers } from "../../pages/UserInfoPage";

export const NftTab = ({ nftList, nftInfoList, userInfo, onLoad }) => {
  const [account] = useAtom(accountAtom);
  const toast = useToast();
  const [loginInfo] = useAtom(loginAtom);

  useEffect(() => {
    // 다이얼로그에서 트랜잭션 콜백을 처리한다.
    setTxHandlers({
      deleteToken: async (tx) => {
        let res = await api.post("/consumeToken", {
          furnitureId: tx.furnitureId,
        });

        if (res.status === 200) {
          successToast(toast, "You consumed NFT");
          onLoad();
          if (isDetailOpen) onDetailClose();
        } else {
          errorToast(toast, "Failed to consume NFT");
        }
      },
      sellToken: (tx) => {
        successToast(toast, "Your nft is on sale.");
        onLoad();
        if (isDetailOpen) onDetailClose();
      },
      cancelTokenSales: (tx) => {
        successToast(toast, "Your nft is not on sale.");
        onLoad();
        if (isDetailOpen) onDetailClose();
      },
      buyToken: async (tx) => {
        let res = await api.post("/addNftTransfer", {
          nftId: tx.nftId,
          fromUserId: tx.fromUserId,
          toUserId: tx.toUserId,
          price: Number(web3.utils.fromWei(tx.value, "ether")),
        });

        console.log(res);
        successToast(toast, "You bought NFT");
        onLoad();
        if (isDetailOpen) onDetailClose();
      },
    });
  }, []);

  const clickSell = async (text) => {
    onSellClose();

    try {
      let token = dialogTextAtom.token;
      let bytecode = tokenContract.methods
        .sellToken(token.tokenId, web3.utils.toWei(Number(text), "ether"))
        .encodeABI();
      console.log(bytecode);

      let tx = {
        from: loginInfo.walletAddress,
        to: furnitureTokenAddress,
        data: bytecode,
        url: `${window.location.protocol}//${window.location.host}`,
        method: "sellToken",
      };

      let data = { type: "sendTx", tx: tx };
      window.postMessage(data);
    } catch (e) {
      errorToast(toast, "Failed to transact");
      console.log(e);
    }
  };

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
        fromUserId: Number(token.userId),
        toUserId: loginInfo.id,
        nftId: Number(token.tokenId),
      };

      console.log(tx);

      let data = { type: "sendTx", tx: tx };
      window.postMessage(data);
    } catch (e) {
      errorToast(toast, "Failed to buy NFT");
      console.log(e);
    }
  };

  const consumeToken = async () => {
    try {
      let token = dialogTextAtom.token;
      let bytecode = tokenContract.methods
        .deleteToken(token.tokenId)
        .encodeABI();
      console.log(bytecode);

      let tx = {
        from: loginInfo.walletAddress,
        to: furnitureTokenAddress,
        data: bytecode,
        url: `${window.location.protocol}//${window.location.host}`,
        method: "deleteToken",
        furnitureId: dialogTextAtom.info.furnitureId,
      };

      let data = { type: "sendTx", tx: tx };
      window.postMessage(data);
    } catch (e) {
      errorToast(toast, "Failed to register");
      console.log(e);
    }
  };

  const clickBasicDialogOk = () => {
    onBasicClose();

    let text = dialogTextAtom.nftDialogYesText;
    if (text === "Buy") {
      buyToken();
    } else if (text === "Consume") {
      consumeToken();
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

  return (
    <>
      <BasicDialog
        isOpen={isBasicOpen}
        onClose={onBasicClose}
        title={dialogTextAtom.nftDialogTitle}
        text={dialogTextAtom.nftDialogText}
        yesText={dialogTextAtom.nftDialogYesText}
        noText="Cancel"
        onClick={clickBasicDialogOk}
      />

      <InputDialog
        isOpen={isSellOpen}
        onClose={onSellClose}
        title={dialogTextAtom.nftDialogTitle}
        text={dialogTextAtom.nftDialogText}
        yesText={dialogTextAtom.nftDialogYesText}
        noText="Cancel"
        initialText={"0.001"}
        onClick={clickSell}
      />

      <NftDetailDialog
        isOpen={isDetailOpen}
        onClose={onDetailClose}
        onBasicOpen={onBasicOpen}
        onSellOpen={onSellOpen}
        token={selectedInfo?.token}
        info={selectedInfo?.info}
        owner={userInfo?.name || ""}
      />

      {nftInfoList &&
        nftList &&
        nftList.map((v, index) => {
          return (
            <Box key={index}>
              <NftItem
                token={v}
                info={nftInfoList[v.nftItemId]}
                owner={userInfo?.name || ""}
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
              <Divider mt={2} mb={2} />
            </Box>
          );
        })}
    </>
  );
};
