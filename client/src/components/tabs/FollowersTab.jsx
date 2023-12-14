import { Box, Divider, Flex, Stack, Text } from "@chakra-ui/react";
import { FollowerItem } from "./item/FollowerItem";

export const FollowersTab = ({ imgSrc, name }) => {
  const comments = [
    {
      id: 1,
      imgSrc: "image/profile_image.png",
      name: "yumin",
      date: "2023.12.03 09:00:10",
      text: "안녕하세요",
      author: "kym",
    },
    {
      id: 2,
      imgSrc: "image/profile_image.png",
      name: "yumin",
      date: "2023.12.03 09:00:10",
      text: "안녕하세요안d안녕하세요안녕하세요요안녕하세요안녕하세요",
      author: "kym2",
    },
    {
      id: 3,
      imgSrc: "image/profile_image.png",
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
            <FollowerItem imgSrc={v.imgSrc} name={v.name} />
            <Divider mt={2} mb={2} />
          </Box>
        );
      })}
    </>
  );
};
