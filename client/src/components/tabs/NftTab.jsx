import { Box, Divider, useDisclosure } from "@chakra-ui/react";
import { BasicDialog } from "./../dialog/BasicDialog";
import { InputDialog } from "../dialog/InputDialog";
import { NftDetailDialog } from "./../dialog/NftDetailDialog";
import { useAtom } from "jotai";
import { NftItem, nftDialogTextAtom } from "./item/NftItem";
import { useMemo, useState } from "react";
import { api } from "../../utils/Axios";

export const NftTab = ({ nftList, nftInfoList, userInfo }) => {
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
        transferInfoList={transferInfoList[1]}
        token={selectedInfo?.token}
        info={selectedInfo?.info}
        author={userInfo?.name || ""}
      />

      {nftInfoList &&
        nftList &&
        nftList.map((v, index) => {
          return (
            <Box key={index}>
              <NftItem
                token={v}
                info={nftInfoList[v.nftItemId]}
                author={userInfo?.name || ""}
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
