import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Image,
  Box,
  Flex,
  Text,
  Spacer,
  Button,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FaTrashCan } from "react-icons/fa6";

export const NetworkDialog = ({ onClose, isOpen }) => {
  const btnRef = useRef(null);
  const [hoverIdx, setHoverIdx] = useState(-1);

  const networks = [
    {
      name: "Ethereum Mainnet",
      src: "/image/eth_logo.png",
      isSelected: true,
      isDeletable: false,
    },
    {
      name: "Polygon Mainnet",
      src: "/image/polygon_logo.png",
      isSelected: false,
      isDeletable: false,
    },
    {
      name: "Linea Mainnet",
      src: "/image/linea_logo.png",
      isSelected: false,
      isDeletable: false,
    },
    {
      name: "Mumbai Testnet",
      src: "",
      isSelected: false,
      isDeletable: true,
    },
    {
      name: "Yumin Testnet",
      src: "",
      isSelected: false,
      isDeletable: true,
    },
  ];

  return (
    <Modal
      onClose={onClose}
      finalFocusRef={btnRef}
      isOpen={isOpen}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent maxW="100%" ml={4} mr={4} mt={6} mb={6}>
        <ModalHeader fontSize={16} mt={4} fontWeight="bold" align="center">
          Select a network
        </ModalHeader>
        <ModalCloseButton size={32} mr={4} mt={4} />
        {networks.map((v, index) => {
          return (
            <Flex
              cursor="pointer"
              alignItems="center"
              pb={2}
              pt={2}
              pr={4}
              background={
                v.isSelected ? "#eaf1fa" : hoverIdx === index ? "#f9faf9" : null
              }
              onMouseOver={() => setHoverIdx(index)}
              onMouseOut={() => setHoverIdx(-1)}
            >
              <Box
                background="#0376c9"
                w="4px"
                h="45px"
                ml={1}
                borderRadius={4}
                visibility={v.isSelected ? "visible" : "hidden"}
              />
              {v.src.length !== 0 && (
                <Image boxSize={8} src={v.src} borderRadius="full" ml={4} />
              )}

              {v.src.length === 0 && (
                <Box
                  ml={4}
                  backgroundColor="#f2f4f6"
                  width={8}
                  height={8}
                  borderRadius={24}
                >
                  <Text position="relative" top="5px" left="10px" fontSize={14}>
                    {v.name.charAt(0)}
                  </Text>
                </Box>
              )}
              <Text ml={4} fontSize={16}>
                {v.name}
              </Text>
              <Spacer />
              {v.isDeletable && hoverIdx === index && (
                <FaTrashCan size={14} color="#ff1b38" />
              )}
            </Flex>
          );
        })}

        <Button
          ml={4}
          mr={4}
          mt={8}
          colorScheme="blue"
          variant="outline"
          size="md"
          borderRadius={32}
          mb={4}
        >
          Add network
        </Button>
      </ModalContent>
    </Modal>
  );
};
