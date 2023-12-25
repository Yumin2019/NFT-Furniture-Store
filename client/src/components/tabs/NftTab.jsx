import { Box, Divider, useDisclosure, useToast } from "@chakra-ui/react";
import { BasicDialog } from "./../dialog/BasicDialog";
import { InputDialog } from "../dialog/InputDialog";
import { NftDetailDialog } from "./../dialog/NftDetailDialog";
import { useAtom } from "jotai";
import { NftItem, nftDialogTextAtom } from "./item/NftItem";
import { useState } from "react";
import { tokenContract, web3 } from "../../contracts/contract";
import { accountAtom } from "../../App";
import { errorToast, successToast } from "../../utils/Helper";
import { api } from "../../utils/Axios";

export const NftTab = ({ nftList, nftInfoList, userInfo, onLoad }) => {
  const [account] = useAtom(accountAtom);
  const toast = useToast();
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

  const clickSell = async (text) => {
    onSellClose();

    try {
      let token = dialogTextAtom.token;
      let res = await tokenContract.methods
        .sellToken(token.tokenId, web3.utils.toWei(Number(text), "ether"))
        .send({ from: account });
      console.log(res);

      if (Number(res.status) === 1) {
        successToast(toast, "Your nft is on sale.");
        onLoad();
      } else {
        errorToast(toast, "Failed to transact");
      }
    } catch (e) {
      errorToast(toast, "Failed to transact");
      console.log(e);
    }
  };

  const cancelSales = async () => {
    try {
      let token = dialogTextAtom.token;
      let res = await tokenContract.methods
        .cancelTokenSales(token.tokenId)
        .send({ from: account });
      console.log(res);

      if (Number(res.status) === 1) {
        successToast(toast, "Your nft is not on sale.");
        onLoad();
      } else {
        errorToast(toast, "Failed to transact");
      }
    } catch (e) {
      errorToast(toast, "Failed to transact");
      console.log(e);
    }
  };

  const buyToken = async () => {
    try {
      let token = dialogTextAtom.token;
      let res = await tokenContract.methods
        .buyToken(token.tokenId)
        .send({ from: account, value: token.price });
      console.log(res);

      if (Number(res.status) === 1) {
        successToast(toast, "You bought NFT");
        onLoad();
      } else {
        errorToast(toast, "Failed to buy NFT");
      }
    } catch (e) {
      errorToast(toast, "Failed to buy NFT");
      console.log(e);
    }
  };

  const consumeToken = async () => {
    try {
      let token = dialogTextAtom.token;
      let info = dialogTextAtom.info;
      let res = await tokenContract.methods
        .deleteToken(token.tokenId)
        .send({ from: account });
      console.log(res);

      if (Number(res.status) === 1) {
        res = await api.post("/consumeToken", {
          furnitureId: info.furnitureId,
        });

        if (res.status === 200) {
          successToast(toast, "You consumed NFT");
          onLoad();
        } else {
          errorToast(toast, "Failed to consume NFT");
        }
      } else {
        errorToast(toast, "Failed to consume NFT");
      }
    } catch (e) {
      errorToast(toast, "Failed to consume NFT");
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
        transferInfoList={transferInfoList[1]}
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
