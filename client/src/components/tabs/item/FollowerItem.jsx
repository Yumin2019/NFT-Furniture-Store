import { Flex, Stack, Text, Image, Button } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { FaHeartBroken } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { HeartAnimContext } from "../../../pages/UserInfoPage";
import { loginAtom } from "../../../pages/MainPage";
import { useAtom } from "jotai";

export const FollowerItem = ({
  id,
  image,
  name,
  email,
  desc,
  isFollowerViewer,
  onClick,
  isFollowable,
}) => {
  const heartAnimFunc = useContext(HeartAnimContext);
  const [loginInfo] = useAtom(loginAtom);
  return (
    <Flex width="100%" alignItems="center">
      <Image
        boxSize="65px"
        border="0.5px solid grey"
        src={image || "/image/account_icon.svg"}
      />

      <Flex direction="column" ml={4}>
        <Text fontWeight="bold" fontSize={16}>
          {name}
        </Text>
        <Text color="grey" fontSize={12}>
          {email}
        </Text>
        <Text color="grey" fontSize={14}>
          {desc}
        </Text>
      </Flex>

      {loginInfo.id && loginInfo.id !== id && (
        <Button
          position="absolute"
          colorScheme="teal"
          variant="outline"
          width={90}
          mt={2}
          right={4}
          size="xs"
          rightIcon={isFollowerViewer ? <FaHeartBroken /> : <FaHeart />}
          onClick={() => {
            heartAnimFunc(!isFollowerViewer, id);
          }}
        >
          {isFollowerViewer ? "Unfollow" : "Follow"}
        </Button>
      )}
    </Flex>
  );
};
