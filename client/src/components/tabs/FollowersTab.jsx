import { Box, Divider, Flex, Stack, Text } from "@chakra-ui/react";
import { FollowerItem } from "./item/FollowerItem";

export const FollowersTab = () => {
  const comments = [
    {
      id: 1,
      image: "image/profile_image.png",
      name: "yumin",
      date: "2023.12.03 09:00:10",
      text: "안녕하세요",
      author: "kym",
    },
    {
      id: 2,
      image: "image/profile_image.png",
      name: "yumin",
      date: "2023.12.03 09:00:10",
      text: "안녕하세요안d안녕하세요안녕하세요요안녕하세요안녕하세요",
      author: "kym2",
    },
    {
      id: 3,
      image: "image/profile_image.png",
      name: "yumin",
      date: "2023.12.03 09:00:10",
      text: "안녕하세요",
      author: "kym3",
    },
  ];

  return (
    <>
      {comments.map((v, index) => {
        return (
          <Box key={index}>
            <FollowerItem image={v.image} name={v.name} />
            <Divider mt={2} mb={2} />
          </Box>
        );
      })}
    </>
  );
};
