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

export const EditAccountDialog = ({
  isOpen,
  onClose,
  onClick,
  initialName,
  title,
  yesText,
  noText,
  rowText1,
  placeHolder1,
}) => {
  const cancelRef = useRef();
  const [nameText, setNameText] = useState("");
  useEffect(() => {
    setNameText(initialName);
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
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose} size="sm">
            {noText}
          </Button>
          <Button
            colorScheme="blue"
            ml={3}
            onClick={() => {
              if (onClick) onClick(nameText || placeHolder1);
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
