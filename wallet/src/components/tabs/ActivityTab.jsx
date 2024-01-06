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

export const ActivityTab = ({ curNetwork }) => {
  const activities = [
    {
      title: "Buy Token",
      action: "Confirmed",
      used: "-0.001",
      usedUsd: "-$0.00 USD",
    },
    {
      title: "Sell Token",
      action: "Confirmed",
      used: "-0.001",
      usedUsd: "-$0.00 USD",
    },
  ];

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

      <Text textAlign="left" mb={4} fontSize={16}>
        Dec 26, 2023
      </Text>
      {activities.map((v, index) => {
        return (
          <Box key={index} onClick={clickActivity} cursor="pointer">
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

              <Stack direction="column" textAlign="left" ml={1.5}>
                <Text fontSize={16} fontWeight="600">
                  {v.title}
                </Text>
                <Text fontSize={16} textColor="green">
                  {v.action}
                </Text>
              </Stack>
              <Spacer />
              <Stack direction="column" textAlign="right">
                <Text fontWeight="600" fontSize={16}>
                  {`${v.used} ${curNetwork?.currency}`}
                </Text>
                <Text textColor="grey" fontSize={16}>
                  {v.usedUsd}
                </Text>
              </Stack>
            </Stack>

            <Box mt={4} />
          </Box>
        );
      })}
    </Box>
  );
};
