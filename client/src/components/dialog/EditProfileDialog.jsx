import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Text,
  Button,
  Image,
  Input,
  Center,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { RiPencilFill } from "react-icons/ri";

export const EditProfileDialog = ({
  initProfile,
  initName,
  initDesc,
  initWorldName,
  initWorldDesc,
  isOpen,
  onClose,
}) => {
  const [preview, setPreview] = useState("");
  const [nameText, setNameText] = useState("");
  const [descText, setDescText] = useState("");
  const [worldNameText, setWorldNameText] = useState("");
  const [worldDescText, setWorldDescText] = useState("");

  useEffect(() => {
    setPreview(initProfile);
    setNameText(initName);
    setDescText(initDesc);
    setWorldNameText(initWorldName);
    setWorldDescText(initWorldDesc);
  }, [isOpen]);

  const onChange = (e) => {
    const img = e.target.files[0];
    console.log(img);

    var reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
  };

  return (
    <>
      <Modal onClose={onClose} size="lg" isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <label htmlFor="file">
                <Box pl={4} pr={4}>
                  <Image
                    boxSize="200"
                    border="0.5px solid grey"
                    src={preview}
                  />

                  <Box
                    backgroundColor="teal.500"
                    borderRadius="50%"
                    width={8}
                    height={8}
                    position="relative"
                    right={-180}
                    top={-4}
                    pl="7px"
                    pt="6px"
                    alignItems="center"
                  >
                    <RiPencilFill size={20} position="absolute" color="white" />
                  </Box>
                </Box>
              </label>

              <input
                type="file"
                name="file"
                id="file"
                accept="image/*"
                onChange={onChange}
                style={{ display: "none" }}
              />
            </Center>

            <Text fontSize={18} mb={2}>
              Name
            </Text>
            <Input
              value={nameText}
              onChange={(e) => setNameText(e.target.value)}
              size="md"
              color="teal"
              _placeholder={{ color: "inherit" }}
              focusBorderColor="teal.500"
            />

            <Text fontSize={18} mb={2} mt={4}>
              Description
            </Text>
            <Input
              value={descText}
              onChange={(e) => setDescText(e.target.value)}
              size="md"
              color="teal"
              _placeholder={{ color: "inherit" }}
              focusBorderColor="teal.500"
            />

            <Text fontSize={18} mb={2} mt={4}>
              Name of your world
            </Text>
            <Input
              value={worldNameText}
              onChange={(e) => setWorldNameText(e.target.value)}
              size="md"
              color="teal"
              _placeholder={{ color: "inherit" }}
              focusBorderColor="teal.500"
            />

            <Text fontSize={18} mb={2} mt={4}>
              Description of your world
            </Text>
            <Input
              value={worldDescText}
              onChange={(e) => setWorldDescText(e.target.value)}
              size="md"
              color="teal"
              _placeholder={{ color: "inherit" }}
              focusBorderColor="teal.500"
            />
          </ModalBody>
          <ModalFooter>
            <Button mr={4} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="teal">Edit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
