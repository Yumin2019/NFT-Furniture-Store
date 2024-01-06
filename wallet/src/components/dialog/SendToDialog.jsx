import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Box,
  Flex,
  Text,
  Spacer,
  Input,
  Button,
  Divider,
  ModalCloseButton,
  Alert,
  AlertIcon,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { IoMdClose, IoMdArrowDropdown, IoIosArrowBack } from "react-icons/io";
import { AiOutlineClear } from "react-icons/ai";
import { FaInfoCircle } from "react-icons/fa";
import { AccountRow } from "../AccountRow";
import { FaUserCircle } from "react-icons/fa";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { dialogMaxWidth } from "../../utils/Helper";

export const SendToDialog = ({ onClose, isOpen }) => {
  const btnRef = useRef(null);
  const [hoverIdx, setHoverIdx] = useState(-1);
  const [curStep, setCurStep] = useState(1);
  const [amountText, setAmountText] = useState("0");

  useEffect(() => {
    setCurStep(1);
  }, [isOpen]);

  useEffect(() => {}, [curStep]);

  const accounts = [
    {
      name: "account 1",
      address: "0x81Dd5..1.....",
    },
    {
      name: "account 2",
      address: "0x81Dd5..1.....",
    },
    {
      name: "account 3",
      address: "0x81Dd5..1.....",
    },
  ];

  const contacts = [
    {
      name: "contacts 1",
      address: "0x81Dd5..1.....",
    },
    {
      name: "contacts 2",
      address: "0x81Dd5..1.....",
    },
    {
      name: "contacts 3",
      address: "0x81Dd5..1.....",
    },
  ];

  return (
    <Modal
      onClose={onClose}
      finalFocusRef={btnRef}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="full"
    >
      <ModalOverlay />
      <ModalContent maxW={dialogMaxWidth}>
        {curStep !== 3 && (
          <ModalHeader fontSize={16} mt={4} fontWeight="bold" align="center">
            {curStep === 1 ? "Send to" : "Send"}
          </ModalHeader>
        )}

        {/* Page 1 */}
        {curStep === 1 && (
          <Box>
            <ModalCloseButton size={32} mr={4} mt={4} />
            <Box margin={4}>
              <Input variant="outline" placeholder="Enter public address" />
            </Box>

            <Text fontSize={18} ml={4} fontWeight="600">
              Your accounts
            </Text>

            {accounts.map((v, index) => {
              return (
                <Box key={index}>
                  <AccountRow
                    hoverIdx={hoverIdx}
                    index={index}
                    setHoverIdx={setHoverIdx}
                    v={v}
                    onClick={() => setCurStep(2)}
                  />
                </Box>
              );
            })}

            <Divider />

            <Text fontSize={18} ml={4} mt={4} fontWeight="600">
              Contact
            </Text>
            {contacts.map((v, index) => {
              return (
                <Box key={index}>
                  <AccountRow
                    hoverIdx={hoverIdx}
                    index={index + accounts.length}
                    setHoverIdx={setHoverIdx}
                    v={v}
                    onClick={() => setCurStep(2)}
                  />
                </Box>
              );
            })}
          </Box>
        )}

        {/* Page 2  */}
        {curStep === 2 && (
          <Box pl={4} pr={4}>
            <Box border="1px solid #0377ca" borderRadius={4} padding={2}>
              <Flex alignItems="center">
                <Box>
                  <Text fontSize={16} textColor="#0377ca">
                    Account 1
                  </Text>
                  <Text fontSize={12}>
                    0x8add53b91f178832620ac4e83b29f94bfd716bda
                  </Text>
                </Box>
                <Spacer />
                <IoMdClose
                  size={24}
                  color="grey"
                  onClick={() => setCurStep(1)}
                  cursor="pointer"
                />
              </Flex>
            </Box>

            {/* Asset Row */}
            <Flex alignItems="center" mt={6}>
              <Text fontSize={16}>Asset:</Text>
              <Spacer />
              <Box border="1px solid #bbc0c5" borderRadius={4} p={1} w="70%">
                <Flex alignItems="center" pr={2}>
                  <Box>
                    <Text fontSize={15} fontWeight={500}>
                      ETH
                    </Text>
                    <Text fontSize={12}>Balance: 0 ETH</Text>
                  </Box>
                  <Spacer />
                  <Menu>
                    <MenuButton>
                      <IoMdArrowDropdown size={20} />
                    </MenuButton>
                    <MenuList padding={0}>
                      <MenuItem padding={2}>
                        <Box>
                          <Text fontSize={15} fontWeight={500}>
                            ETH
                          </Text>
                          <Text fontSize={12}>Balance: 0 ETH</Text>
                        </Box>
                      </MenuItem>
                      <MenuItem padding={2}>
                        <Box>
                          <Text fontSize={15} fontWeight={500}>
                            MATIC
                          </Text>
                          <Text fontSize={12}>Balance: 0 MATIC</Text>
                        </Box>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
              </Box>
            </Flex>

            {/* Amount Row */}
            <Flex alignItems="center" mt={4}>
              <Text fontSize={16}>Amount:</Text>
              <Spacer />
              <Box border="1px solid #bbc0c5" borderRadius={4} p={1} w="70%">
                <Flex alignItems="center" pr={2}>
                  <Box>
                    <Flex>
                      <Input
                        size="xs"
                        type="number"
                        prefix="ETH"
                        value={amountText}
                        onChange={(e) => {
                          setAmountText(e.target.value);
                        }}
                      />
                      <Text fontSize={15} fontWeight={500} ml={2}>
                        ETH
                      </Text>
                    </Flex>
                    <Text mt={1} fontSize={12}>
                      $2.8 USD
                    </Text>
                  </Box>
                  <Spacer />
                  <AiOutlineClear
                    size={20}
                    onClick={() => {
                      setAmountText("0");
                    }}
                  />
                </Flex>
              </Box>
            </Flex>
            <Text fontSize={12} textColor="#d73848" ml="30%" mt={1}>
              Insufficient funds for gas
            </Text>

            {/* Gas Estimate */}
            <Box
              mt={4}
              border="1px solid #bbc0c5"
              borderRadius={4}
              pl={2}
              pt={2}
              pr={2}
              pb={8}
            >
              <Flex alignItems="center">
                <Text fontSize={16} fontWeight="800">
                  Gas
                </Text>
                <Text
                  mr="3px"
                  fontSize={12}
                  textColor="#bbc0c5"
                  fontStyle="italic"
                  ml="3px"
                >
                  (estimated)
                </Text>
                <FaInfoCircle color="#6a737d" size={12} />
                <Spacer />
                <Text fontSize={16} fontWeight="800">
                  0.0000000403 ETH
                </Text>
              </Flex>

              <Flex alignItems="center">
                <Text fontSize={12} fontWeight="bold" textColor="#2aa849">
                  {"Likely in < 30 seconds"}
                </Text>
                <Spacer />
                <Text fontSize={14} fontWeight="800" textColor="#535a62" mr={2}>
                  Max fee:
                </Text>

                <Text fontSize={14} fontWeight="400">
                  0.00026666 ETH
                </Text>
              </Flex>
            </Box>
          </Box>
        )}

        {/* Page 3 */}
        {curStep === 3 && (
          <Box>
            <Flex
              alignItems="center"
              onClick={() => {
                setCurStep(2);
              }}
              cursor="pointer"
              mt={1}
              mb={1}
            >
              <IoIosArrowBack size={24} color="#0377ca" />
              <Text fontSize={16} textColor="#0377ca">
                Edit
              </Text>
            </Flex>
            <Box borderTop="1px solid #bbc0c5" borderBottom="1px solid #bbc0c5">
              <Stack direction="row" alignItems="center" pl={4} pr={4}>
                <Flex flex={1}>
                  <FaUserCircle size={28} color="#3082ce" />
                  <Text textAlign="center" fontSize={14} ml={3} mt="2px">
                    0x8aDd5..1......
                  </Text>
                </Flex>
                <IoArrowForwardCircleOutline size={40} color="#bbc0c5" />
                <Flex flex={1}>
                  <FaUserCircle size={28} color="#3082ce" />
                  <Text textAlign="center" fontSize={14} ml={3} mt="2px">
                    0x8aDd5..1......
                  </Text>
                </Flex>
              </Stack>
            </Box>
            {/* Page 3 Grey  */}
            <Box background="#f2f4f6" pt={4} pb={4}>
              <Box
                ml={4}
                border="1px solid #bbc0c5"
                maxW={100}
                borderRadius={4}
                p="1px"
                textAlign="center"
              >
                <Text fontSize={12}>SENDING ETH</Text>
              </Box>

              <Text mt={2} ml={4} fontSize={24}>
                0
              </Text>

              <Text ml={4} fontSize={16}>
                $0.15
              </Text>
            </Box>
            {/* Page 3 White */}
            <Box background="white" pb={4} pl={4} pr={4}>
              <Box mt={4} borderRadius={4} pl={2} pt={2} pr={2} pb={8}>
                <Flex alignItems="center">
                  <Text fontSize={16} fontWeight="800">
                    Gas
                  </Text>
                  <Text
                    mr="3px"
                    fontSize={12}
                    textColor="#bbc0c5"
                    fontStyle="italic"
                    ml="3px"
                  >
                    (estimated)
                  </Text>
                  <FaInfoCircle color="#6a737d" size={12} />
                  <Spacer />
                  <Text fontSize={16}>$0.43</Text>
                  <Text ml={2} fontSize={16} fontWeight="800">
                    0.0000000403 ETH
                  </Text>
                </Flex>

                <Flex alignItems="center">
                  <Text fontSize={12} fontWeight="bold" textColor="#2aa849">
                    {"Likely in < 30 seconds"}
                  </Text>
                  <Spacer />
                  <Text
                    fontSize={14}
                    fontWeight="800"
                    textColor="#535a62"
                    mr={2}
                  >
                    Max fee:
                  </Text>

                  <Text fontSize={14} fontWeight="400">
                    0.00026666 ETH
                  </Text>
                </Flex>
              </Box>
              <Divider />
              <Box mt={4} borderRadius={4} pl={2} pt={2} pr={2} pb={8}>
                <Flex alignItems="center">
                  <Text fontSize={16} fontWeight="800">
                    Total
                  </Text>
                  <Spacer />
                  <Text fontSize={16}>$0.43</Text>
                  <Text ml={2} fontSize={16} fontWeight="800">
                    0.0000000403 ETH
                  </Text>
                </Flex>

                <Flex alignItems="center">
                  <Text fontSize={12} fontWeight="bold" textColor="#585f67">
                    Amount + gas fee
                  </Text>
                  <Spacer />
                  <Text
                    fontSize={14}
                    fontWeight="800"
                    textColor="#535a62"
                    mr={2}
                  >
                    Max amount:
                  </Text>

                  <Text fontSize={14} fontWeight="400">
                    0.00026666 ETH
                  </Text>
                </Flex>
              </Box>

              <Alert status="error" variant="left-accent">
                <AlertIcon />
                You do not have enough ETH in your account to pay for
                transaction fees on Ethereum Mainnet network.
              </Alert>
            </Box>
          </Box>
        )}

        {/* Bottom Button */}
        {curStep > 1 && (
          <Box position="absolute" bottom={0} w="100%">
            <Box background="#d6d9dc" mb={4} h="1px" />
            <Flex>
              <Button
                flex={1}
                ml={4}
                colorScheme="blue"
                variant="outline"
                size="md"
                borderRadius={32}
                mb={4}
                onClick={() => {
                  onClose();
                }}
              >
                {curStep === 3 ? "Reject" : "Cancel"}
              </Button>
              <Button
                ml={4}
                mr={4}
                flex={1}
                colorScheme="blue"
                size="md"
                borderRadius={32}
                mb={4}
                onClick={() => {
                  setCurStep(3);
                }}
              >
                {curStep === 3 ? "Confirm" : "Next"}
              </Button>
            </Flex>
          </Box>
        )}
      </ModalContent>
    </Modal>
  );
};
