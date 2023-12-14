import { Box, Flex, Stack, Text, Image, Button } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { FaHeartBroken } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { HeartAnimContext } from "../../../pages/UserInfoPage";

export const FollowerItem = ({ imgSrc, name, onClick, isFollowable }) => {
  const [isFollower, setIsFollower] = useState(false);
  const heartAnimFunc = useContext(HeartAnimContext);
  return (
    <Flex width="100%" alignItems="center">
      <Image boxSize="65px" border="0.5px solid grey" src={imgSrc} />
      <Stack direction="column" ml={4}>
        <Text fontWeight="bold" fontSize={16}>
          {name}
        </Text>
        <Text color="grey" fontSize={14}>
          {"text"}
        </Text>
      </Stack>
      <Button
        position="absolute"
        colorScheme="teal"
        variant="outline"
        width={90}
        mt={2}
        right={4}
        size="xs"
        rightIcon={isFollower ? <FaHeartBroken /> : <FaHeart />}
        onClick={() => {
          setIsFollower(!isFollower);
          heartAnimFunc(!isFollower);
        }}
      >
        {isFollower ? "Unfollow" : "Follow"}
      </Button>
    </Flex>
  );
};
