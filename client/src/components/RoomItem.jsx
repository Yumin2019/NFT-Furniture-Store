import { Box, Button, Text } from "@chakra-ui/react";

export const RoomItem = ({ room }) => {
  return (
    <>
      <Box
        border="0.5px solid #88888866"
        borderRadius={10}
        padding={2}
        mb={4}
        position="relative"
      >
        <Text fontWeight="bold" mb={2}>
          {room.name} (online: {room.people})
        </Text>
        <Text fontSize="sm" mb={2}>
          {room.desc}
        </Text>
        <Button
          right={-310}
          colorScheme="teal"
          width="18%"
          size="xs"
          variant="solid"
        >
          Join
        </Button>
      </Box>
    </>
  );
};
