import {
  Box,
  Flex,
  Image,
  Text,
  Stack,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { BasicDialog } from "./BasicDialog";

export const Comment = ({ imgSrc, name, date, text, deletable, editable }) => {
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
      {/* <BasicDialog isOpen={isEditOpen} onClose={onEditClose}
      title="Delete this Comment?"
      text="Are you sure you want to delete your comment? This comment will be deleted."
      /> */}

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
            <Stack direction="row" position="absolute" right={4}>
              {editable && (
                <Button colorScheme="teal" size="xs" onClick={onEditOpen}>
                  Edit
                </Button>
              )}
              {deletable && (
                <Button colorScheme="teal" size="xs" onClick={onDelOpen}>
                  Delete
                </Button>
              )}
            </Stack>
          </Box>
          <Text>{text}</Text>
        </Stack>
      </Flex>
    </>
  );
};
