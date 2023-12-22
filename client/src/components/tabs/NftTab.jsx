import { Box, Divider, useDisclosure } from "@chakra-ui/react";
import { BasicDialog } from "./../dialog/BasicDialog";
import { InputDialog } from "../dialog/InputDialog";
import { NftDetailDialog } from "./../dialog/NftDetailDialog";
import { useAtom } from "jotai";
import { NftItem, nftDialogTextAtom } from "./item/NftItem";

export const NftTab = () => {
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

      {blockInfo.map((v, index) => {
        let itemInfo = dbInfo[v.itemId];
        return (
          <Box key={index}>
            <NftItem
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
            <Divider mt={2} mb={2} />
          </Box>
        );
      })}
    </>
  );
};
