import { Box, Flex, Image, Text, Stack, Button } from "@chakra-ui/react";

export const Comment = ({ imgSrc, name, date, text, deletable }) => {
  return (
    <Flex width="100%">
      <Image boxSize="80px" border="0.5px solid grey" src={imgSrc} />
      <Stack direction="column" ml={4}>
        <Box display="flex" textAlign="center">
          <Text fontWeight="bold" fontSize={16} mr={3}>
            {name}
          </Text>
          <Text color="grey" fontSize={13} mt="3px">
            {date}
          </Text>
          {deletable && (
            <Button position="absolute" right={4} colorScheme="teal" size="xs">
              Delete
            </Button>
          )}
        </Box>
        <Text>{text}</Text>
      </Stack>
    </Flex>
  );
};
