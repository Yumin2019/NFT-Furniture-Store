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
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { IoIosWarning } from "react-icons/io";
import {
  dialogMaxWidth,
  printLog,
  saveData,
  sendWorkerEvent,
  setBadgeText,
  truncate,
} from "../../utils/Helper";
import { web3 } from "../../pages/MainPage";
import loading from "../../assets/loading.json";
import Lottie from "lottie-react";
import {
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
  FaInfoCircle,
  FaUserCircle,
  FaQuestionCircle,
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
  const [usdAmountText, setUsdAmountText] = useState("0");

  // from, to
  const [srcAddress, setSrcAddress] = useState("");
  const [destAddress, setDestAddress] = useState("");
  const [methodName, setMethodName] = useState("");
  const [url, setUrl] = useState("");
  const [isSameSrc, setIsSameSrc] = useState(true);

  // current page, pages, curTx
  const [curPage, setCurPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [curTx, setCurTx] = useState({});

  // dest에 대한 displayText, srcDisplay는 현재 계정으로 처리
  const [destDisplayText, setDestDisplayText] = useState("");

  const [usdExchangeGasText, setUsdExchangeGasText] = useState("0");
  const [usdExchangeTotalGasText, setUsdExchangeTotalGasText] = useState("0");
  const [estimatedGasText, setEstimatedGasText] = useState("0");
  const [totalGasText, setTotalGasText] = useState("0");

  const setCurData = async () => {
    let idx = curPage - 1;
    if (!txList || idx >= txList.length || !curAccount || !balanceInfo) return;

    let from = curAccount.address;
    let to = txList[idx].to || "";
    let method = txList[idx].method || "method";
    let url = txList[idx].url || "http://localhost:4000";
    let tx = txList[idx];
    let value = Number(txList[idx].value || 0);
    value = Number(parseFloat(web3.utils.fromWei(value, "ether"))); // wei to ether

    // amountText값에 따라 usd 정보 갱신
    let usdAmount = parseFloat(value) * balanceInfo.usdRatio || 0;
    setUsdAmountText(usdAmount.toFixed(2));
    printLog(usdAmount.toFixed(2));

    setSrcAddress(from);
    setDestAddress(to);
    setMethodName(method);
    setUrl(url);
    tx.from = from;

    printLog(from);
    printLog(to);
    printLog(method);
    printLog(url);

    setPages(txList.length);
    setAmountText(value);
    setCurTx(tx);

    // display name을 처리한다.
    let destDisplay;
    for (let i = 0; i < contacts.length; ++i)
      if (contacts[i] === txList[idx].to) destDisplay = contacts[i].name;
    for (let i = 0; i < accounts.length; ++i)
      if (accounts[i] === txList[idx].to) destDisplay = accounts[i].name;

    // tx의 sender와 현재 계정이 동일함.
    setIsSameSrc(txList[idx].from === curAccount.address);
    setDestDisplayText(destDisplay);

    updateGasInfo();
  };

  const updateGasInfo = () => {
    // fee = gasPrice * gasLimit
    web3.eth.getGasPrice().then(async (gasPriceResult) => {
      let gasLimit = await web3.eth.estimateGas(txList[curPage - 1]);
      let gasPrice = parseFloat(
        web3.utils.fromWei(gasPriceResult * gasLimit, "ether")
      );
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
  };

  useEffect(() => {
    setCurData();
    printLog(`curPage = ${curPage}`);
  }, [isOpen, curPage, balanceInfo]);

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

              <Text
                fontSize={12}
                fontWeight={500}
                onClick={() => {
                  printLog(txList);
                }}
              >
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

                {!isSameSrc && (
                  <Tooltip
                    label="address is different to current account"
                    placement="bottom"
                    fontSize={12}
                  >
                    <Box mt="2px" ml={1}>
                      <IoIosWarning size={20} color="orange" />
                    </Box>
                  </Tooltip>
                )}
              </Flex>
              <IoArrowForwardCircleOutline size={40} color="#bbc0c5" />
              <Flex flex={1}>
                <FaUserCircle size={28} color="#3082ce" />
                <Text textAlign="center" fontSize={14} ml={3} mt="2px">
                  {destDisplayText || truncate(destAddress, 12)}
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
              ${usdAmountText}
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

                setIsLoading(true);
                let tx = { ...curTx };
                tx.gas = await web3.eth.estimateGas(curTx);
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

                // 해당하는 트랜잭션 정보를 삭제하고, 뱃지 텍스트를 처리한다.
                let newTxList = [...txList];
                for (let i = curPage; i < newTxList.length; ++i) {
                  newTxList[i - 1] = newTxList[i];
                }
                newTxList.pop();

                await saveData("transactions", newTxList);
                setBadgeText(
                  newTxList.length > 0 ? newTxList.length.toString() : ""
                );

                // 백그라운드 -> 컨텐츠 스크립트 -> 클라이언트 순으로 메시지를 전달한다.
                sendWorkerEvent("txRes", {
                  ...curTx,
                });

                printLog(newTxList);
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
