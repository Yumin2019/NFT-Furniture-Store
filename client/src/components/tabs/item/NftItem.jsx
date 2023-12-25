import { Flex, Text, Image, Button, Stack, Spacer } from "@chakra-ui/react";
import { atom, useAtom } from "jotai";
import { FaMoneyBill } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { loginAtom } from "../../../pages/MainPage";

export const nftDialogTextAtom = atom({
  nftDialogText: "",
  nftDialogTitle: "",
  nftDialogYesText: "",
});

export const NftItem = ({
  info,
  token,
  author,
  onBasicOpen,
  onSellOpen,
  onItemClick,
}) => {
  const [dialogTextAtom, setDialogTextAtom] = useAtom(nftDialogTextAtom);
  const [loginInfo] = useAtom(loginAtom);
  let isSelling = token?.isSelling || false;
  let isMyNft = loginInfo?.id === Number(token.userId);

  return (
    <Flex width="100%" alignItems="center" onClick={onItemClick}>
      <Image
        boxSize="65px"
        border="0.5px solid grey"
        src={info?.image || "/image/furniture_icon.svg"}
      />

      <Flex direction="column" ml={4}>
        <Text fontWeight="bold" fontSize={16}>
          {info?.name}
        </Text>
        <Text color="grey" fontSize={14}>
          {info?.desc}
        </Text>
        <Text fontSize={14} mt={2} color="teal.400">
          author: {author}
        </Text>
        <Text fontSize={14} color="teal.400">
          type: furniture
        </Text>
      </Flex>

      <Spacer />

      <Stack direction="column" alignItems="center" height={100}>
        {isMyNft && (
          <Button
            position="absolute"
            colorScheme="teal"
            variant="outline"
            width={100}
            mt={2}
            right={4}
            size="xs"
            rightIcon={!isSelling ? <FaMoneyBill /> : <MdCancel />}
            onClick={(e) => {
              setDialogTextAtom({
                nftDialogTitle: !isSelling ? "NFT Sell" : "Cancel Sales",
                nftDialogText: !isSelling
                  ? "Are you sure you want to sell this NFT? (MATIC)"
                  : "Are you sure you want to cancel this sale?",
                nftDialogYesText: !isSelling ? "Sell" : "Cancel Sales",
              });
              !isSelling ? onSellOpen() : onBasicOpen();
              e.stopPropagation();
            }}
          >
            {!isSelling ? "NFT Sell" : "Cancel Sales"}
          </Button>
        )}

        {!isMyNft && token?.isSelling && (
          <Button
            position="absolute"
            colorScheme="teal"
            width={100}
            mt={2}
            right={4}
            size="xs"
            rightIcon={<FaMoneyBill />}
            onClick={(e) => {
              setDialogTextAtom({
                nftDialogTitle: "Buy NFT",
                nftDialogText: `Are you sure you want to buy this NFT? (${token?.price} MATIC)`,
                nftDialogYesText: "Buy",
              });
              onBasicOpen();
              e.stopPropagation();
            }}
          >
            Buy
          </Button>
        )}

        {isSelling && (
          <Text
            width={100}
            textAlign="center"
            textColor="teal.400"
            marginTop={9}
            fontSize={20}
          >
            {Number(token?.price || 0).toFixed(1)} MATIC
          </Text>
        )}
      </Stack>
    </Flex>
  );
};
