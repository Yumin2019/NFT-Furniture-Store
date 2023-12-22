import { Box, Button, Text, Flex, Spacer } from "@chakra-ui/react";

export const RoomItem = ({ room, right, width }) => {
  return (
    <>
      <Box
        w={width}
        border="0.5px solid #88888866"
        borderRadius={10}
        padding={2}
        mb={4}
        position="relative"
      >
        <Text fontWeight="bold" mb={2}>
          {room?.name} (online: {room?.online})
        </Text>
        <Text fontSize="sm" mb={2}>
          {room?.desc}
        </Text>
        <Flex>
          <Spacer />
          <Button alignItems="center" colorScheme="teal" size="sm">
            Join
          </Button>
        </Flex>
      </Box>
    </>
  );
};
