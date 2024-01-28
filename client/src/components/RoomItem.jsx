import { Box, Button, Text, Flex, Spacer } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const RoomItem = ({ room, right, width }) => {
  const navigate = useNavigate();

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
          <Button
            alignItems="center"
            colorScheme="teal"
            size="sm"
            onClick={() => {
              console.log(room);
              let id = room.id;
              if (id === undefined) id = window.location.pathname.split("/")[2];
              navigate(`/furnitureWorld/${id}`);
            }}
          >
            Join
          </Button>
        </Flex>
      </Box>
    </>
  );
};
