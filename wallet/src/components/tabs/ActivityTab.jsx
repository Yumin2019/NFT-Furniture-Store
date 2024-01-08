import {
  Box,
  Stack,
  Text,
  Spacer,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { ActivityDialog } from "../dialog/ActivityDialog";
import { useEffect, useState } from "react";
import { web3 } from "../../pages/MainPage";
import { printLog } from "../../utils/Helper";

export const ActivityTab = ({ curNetwork, activities, balanceInfo }) => {
  const [convertActivities, setConvertActivities] = useState([]);

  const updateList = async () => {
    // activities: 해당 계정의 모든 chainId에 대한 트랜잭션 정보
    // chainId에 맞는 트랜잭션 정보만 처리해야 한다.
    let list = [];
    await Promise.all(
      activities.map(async (v) => {
        if (v.chainId !== curNetwork.chainId) return;

        let transaction = await web3.eth.getTransaction(v.txHash);
        let block = await web3.eth.getBlock(v.blockNumber);
        let receipt = await web3.eth.getTransactionReceipt(v.txHash);

        // Activity 탭에 필요한 정보를 만들어준다.
        let date = new Date(Number(block.timestamp) * 1000);
        let value = parseFloat(web3.utils.fromWei(transaction.value, "ether"));
        let usdExchange = value * balanceInfo.usdRatio || 0;
        let data = {
          name: v.name,
          confirmed: Number(receipt.status) === 1,
          value: Number(value.toFixed(7)),
          usdValue: usdExchange.toFixed(2),
          date: date,
          dateString: date.toLocaleDateString().replaceAll(" ", ""),
        };

        list.push(data);

        // printLog(transaction);
        // printLog(block);
        // printLog(receipt);
        // printLog(data);
      })
    );

    list = list.sort((a, b) => b.date - a.date);
    setConvertActivities(list);
    console.log(list);
  };

  useEffect(() => {
    updateList();
  }, [activities]);

  const clickActivity = () => {
    console.log("tab");
    onActivityOpen();
  };

  const {
    isOpen: isActivityOpen,
    onOpen: onActivityOpen,
    onClose: onActivityClose,
  } = useDisclosure();

  return (
    <Box width="100%" pr={2}>
      <ActivityDialog
        isOpen={isActivityOpen}
        onOpen={onActivityOpen}
        onClose={onActivityClose}
      />

      {convertActivities.length === 0 && (
        <Text
          textAlign="center"
          mt={3}
          fontSize={16}
          textColor="#bcc0c4"
          fontWeight={600}
        >
          You have no transactions
        </Text>
      )}

      {convertActivities.map((v, index) => {
        let showDate =
          index === 0 ||
          convertActivities[index - 1].dateString !==
            convertActivities[index].dateString;
        return (
          <Box key={index} onClick={clickActivity} cursor="pointer">
            {showDate && (
              <Text
                textAlign="left"
                mb={4}
                mt={index !== 0 ? 8 : 0}
                fontSize={15}
              >
                {v.dateString}
              </Text>
            )}
            {curNetwork?.src?.length === 0 && (
              <Box
                alignItems="center"
                backgroundColor="#f2f4f6"
                borderRadius={24}
                pl={1}
                pr={1}
                fontSize={10}
                position="absolute"
                left="44px"
              >
                {curNetwork?.name?.charAt(0)}
              </Box>
            )}

            {curNetwork?.src?.length !== 0 && (
              <Image
                w={4}
                src={curNetwork.src}
                borderRadius="full"
                position="absolute"
                left="44px"
              />
            )}
            <Stack direction="row" alignItems="center">
              <Box
                backgroundColor="#eaf1fa"
                padding={2}
                borderRadius={24}
                mb={4}
              >
                <HiOutlineSwitchHorizontal color="#0672c2" size={22} />
              </Box>

              <Box textAlign="left" ml={1.5}>
                <Text fontSize={16} fontWeight="600">
                  {v.name}
                </Text>
                <Text
                  fontSize={14}
                  fontWeight={500}
                  textColor={v.confirmed ? "#28a746" : "#dc362e"}
                >
                  {v.confirmed ? "Confirmed" : "Rejected"}
                </Text>
              </Box>
              <Spacer />
              <Box textAlign="right">
                <Text fontWeight="600" fontSize={16}>
                  {`-${v.value} ${curNetwork?.currency}`}
                </Text>
                <Text textColor="#5a6267" fontSize={15}>
                  -${v.usdValue} USD
                </Text>
              </Box>
            </Stack>

            <Box mt={4} />
          </Box>
        );
      })}
    </Box>
  );
};
