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

export const EditContactDialog = ({
  isOpen,
  onClose,
  onClick,
  initialName,
  initalAddress,
  title,
  yesText,
  noText,
}) => {
  const cancelRef = useRef();
  const [nameText, setNameText] = useState("");
  const [addressText, setAddressText] = useState("");
  useEffect(() => {
    setNameText(initialName);
    setAddressText(initalAddress);
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
      <AlertDialogContent m={4}>
        <AlertDialogHeader>{title}</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          <Text mb={2}>Name</Text>
          <Input
            placeholder="Name to display"
            value={nameText}
            onChange={(e) => setNameText(e.target.value)}
            size="md"
            _placeholder={{ color: "grey" }}
            focusBorderColor="blue.500"
          />

          <Text mt={4} mb={2}>
            Address
          </Text>
          <Input
            placeholder="Account address"
            value={addressText}
            onChange={(e) => setAddressText(e.target.value)}
            size="md"
            _placeholder={{ color: "grey" }}
            focusBorderColor="blue.500"
          />
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose} size="sm">
            {noText}
          </Button>
          <Button
            colorScheme="blue"
            ml={3}
            onClick={() => {
              if (onClick) onClick(nameText);
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
