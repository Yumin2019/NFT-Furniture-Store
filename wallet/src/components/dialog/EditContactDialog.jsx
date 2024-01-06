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
import { dialogMaxWidth } from "../../utils/Helper";

export const EditContactDialog = ({
  isOpen,
  onClose,
  onClick,
  initialName,
  initialAddress,
  title,
  yesText,
  noText,
  rowText1,
  rowText2,
  placeHolder1,
  placeHolder2,
}) => {
  const cancelRef = useRef();
  const [nameText, setNameText] = useState("");
  const [addressText, setAddressText] = useState("");
  useEffect(() => {
    setNameText(initialName);
    setAddressText(initialAddress);
  }, [isOpen]);

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent m={4} maxW={dialogMaxWidth}>
        <AlertDialogHeader>{title}</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          <Text mb={2}>{rowText1 || "Name"}</Text>
          <Input
            placeholder={placeHolder1 || "Name to display"}
            value={nameText}
            onChange={(e) => setNameText(e.target.value)}
            size="md"
            _placeholder={{ color: "grey" }}
            focusBorderColor="blue.500"
          />

          <Text mt={4} mb={2}>
            {rowText2 || "Address"}
          </Text>
          <Input
            placeholder={placeHolder2 || "Account address"}
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
              if (onClick) onClick(nameText, addressText);
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
