import { Flex, Text, Image, Button, Stack, Spacer } from "@chakra-ui/react";
import { FaMoneyBill } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

export const NftItem = ({
  image,
  name,
  text,
  author,
  type,
  isMyNft,
  isSelling,
  price,
}) => {
  return (
    <Flex width="100%" alignItems="center">
      <Image boxSize="65px" border="0.5px solid grey" src={image} />

      <Flex direction="column" ml={4}>
        <Text fontWeight="bold" fontSize={16}>
          {name}
        </Text>
        <Text color="grey" fontSize={14}>
          {text}
        </Text>
        <Text fontSize={14} mt={2} color="teal.400">
          author: {author}
        </Text>
        <Text fontSize={14} color="teal.400">
          type: {type}
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
            onClick={() => {}}
          >
            {!isSelling ? "NFT Sell" : "Cancel Sales"}
          </Button>
        )}

        {!isMyNft && (
          <Button
            position="absolute"
            colorScheme="teal"
            mt={2}
            right={4}
            size="xs"
            rightIcon={<FaMoneyBill />}
            onClick={() => {}}
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
            {price.toFixed(1)} MATIC
          </Text>
        )}
      </Stack>
    </Flex>
  );
};
