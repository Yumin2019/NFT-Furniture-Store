import { Box, Stack, Text, Spacer } from "@chakra-ui/react";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";

export const ActivityTab = () => {
  const activities = [
    {
      title: "Buy Token",
      action: "Confirmed",
      used: "-0.001 MATIC",
      usedUsd: "-$0.00 USD",
    },
    {
      title: "Sell Token",
      action: "Confirmed",
      used: "-0.001 MATIC",
      usedUsd: "-$0.00 USD",
    },
  ];

  return (
    <Box width="100%" pr={2}>
      <Text textAlign="left" mb={4} fontSize={16}>
        Dec 26, 2023
      </Text>
      {activities.map((v) => {
        return (
          <Box>
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
              M
            </Box>
            <Stack direction="row" alignItems="center">
              <Box
                backgroundColor="#eaf1fa"
                padding={2}
                borderRadius={24}
                mb={4}
              >
                <HiOutlineSwitchHorizontal color="#0672c2" size={22} />
              </Box>

              <Stack direction="column" textAlign="left" ml={1}>
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
                  {v.used}
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
