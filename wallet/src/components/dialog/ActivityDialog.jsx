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
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import {
  copyTextOnClipboard,
  dialogMaxWidth,
  openInNewTab,
  truncate,
} from "../../utils/Helper";

export const ActivityDialog = ({ onClose, isOpen, activity, curNetwork }) => {
  const btnRef = useRef(null);
  const toast = useToast();

  return (
    <Modal
      onClose={onClose}
      finalFocusRef={btnRef}
      isOpen={isOpen}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent
        maxW={dialogMaxWidth}
        height="100%"
        ml={4}
        mr={4}
        mt={6}
        mb={6}
      >
        <ModalHeader fontSize={16} mt={4} fontWeight="bold">
          {activity.name}
        </ModalHeader>
        <ModalCloseButton size={32} mr={4} mt={4} />
        <ModalBody>
          <Flex pt={2} pb={2}>
            <Text fontWeight="bold" fontSize={15} mb={1}>
              Status
            </Text>
            <Spacer />
            <Text
              fontSize={14}
              textColor="#0f79cb"
              cursor="pointer"
              onClick={() => {
                if (curNetwork?.explorerUrl && activity?.txHash) {
                  openInNewTab(
                    `${curNetwork.explorerUrl}/tx/${activity.txHash}`
                  );
                }
              }}
            >
              View on block explorer
            </Text>
          </Flex>

          <Flex pb={2}>
            <Text fontWeight="600" fontSize={14} mb={1} textColor="#28a746">
              Confirmed
            </Text>
            <Spacer />
            <Text
              fontSize={14}
              textColor="#0f79cb"
              cursor="pointer"
              onClick={() => {
                if (activity?.txHash) {
                  copyTextOnClipboard(toast, activity.txHash);
                }
              }}
            >
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
              <Text textAlign="center" fontSize={13} ml={3} mt="4px">
                {truncate(activity?.from, 10)}
              </Text>
            </Flex>
            <IoArrowForwardCircleOutline size={40} color="#bbc0c4" />
            <Flex flex={1}>
              <FaUserCircle size={28} color="#3082ce" />
              <Text textAlign="center" fontSize={13} ml={3} mt="4px">
                {truncate(activity?.to, 10)}
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
              {activity?.nounce}
            </Text>
          </Flex>

          <Flex pt={2} pb={2}>
            <Text fontSize={14} textColor="#60676e">
              Amount
            </Text>
            <Spacer />
            <Text fontSize={14} fontWeight="bold">
              -{activity?.value} {curNetwork?.currency}
            </Text>
          </Flex>

          <Flex pt={2} pb={2}>
            <Text fontSize={14} textColor="#60676e">
              Gas Limit (Units)
            </Text>
            <Spacer />
            <Text fontSize={14} textColor="#60676e">
              {activity?.gasLimit}
            </Text>
          </Flex>

          <Flex pt={2} pb={2}>
            <Text fontSize={14} textColor="#60676e">
              Gas Used (Units)
            </Text>
            <Spacer />
            <Text fontSize={14} textColor="#60676e">
              {activity?.gasUsed}
            </Text>
          </Flex>

          <Flex pt={2} pb={2}>
            <Text fontSize={14} textColor="#60676e">
              Base fee (GWEI)
            </Text>
            <Spacer />
            <Text fontSize={14}> {activity?.baseFee}</Text>
          </Flex>

          <Flex pt={2} pb={2}>
            <Text fontSize={14} textColor="#60676e">
              Priority fee (GWEI)
            </Text>
            <Spacer />
            <Text fontSize={14}>{activity?.priorityFee}</Text>
          </Flex>

          <Flex pt={2} pb={2}>
            <Text fontSize={14} textColor="#60676e">
              Total gas fee
            </Text>
            <Spacer />
            <Box textAlign="right">
              <Text fontSize={14}>
                {activity?.totalGasFee} {curNetwork?.currency}
              </Text>
              <Text fontSize={14}>${activity?.totalGasFeeUsd} USD</Text>
            </Box>
          </Flex>

          <Flex pt={2} pb={2}>
            <Text fontSize={14} textColor="#60676e">
              Max fee per gas
            </Text>
            <Spacer />
            <Box textAlign="right">
              <Text fontSize={14}>
                {activity?.maxFeePerGas} {curNetwork?.currency}
              </Text>
              <Text fontSize={14}>${activity?.maxFeePerGasUsd} USD</Text>
            </Box>
          </Flex>

          <Flex pt={2} pb={2}>
            <Text fontSize={14} textColor="#60676e">
              Total
            </Text>
            <Spacer />
            <Box textAlign="right">
              <Text fontSize={14} fontWeight="bold">
                {activity?.total} {curNetwork?.currency}
              </Text>
              <Text fontSize={14}>${activity?.totalUsd} USD</Text>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
