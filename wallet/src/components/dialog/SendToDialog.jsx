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
  Image,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { IoMdClose, IoMdArrowDropdown, IoIosArrowBack } from "react-icons/io";
import { AiOutlineClear } from "react-icons/ai";
import { FaInfoCircle, FaUserCircle, FaQuestionCircle } from "react-icons/fa";
import { AccountRow } from "../AccountRow";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import {
  dialogMaxWidth,
  errorToast,
  infoToast,
  printLog,
  saveData,
  truncate,
  validateEtherAddress,
} from "../../utils/Helper";
import { web3 } from "../../pages/MainPage";
import loading from "../../assets/loading.json";
import Lottie from "lottie-react";

export const SendToDialog = ({
  onClose,
  isOpen,
  accounts,
  contacts,
  curNetwork,
  curAccount,
  balanceInfo,
  activities,
  loadActivities,
}) => {
  const btnRef = useRef(null);
  const lottieRef = useRef();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [hoverIdx, setHoverIdx] = useState(-1);
  const [curStep, setCurStep] = useState(1);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isConfirmInValid, setIsConfirmInvalid] = useState(false);
  const [isAddrValid, setIsAddrValid] = useState(false);
  const [amountText, setAmountText] = useState("0");
  const [usdExchangeText, setUsdExchangeText] = useState("0");
  const [usdExchangeGasText, setUsdExchangeGasText] = useState("0");
  const [usdExchangeTotalGasText, setUsdExchangeTotalGasText] = useState("0");
  const [estimatedGasText, setEstimatedGasText] = useState("0");
  const [totalGasText, setTotalGasText] = useState("0");
  const [selectedAccount, setSelectedAccount] = useState({});
  const [addressText, setAddressText] = useState("");

  useEffect(() => {
    setCurStep(1);
    setAmountText("0");
    setAddressText("");

    printLog(curAccount);
    printLog(curNetwork);
    printLog(balanceInfo);
  }, [isOpen]);

  useEffect(() => {
    if (!balanceInfo) return;
    web3.eth.getGasPrice().then(async (result) => {
      let tx = {
        from: curAccount.address,
        to: curAccount.address,
      };

      // fee = gasPrice * gasLimit
      let gasLimit = await web3.eth.estimateGas(tx);
      let gasPrice = parseFloat(web3.utils.fromWei(result * gasLimit, "ether"));
      let usdExchange = gasPrice * balanceInfo.usdRatio || 0;
      let totalPrice = parseFloat(amountText) + gasPrice;
      let usdExchangeTotal = totalPrice * balanceInfo.usdRatio;
      let isInvalid = totalPrice > balanceInfo.value;
      gasPrice = gasPrice.toFixed(12);
      usdExchange = usdExchange.toFixed(2);

      printLog(gasLimit);
      printLog(gasPrice);
      printLog(usdExchange);
      printLog(isInvalid);

      setEstimatedGasText(Number(gasPrice));
      setUsdExchangeGasText(usdExchange);
      setUsdExchangeTotalGasText(usdExchangeTotal.toFixed(2));
      setTotalGasText(Number(totalPrice.toFixed(12)));
      setIsConfirmInvalid(isInvalid);
    });
  }, [curStep, balanceInfo]);

  useEffect(() => {
    if (!balanceInfo || !curAccount || !curNetwork) return;

    let usdExchange = parseFloat(amountText) * balanceInfo.usdRatio || 0;
    let isInvalid = parseFloat(amountText) > balanceInfo.value;

    printLog(usdExchange.toFixed(2));
    printLog(`isInvalid = ${isInvalid}`);

    setUsdExchangeText(usdExchange.toFixed(2));
    setIsInvalid(isInvalid);
  }, [amountText, balanceInfo]);

  useEffect(() => {
    let isValid = validateEtherAddress(addressText);
    setIsAddrValid(isValid);
    printLog(`isAddressValid = ${isValid}`);

    if (isValid) {
      setSelectedAccount({ name: addressText, address: addressText });
      setCurStep(2);
    }
  }, [addressText]);

  return (
    <Modal
      onClose={onClose}
      finalFocusRef={btnRef}
      isOpen={isOpen}
      scrollBehavior="outside"
      size="full"
    >
      <ModalOverlay />
      <ModalContent maxW={dialogMaxWidth}>
        {isLoading && (
          <Box top="15%" left="15%" w="70%" position="absolute">
            <ModalOverlay />
            <Lottie
              lottieRef={lottieRef}
              animationData={loading}
              loop={true}
              autoplay={true}
            />
          </Box>
        )}

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
              <Input
                variant="outline"
                placeholder="Enter public address"
                value={addressText}
                onChange={(e) => setAddressText(e.target.value)}
              />
            </Box>

            {addressText !== "" && !isAddrValid && (
              <Text textColor="#dc362e" ml={4}>
                Invalid Address
              </Text>
            )}

            {addressText === "" && (
              <Box>
                <Text fontSize={18} ml={4} fontWeight="600">
                  Your accounts
                </Text>

                {accounts.map((v, index) => {
                  return v.isVisible ? (
                    <Box key={index}>
                      <AccountRow
                        hoverIdx={hoverIdx}
                        index={index}
                        setHoverIdx={setHoverIdx}
                        v={v}
                        onClick={() => {
                          printLog(v);
                          setSelectedAccount(v);
                          setCurStep(2);
                        }}
                      />
                    </Box>
                  ) : (
                    <Box key={index + 200} />
                  );
                })}

                <Divider />

                <Text fontSize={18} ml={4} mt={4} fontWeight="600">
                  Contact
                </Text>
                {contacts.map((v, index) => {
                  return (
                    <Box key={index + 100}>
                      <AccountRow
                        hoverIdx={hoverIdx}
                        index={index + accounts.length}
                        setHoverIdx={setHoverIdx}
                        v={v}
                        onClick={() => {
                          printLog(v);
                          setSelectedAccount(v);
                          setCurStep(2);
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        )}

        {/* Page 2  */}
        {curStep === 2 && (
          <Box pl={4} pr={4}>
            <Box border="1px solid #0377ca" borderRadius={4} padding={2}>
              <Flex alignItems="center">
                <Box>
                  <Text fontSize={16} textColor="#0377ca">
                    {selectedAccount?.name}
                  </Text>
                  {selectedAccount?.name !== selectedAccount?.address && (
                    <Text fontSize={12}>{selectedAccount?.address}</Text>
                  )}
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
                      {curNetwork?.currency}
                    </Text>
                    <Text fontSize={12}>
                      Balance: {balanceInfo?.value} {curNetwork?.currency}
                    </Text>
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
                            {curNetwork?.currency}
                          </Text>
                          <Text fontSize={12}>
                            Balance: {balanceInfo?.value} {curNetwork?.currency}
                          </Text>
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
                        value={amountText}
                        onChange={(e) => {
                          setAmountText(e.target.value);
                        }}
                      />
                      <Text fontSize={15} fontWeight={500} ml={2}>
                        {curNetwork?.currency}
                      </Text>
                    </Flex>
                    <Text mt={1} fontSize={12} fontWeight={500}>
                      ${usdExchangeText} USD
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

            <Text
              fontSize={12}
              textColor="#d73848"
              ml="30%"
              mt={1}
              fontWeight={500}
              visibility={isInvalid ? "visible" : "hidden"}
            >
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
                <Text fontSize={14} fontWeight="800">
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
                <Text fontSize={14} fontWeight="800">
                  {estimatedGasText} {curNetwork?.currency}
                </Text>
              </Flex>

              <Flex alignItems="center">
                <Text fontSize={12} fontWeight="bold" textColor="#2aa849">
                  {"Likely in < 30 seconds"}
                </Text>
                <Spacer />
                <Text fontSize={12} fontWeight="800" textColor="#535a62" mr={2}>
                  Max fee:
                </Text>
                <Text fontSize={12} fontWeight="400">
                  {estimatedGasText} {curNetwork?.currency}
                </Text>
              </Flex>
            </Box>
          </Box>
        )}

        {/* Page 3 */}
        {curStep === 3 && (
          <Box>
            <Flex alignItems="center" mt={1} mb={1}>
              <Flex
                onClick={() => {
                  setCurStep(2);
                }}
                cursor="pointer"
              >
                <IoIosArrowBack size={24} color="#0377ca" />
                <Text fontSize={16} textColor="#0377ca">
                  Edit
                </Text>
              </Flex>

              <Spacer />

              <Stack
                direction="row"
                alignItems="center"
                backgroundColor="#f2f4f6"
                borderRadius={24}
                border="1px solid #bbc0c4"
                ml={2}
                mr={2}
                pl={2}
                pr={2}
                pt={1}
                pb={1}
              >
                {curNetwork?.src?.length === 0 && (
                  <FaQuestionCircle color="grey" />
                )}

                {curNetwork?.src?.length !== 0 && (
                  <Image w={4} src={curNetwork.src} borderRadius="full" />
                )}

                <Text fontSize={12} fontWeight={500}>
                  {curNetwork?.name}
                </Text>
              </Stack>
            </Flex>
            <Box borderTop="1px solid #bbc0c5" borderBottom="1px solid #bbc0c5">
              <Stack direction="row" alignItems="center" pl={4} pr={4}>
                <Flex flex={1}>
                  <FaUserCircle size={28} color="#3082ce" />
                  <Text textAlign="center" fontSize={14} ml={3} mt="2px">
                    {curAccount?.name}
                  </Text>
                </Flex>
                <IoArrowForwardCircleOutline size={40} color="#bbc0c5" />
                <Flex flex={1}>
                  <FaUserCircle size={28} color="#3082ce" />

                  {selectedAccount && (
                    <Text textAlign="center" fontSize={14} ml={3} mt="2px">
                      {validateEtherAddress(selectedAccount.name)
                        ? truncate(selectedAccount.address, 12)
                        : selectedAccount.name}
                    </Text>
                  )}
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
                <Text fontSize={12}>SENDING {curNetwork?.currency}</Text>
              </Box>

              <Text mt={2} ml={4} fontSize={22}>
                {amountText}
              </Text>

              <Text ml={4} fontSize={14}>
                ${usdExchangeText}
              </Text>
            </Box>
            {/* Page 3 White */}
            <Box background="white" pb={4} pl={4} pr={4}>
              <Box mt={1} borderRadius={4} pl={2} pt={2} pr={2} pb={8}>
                <Flex>
                  <Spacer />
                  <Text fontSize={14}>${usdExchangeGasText}</Text>
                </Flex>
                <Flex alignItems="center">
                  <Text fontSize={14} fontWeight="800">
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

                  <Text ml={2} fontSize={14} fontWeight="800">
                    {estimatedGasText} {curNetwork?.currency}
                  </Text>
                </Flex>

                <Flex alignItems="center">
                  <Text fontSize={12} fontWeight="bold" textColor="#2aa849">
                    {"Likely in < 30 seconds"}
                  </Text>
                  <Spacer />
                  <Text
                    fontSize={12}
                    fontWeight="800"
                    textColor="#535a62"
                    mr={2}
                  >
                    Max fee:
                  </Text>

                  <Text fontSize={14} fontWeight="400">
                    {estimatedGasText} {curNetwork?.currency}
                  </Text>
                </Flex>
              </Box>
              <Divider />
              <Box mt={1} borderRadius={4} pl={2} pt={2} pr={2} pb={8}>
                <Flex>
                  <Spacer />
                  <Text fontSize={14}>${usdExchangeTotalGasText}</Text>
                </Flex>
                <Flex alignItems="center">
                  <Text fontSize={14} fontWeight="800">
                    Total
                  </Text>
                  <Spacer />
                  <Text ml={2} fontSize={14} fontWeight="800">
                    {totalGasText} {curNetwork?.currency}
                  </Text>
                </Flex>

                <Flex alignItems="center">
                  <Text fontSize={12} fontWeight="bold" textColor="#585f67">
                    Amount + gas fee
                  </Text>
                  <Spacer />
                  <Text
                    fontSize={12}
                    fontWeight="800"
                    textColor="#535a62"
                    mr={2}
                  >
                    Max amount:
                  </Text>

                  <Text fontSize={14} fontWeight="400">
                    {totalGasText} {curNetwork?.currency}
                  </Text>
                </Flex>
              </Box>

              {isConfirmInValid && (
                <Alert status="error" variant="left-accent">
                  <AlertIcon />
                  You do not have enough {curNetwork?.currency} in your account
                  to pay for transaction fees on {curNetwork?.name}.
                </Alert>
              )}
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
                opacity={
                  curStep === 3
                    ? isConfirmInValid
                      ? 0.5
                      : 1.0
                    : isInvalid
                    ? 0.5
                    : 1.0
                }
                ml={4}
                mr={4}
                flex={1}
                colorScheme="blue"
                size="md"
                borderRadius={32}
                mb={4}
                onClick={async () => {
                  if (curStep === 3) {
                    if (isConfirmInValid) return;

                    // 토큰 전송을 처리한다.
                    setIsLoading(true);
                    try {
                      let sendAddress = curAccount.address;
                      let recvAddress = selectedAccount.address;
                      let value = web3.utils.toWei(amountText, "ether");
                      let tx = {
                        from: sendAddress,
                        to: recvAddress,
                        value: value,
                      };

                      tx.gas = await web3.eth.estimateGas(tx);
                      const receipt = await web3.eth.sendTransaction(tx);

                      // Activity 정보를 계정별로 저장한다.
                      let saveActivity = {
                        name: "Send",
                        txHash: receipt.transactionHash,
                        blockNumber: Number(receipt.blockNumber),
                        chainId: Number(curNetwork.chainId),
                      };

                      let newActivities = [saveActivity, ...activities];
                      await saveData(
                        `activity_${curAccount.address}`,
                        newActivities
                      );

                      printLog(tx);
                      printLog(receipt);
                      printLog(saveActivity);
                      loadActivities();

                      onClose();
                      infoToast(toast, "Confirmed");
                    } catch (e) {
                      errorToast(toast, "Failed to confirm");
                      printLog(e);
                    }

                    setIsLoading(false);
                  } else {
                    if (isInvalid) return;
                    setCurStep(3);
                  }
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
