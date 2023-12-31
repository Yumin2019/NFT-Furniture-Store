import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Box,
  Flex,
  Text,
  Spacer,
  Button,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { IoIosMenu } from "react-icons/io";

export const AccountDialog = ({ onClose, isOpen }) => {
  const btnRef = useRef(null);
  const [hoverIdx, setHoverIdx] = useState(-1);

  const accounts = [
    {
      name: "Account 1",
      address: "0x81Dd5..1.....",
      matic: "0 MATIC",
      usd: "$0.00 USD",
      isSelected: true,
    },
    {
      name: "Account 2",
      address: "0x81Dd5..1.....",
      matic: "0 MATIC",
      usd: "$0.00 USD",
      isSelected: false,
    },
    {
      name: "Account 3",
      address: "0x81Dd5..1.....",
      matic: "0 MATIC",
      usd: "$0.00 USD",
      isSelected: false,
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
          Select an account
        </ModalHeader>
        <ModalCloseButton size={32} mr={4} mt={4} />

        {accounts.map((v, index) => {
          return (
            <Flex
              key={index}
              cursor="pointer"
              alignItems="center"
              pb={2}
              pt={2}
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
                mr={2}
                borderRadius={4}
                visibility={v.isSelected ? "visible" : "hidden"}
              />
              <FaUserCircle size={28} color="#3082ce" />
              <Box textAlign="left" ml={3} mt={1} mb={1}>
                <Text fontSize={14} textColor="#48494a" fontWeight="bold">
                  {v.name}
                </Text>
                <Text fontSize={12} textColor="#48494a">
                  {v.address}
                </Text>
              </Box>

              <Spacer />

              <Box textAlign="right" mr={2}>
                <Text fontSize={14} textColor="#48494a">
                  {v.matic}
                </Text>
                <Text fontSize={12} textColor="#48494a">
                  {v.usd}
                </Text>
              </Box>
              <Box mb="18px" mr={4}>
                <IoIosMenu size={20} color="black" />
              </Box>
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
          leftIcon={<FaPlus />}
        >
          Add new account
        </Button>
      </ModalContent>
    </Modal>
  );
};
