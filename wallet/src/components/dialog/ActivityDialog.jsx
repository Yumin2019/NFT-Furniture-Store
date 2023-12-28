import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Box,
  Flex,
  Text,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";
import { useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
export const ActivityDialog = ({ onClose, isOpen }) => {
  const btnRef = useRef(null);

  return (
    <Modal
      onClose={onClose}
      finalFocusRef={btnRef}
      isOpen={isOpen}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent maxW="100%" height="100%" ml={4} mr={4} mt={6} mb={6}>
        <ModalHeader fontSize={16} mt={4} fontWeight="bold">
          Buy Token
        </ModalHeader>
        <ModalCloseButton size={32} mr={4} mt={4} />
        <ModalBody>
          <Flex pt={2} pb={2}>
            <Text fontWeight="bold" fontSize={15} mb={1}>
              Status
            </Text>
            <Spacer />
            <Text fontSize={14} textColor="#0f79cb" cursor="pointer">
              View on block explorer
            </Text>
          </Flex>

          <Flex pb={2}>
            <Text fontWeight="600" fontSize={14} mb={1} textColor="#28a746">
              Confirmed
            </Text>
            <Spacer />
            <Text fontSize={14} textColor="#0f79cb" cursor="pointer">
              Copy Transaction ID
            </Text>
          </Flex>

          <Flex pb={1} pt={1}>
            <Text fontWeight="bold" fontSize={15} mb={1}>
              From
            </Text>
            <Spacer />
            <Text fontWeight="bold" fontSize={15} mb={1}>
              To
            </Text>
          </Flex>

          <Stack direction="row" alignItems="center" mb={4}>
            <Flex flex={1}>
              <FaUserCircle size={28} color="#3082ce" />
              <Text textAlign="center" fontSize={14} ml={3} mt="2px">
                0x8aDd5..1......
              </Text>
            </Flex>
            <IoArrowForwardCircleOutline size={40} color="#bbc0c4" />
            <Flex flex={1}>
              <FaUserCircle size={28} color="#3082ce" />
              <Text textAlign="center" fontSize={14} ml={3} mt="2px">
                0x8aDd5..1......
              </Text>
            </Flex>
          </Stack>

          <Text fontWeight="bold" fontSize={15} mb={1}>
            Transaction
          </Text>

          <Flex pt={2} pb={2}>
            <Text fontSize={14} textColor="#60676e">
              Nounce
            </Text>
            <Spacer />
            <Text fontSize={14} textColor="#60676e">
              45
            </Text>
          </Flex>

          <Flex pt={2} pb={2}>
            <Text fontSize={14} textColor="#60676e">
              Amount
            </Text>
            <Spacer />
            <Text fontSize={14} fontWeight="bold">
              -0.001 MATIC
            </Text>
          </Flex>

          <Flex pt={2} pb={2}>
            <Text fontSize={14} textColor="#60676e">
              Gas Limit (Units)
            </Text>
            <Spacer />
            <Text fontSize={14} textColor="#60676e">
              125543
            </Text>
          </Flex>

          <Flex pt={2} pb={2}>
            <Text fontSize={14} textColor="#60676e">
              Gas Used (Units)
            </Text>
            <Spacer />
            <Text fontSize={14} textColor="#60676e">
              125543
            </Text>
          </Flex>

          <Flex pt={2} pb={2}>
            <Text fontSize={14} textColor="#60676e">
              Base fee (GWEI)
            </Text>
            <Spacer />
            <Text fontSize={14}>0.00000000016</Text>
          </Flex>

          <Flex pt={2} pb={2}>
            <Text fontSize={14} textColor="#60676e">
              Priority fee (GWEI)
            </Text>
            <Spacer />
            <Text fontSize={14}>2.5</Text>
          </Flex>

          <Flex pt={2} pb={2}>
            <Text fontSize={14} textColor="#60676e">
              Total gas fee
            </Text>
            <Spacer />
            <Box textAlign="right">
              <Text fontSize={14}>0.000266 MATIC</Text>
              <Text fontSize={14}>$0.00 USD</Text>
            </Box>
          </Flex>

          <Flex pt={2} pb={2}>
            <Text fontSize={14} textColor="#60676e">
              Total gas fee
            </Text>
            <Spacer />
            <Box textAlign="right">
              <Text fontSize={14}>0.000266 MATIC</Text>
              <Text fontSize={14}>$0.00 USD</Text>
            </Box>
          </Flex>

          <Flex pt={2} pb={2}>
            <Text fontSize={14} textColor="#60676e">
              Total
            </Text>
            <Spacer />
            <Box textAlign="right">
              <Text fontSize={14} fontWeight="bold">
                0.000266 MATIC
              </Text>
              <Text fontSize={14}>$0.00 USD</Text>
            </Box>
          </Flex>

          <Flex align="center">
            <FaPlus size={18} />
            <Text fontWeight="bold" fontSize={15} ml={2}>
              Activity log
            </Text>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
