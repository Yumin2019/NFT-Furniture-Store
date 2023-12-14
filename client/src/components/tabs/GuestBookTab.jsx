import {
  Button,
  Stack,
  Divider,
  Input,
  Box,
  useDisclosure,
} from "@chakra-ui/react";
import { Comment } from "./item/Comment";
import { BasicDialog } from "../dialog/BasicDialog";
import { CommentEditDialog } from "../dialog/CommentEditDialog";

export const GuestBookTab = () => {
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

  const {
    isOpen: isDelOpen,
    onOpen: onDelOpen,
    onClose: onDelClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  return (
    <>
      <BasicDialog
        isOpen={isDelOpen}
        onClose={onDelClose}
        title="Delete this Comment?"
        text="Are you sure you want to delete your comment? This comment will be deleted."
      />
      <CommentEditDialog isOpen={isEditOpen} onClose={onEditClose} />

      <Stack direction="row" alignItems="center" mb={6}>
        <Input
          placeholder="write a comment"
          size="md"
          color="teal"
          _placeholder={{ color: "inherit" }}
          focusBorderColor="teal.500"
        />
        <Button colorScheme="teal" size="sm" height="38px">
          Comment
        </Button>
      </Stack>
      <Divider mt={2} mb={2} />

      {comments.map((v, index) => {
        return (
          <Box key={index}>
            <Comment
              imgSrc={v.imgSrc}
              name={v.name}
              date={v.date}
              text={v.text}
              deletable={true}
              editable={true}
              isDelOpen={isDelOpen}
              onDelOpen={onDelOpen}
              onDelClose={onDelClose}
              isEditOpen={isEditOpen}
              onEditOpen={onEditOpen}
              onEditClose={onEditClose}
            />
            <Divider mt={2} mb={2} />
          </Box>
        );
      })}
    </>
  );
};
