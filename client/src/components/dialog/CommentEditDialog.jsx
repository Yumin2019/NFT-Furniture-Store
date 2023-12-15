import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button,
  Input,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { editText } from "../tabs/item/CommentItem";

export const CommentEditDialog = ({ isOpen, onClose, onClick }) => {
  const cancelRef = useRef();
  const [text, setText] = useState("");
  useEffect(() => {
    setText(editText);
  }, [isOpen]);

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay colorScheme="teal" />
      <AlertDialogContent>
        <AlertDialogHeader>Edit comment</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          <Input
            placeholder="write a comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
            size="md"
            color="teal"
            _placeholder={{ color: "inherit" }}
            focusBorderColor="teal.500"
          />
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button colorScheme="teal" ml={3} onClick={onClick} size="sm">
            Edit
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
