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
} from "@chakra-ui/react";

export const FurnitureDetailDialog = ({ furniture, isOpen, onClose }) => {
  return (
    <>
      <Modal onClose={onClose} size="lg" isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{furniture?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box pl={4} pr={4} pb={4}>
              <Image
                boxSize="100%"
                border="0.5px solid grey"
                src={furniture?.image || "/image/furniture_icon.svg"}
              />
            </Box>
            <Text color="grey" fontSize={18}>
              {furniture?.text}
            </Text>
            <Text fontSize={18} mt={2} color="teal.400">
              count: {furniture?.count}
            </Text>
            <Text fontSize={18} color="teal.400">
              type: item
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
