import { Flex, Text, Image } from "@chakra-ui/react";

export const FurnitureItem = ({ image, name, text }) => {
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
        <Text fontSize={14} mt={2}>
          count: 3
        </Text>
      </Flex>
    </Flex>
  );
};
