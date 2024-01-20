import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Box,
  Divider,
} from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";
import { BiWorld } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import { RoomItem } from "../RoomItem";
import { api } from "../../utils/Axios";
import { useAtom } from "jotai";
import { loginAtom } from "../../pages/MainPage";

export const RoomDialog = ({ isOpen, onClose }) => {
  const cancelRef = useRef();
  const [loginInfo] = useAtom(loginAtom);
  const [rooms, setRooms] = useState([]);
  const [myRoom, setMyRoom] = useState({});

  const getWorldList = async () => {
    if (!loginInfo.id) return;
    try {
      let res = await api.get("/getWorldList");
      console.log(res.data.rooms);
      setMyRoom(res.data.rooms.filter((v) => v.id === loginInfo.id)[0]);
      setRooms(res.data.rooms.filter((v) => v.id !== loginInfo.id));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getWorldList();
  }, [isOpen]);

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
            <Box
              fontSize={16}
              fontWeight="bold"
              color="teal"
              display="flex"
              alignItems="center"
              mt={4}
              mb={1}
            >
              <BiWorld fontSize={20} style={{ marginRight: 4 }} />
              Your World
            </Box>
            <RoomItem room={myRoom} />
            <Divider />
            <Box
              fontSize={16}
              fontWeight="bold"
              color="teal"
              display="flex"
              alignItems="center"
              mt={4}
              mb={1}
            >
              <FaHeart style={{ marginRight: 6 }} /> Followings
            </Box>
            <div style={{ marginBottom: 4 }}></div>
            {rooms &&
              rooms.map((room, index) => <RoomItem room={room} key={index} />)}
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
