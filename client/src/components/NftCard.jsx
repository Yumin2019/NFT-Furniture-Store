import {
  Card,
  CardBody,
  Heading,
  Divider,
  Button,
  Image,
  Stack,
  Text,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { FaMoneyBill } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { nftDialogTextAtom } from "./tabs/item/NftItem";

export const NftCard = ({
  name,
  text,
  author,
  type,
  isMyNft,
  isSelling,
  price,
  onBasicOpen,
  onSellOpen,
  onItemClick,
}) => {
  const [dialogTextAtom, setDialogTextAtom] = useAtom(nftDialogTextAtom);
  return (
    <>
      <Card width={250} maxW="sm" border="1px solid grey" onClick={onItemClick}>
        <CardBody>
          <Image
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            alt="Green double couch with wooden legs"
            borderRadius="lg"
          />
          <Stack mt="6">
            <Heading size="md">{name}</Heading>
            <Text fontSize={16} color="grey">
              {text}
            </Text>
            <Text fontSize={14} color="teal.400">
              author: {author}
            </Text>
            <Text fontSize={14} color="teal.400">
              type: {type}
            </Text>

            <Text
              visibility={!isSelling ? "hidden" : "visible"}
              textColor="teal.400"
              fontSize={20}
            >
              {price.toFixed(1)} MATIC
            </Text>
          </Stack>
          <Divider marginTop={2} marginBottom={2} />
          <Flex>
            <Spacer />
            {isMyNft && (
              <Button
                colorScheme="teal"
                mt={2}
                size="sm"
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

            {!isMyNft && isSelling && (
              <Button
                mt={2}
                colorScheme="teal"
                size="sm"
                rightIcon={<FaMoneyBill />}
                onClick={(e) => {
                  setDialogTextAtom({
                    nftDialogTitle: "Buy NFT",
                    nftDialogText: `Are you sure you want to buy this NFT? (${price} MATIC)`,
                    nftDialogYesText: "Buy",
                  });
                  onBasicOpen();
                  e.stopPropagation();
                }}
              >
                Buy
              </Button>
            )}
          </Flex>
        </CardBody>
      </Card>
    </>
  );
};
