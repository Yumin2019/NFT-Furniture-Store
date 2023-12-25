import { Flex, Text, Image, Button, Stack, Spacer } from "@chakra-ui/react";
import { atom, useAtom } from "jotai";
import { FaMoneyBill } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { loginAtom } from "../../../pages/MainPage";
import { web3 } from "../../../contracts/contract";

export const nftDialogTextAtom = atom({
  nftDialogText: "",
  nftDialogTitle: "",
  nftDialogYesText: "",
});

export const NftItem = ({
  info,
  token,
  owner,
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
          {info?.name} #{Number(token?.tokenId)}
        </Text>
        <Text color="grey" fontSize={14}>
          {info?.desc}
        </Text>
        <Text fontSize={14} mt={2} color="teal.400">
          owner: {owner}
        </Text>
        <Text fontSize={14} color="teal.400">
          type: furniture
        </Text>
        {loginInfo?.id && isMyNft && !isSelling && (
          <Button
            mt={6}
            width={100}
            colorScheme="teal"
            size="xs"
            bottom={4}
            onClick={(e) => {
              setDialogTextAtom({
                nftDialogTitle: "Consume NFT",
                nftDialogText:
                  "Are you sure you want to consume this NFT? You'll get a furniture item by consuming NFT.",
                nftDialogYesText: "Consume",
                info: info,
                token: token,
              });
              onBasicOpen();
              e.stopPropagation();
            }}
          >
            Consume
          </Button>
        )}
      </Flex>

      <Spacer />

      <Stack direction="column" alignItems="center" height={100}>
        {loginInfo?.id && isMyNft && (
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
                info: info,
                token: token,
              });
              !isSelling ? onSellOpen() : onBasicOpen();
              e.stopPropagation();
            }}
          >
            {!isSelling ? "NFT Sell" : "Cancel Sales"}
          </Button>
        )}

        {loginInfo?.id && !isMyNft && token?.isSelling && (
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
                nftDialogText: `Are you sure you want to buy this NFT? (${web3.utils.fromWei(
                  token?.price,
                  "ether"
                )} MATIC)`,
                nftDialogYesText: "Buy",
                info: info,
                token: token,
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
            fontSize={16}
          >
            {web3.utils.fromWei(token?.price, "ether")} MATIC
          </Text>
        )}
      </Stack>
    </Flex>
  );
};
