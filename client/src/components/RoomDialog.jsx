import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Text,
  Box,
  Divider,
} from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";
import { BiWorld } from "react-icons/bi";
import { useRef } from "react";
import { RoomItem } from "./RoomItem";

export const RoomDialog = ({ isOpen, onClose }) => {
  const cancelRef = useRef();

  const myRoom = {
    id: 3,
    name: "Meta World",
    desc: "Welcome to learning React!",
    people: 1,
  };

  const roomsOfFollwing = [
    {
      id: 1,
      name: "Hello World",
      desc: "Welcome to learning React!",
      people: 1,
    },
    {
      id: 2,
      name: "Installation",
      desc: "You can install React from npm.",
      people: 0,
    },
    {
      id: 1,
      name: "Hello World",
      desc: "Welcome to learning React!",
      people: 1,
    },
    {
      id: 2,
      name: "Installation",
      desc: "You can install React from npm.",
      people: 0,
    },
  ];

  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Join Furniture World</AlertDialogHeader>
          <AlertDialogCloseButton ref={cancelRef} onClick={onClose} />
          <AlertDialogBody>
            You can select Furniture World to join.
            <Text fontSize={16} fontWeight="bold" color="teal" mt={4} mb={1}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <BiWorld fontSize={20} style={{ marginRight: 4 }} />
                Your World
              </div>
            </Text>
            <RoomItem room={myRoom} />
            <Divider />
            <Text
              alignItems="center"
              fontSize={16}
              fontWeight="bold"
              color="teal"
              mt={4}
              mb={1}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <FaHeart style={{ marginRight: 6 }} /> Followings
              </div>
            </Text>
            <div style={{ marginBottom: 20 }}></div>
            {roomsOfFollwing.map((room) => (
              <RoomItem room={room} />
            ))}
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
