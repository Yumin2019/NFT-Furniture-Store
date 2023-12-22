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
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useState } from "react";

export const InputDialog = ({
  isOpen,
  onClose,
  onClick,
  initialText,
  title,
  text,
  yesText,
  noText,
  inputPlaceholder,
}) => {
  const cancelRef = useRef();
  const [inputText, setInputText] = useState("");
  useEffect(() => {
    setInputText(initialText);
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
        <AlertDialogHeader>{title}</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          {text && <Text mb={2}>{text}</Text>}
          <Input
            placeholder={inputPlaceholder}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            size="md"
            color="teal"
            _placeholder={{ color: "inherit" }}
            focusBorderColor="teal.500"
          />
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose} size="sm">
            {noText}
          </Button>
          <Button
            colorScheme="teal"
            ml={3}
            onClick={() => {
              if (onClick) onClick(inputText);
            }}
            size="sm"
          >
            {yesText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
