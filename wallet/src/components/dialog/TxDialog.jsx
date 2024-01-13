import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Box,
  Flex,
  Text,
  Spacer,
  Button,
  Divider,
  Alert,
  AlertIcon,
  Stack,
  Image,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FaInfoCircle, FaUserCircle, FaQuestionCircle } from "react-icons/fa";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import {
  dialogMaxWidth,
  printLog,
  saveData,
  truncate,
  validateEtherAddress,
} from "../../utils/Helper";
import { web3 } from "../../pages/MainPage";
import loading from "../../assets/loading.json";
import Lottie from "lottie-react";
import {
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
} from "react-icons/fa";

export const TxDialog = ({
  onClose,
  isOpen,
  accounts,
  contacts,
  curNetwork,
  curAccount,
  balanceInfo,
  activities,
  loadActivities,
  txList,
}) => {
  const btnRef = useRef(null);
  const lottieRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const [isConfirmInValid, setIsConfirmInvalid] = useState(false);
  const [amountText, setAmountText] = useState("0");
  const [destAddress, setDestAddress] = useState(
    "0x8aDd53b91f178832620ac4e83b29f94bfD716bda"
  );

  const [methodName, setMethodName] = useState("Mint Token");
  const [url, setUrl] = useState("http://localhost:4000");
  const [curPage, setCurPage] = useState(1);
  const [pages, setPages] = useState(3);

  const [usdExchangeText, setUsdExchangeText] = useState("0");
  const [usdExchangeGasText, setUsdExchangeGasText] = useState("0");
  const [usdExchangeTotalGasText, setUsdExchangeTotalGasText] = useState("0");
  const [estimatedGasText, setEstimatedGasText] = useState("0");
  const [totalGasText, setTotalGasText] = useState("0");
  const [selectedAccount, setSelectedAccount] = useState({});
  const [addressText, setAddressText] = useState("");

  useEffect(() => {
    setAmountText("0");
    setAddressText("");

    printLog(curAccount);
    printLog(curNetwork);
    printLog(balanceInfo);
    printLog(txList);
  }, [isOpen]);

  useEffect(() => {
    console.log(curPage);
  }, [curPage]);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (!balanceInfo || !curAccount || !curNetwork) return;

    let usdExchange = parseFloat(amountText) * balanceInfo.usdRatio || 0;
    let isInvalid = parseFloat(amountText) > balanceInfo.value;

    printLog(usdExchange.toFixed(2));
    printLog(`isInvalid = ${isInvalid}`);

    setUsdExchangeText(usdExchange.toFixed(2));
  }, [amountText]);

  useEffect(() => {
    let isValid = validateEtherAddress(addressText);
    printLog(`isAddressValid = ${isValid}`);

    if (isValid) {
      setSelectedAccount({ name: addressText, address: addressText });
      //   setCurStep(2);
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

        <Box>
          <Flex alignItems="center" mt={1} mb={1}>
            {/* 여러 트랜잭션 정보가 있는 경우 좌우 이동 */}

            {pages > 1 && (
              <Flex ml={2} alignItems="center">
                <Box opacity={curPage > 1 ? 1.0 : 0.4}>
                  <FaRegArrowAltCircleLeft
                    size={28}
                    color="grey"
                    onClick={() => {
                      if (curPage > 1) setCurPage(curPage - 1);
                    }}
                  />
                </Box>

                <Box ml={2} opacity={curPage < pages ? 1.0 : 0.4}>
                  <FaRegArrowAltCircleRight
                    size={28}
                    color="grey"
                    onClick={() => {
                      if (curPage < pages) setCurPage(curPage + 1);
                    }}
                  />
                </Box>

                <Text fontWeight="bold" fontSize={16} ml={2}>
                  {curPage} of {pages}
                </Text>
              </Flex>
            )}

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
                <Text textAlign="center" fontSize={14} ml={3} mt="2px">
                  {truncate(destAddress, 12)}
                </Text>
              </Flex>
            </Stack>
          </Box>
          {/* Page 3 Grey  */}
          <Box background="#f2f4f6" pt={4} pb={4}>
            <Text ml={4} mb={2} fontSize={14} fontWeight={500}>
              {url}
            </Text>
            <Box
              ml={4}
              maxW={200}
              border="1px solid #bbc0c5"
              borderRadius={4}
              p="1px"
              textAlign="center"
            >
              <Text fontSize={12}>
                {truncate(destAddress, 15)}: {methodName}
              </Text>
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
                <Text fontSize={12} fontWeight="800" textColor="#535a62" mr={2}>
                  Max fee:
                </Text>

                <Text fontSize={14} fontWeight="400">
                  {estimatedGasText} {curNetwork?.currency}
                </Text>
              </Flex>
            </Box>
            <Divider />
            <Box mt={1} borderRadius={4} pl={2} pt={2} pr={2} pb={2}>
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
                <Text fontSize={12} fontWeight="800" textColor="#535a62" mr={4}>
                  Max amount:
                </Text>

                <Text fontSize={14} fontWeight="400">
                  {totalGasText} {curNetwork?.currency}
                </Text>
              </Flex>
            </Box>

            {isConfirmInValid && (
              <Alert status="error" variant="left-accent" mb={65}>
                <AlertIcon />
                You do not have enough {curNetwork?.currency} in your account to
                pay for transaction fees on {curNetwork?.name}.
              </Alert>
            )}
          </Box>
        </Box>

        {/* Bottom Button */}
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
              Reject
            </Button>
            <Button
              opacity={isConfirmInValid ? 0.5 : 1.0}
              ml={4}
              mr={4}
              flex={1}
              colorScheme="blue"
              size="md"
              borderRadius={32}
              mb={4}
              onClick={async () => {
                if (isConfirmInValid) return;

                // 토큰 전송을 처리한다.
                setIsLoading(true);
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

                printLog(tx);
                printLog(receipt);

                // Activity 정보를 계정별로 저장한다.
                let saveActivity = {
                  name: methodName,
                  txHash: receipt.transactionHash,
                  blockNumber: Number(receipt.blockNumber),
                  chainId: Number(curNetwork.chainId),
                };

                let newActivities = [saveActivity, ...activities];
                await saveData(`activity_${curAccount.address}`, newActivities);

                printLog(saveActivity);
                setIsLoading(false);
                loadActivities();
                onClose();
              }}
            >
              Confirm
            </Button>
          </Flex>
        </Box>
      </ModalContent>
    </Modal>
  );
};
