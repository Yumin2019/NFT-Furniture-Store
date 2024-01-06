import { Box, Stack, Text, Spacer, Button, Image } from "@chakra-ui/react";
import { IoMdRefresh } from "react-icons/io";

export const TokensTab = ({ curNetwork }) => {
  const activities = [
    {
      title: "MATIC",
      matic: "0.1807",
      usd: "$0.20 USD",
    },
  ];

  return (
    <Box width="100%" pr={2}>
      <Text textAlign="left" mb={4} fontSize={16}>
        Dec 26, 2023
      </Text>

      {activities.map((v, index) => {
        return (
          <Box key={index}>
            <Stack direction="row" alignItems="center">
              {curNetwork?.src?.length === 0 && (
                <Box w={8} h={8} background="#f2f4f6" borderRadius={24}>
                  <Text pt={1} fontSize={16}>
                    {curNetwork?.name?.charAt(0)}
                  </Text>
                </Box>
              )}

              {curNetwork?.src?.length !== 0 && (
                <Image w={8} src={curNetwork.src} borderRadius="full" />
              )}

              <Stack direction="column" textAlign="left" ml={1}>
                <Text fontSize={16} fontWeight="600">
                  {curNetwork?.currency}
                </Text>
                <Text textColor="grey" fontSize={16}>
                  {`${v.matic} ${curNetwork?.currency}`}
                </Text>
              </Stack>
              <Spacer />

              <Stack direction="column" textAlign="right">
                <Text fontWeight="600" fontSize={16}>
                  {v.usd}
                </Text>
                <Text visibility="hidden" fontSize={16}>
                  hidden
                </Text>
              </Stack>
            </Stack>
            <Box mt={4} />
          </Box>
        );
      })}

      <Button
        mt={4}
        position="absolute"
        left={6}
        colorScheme="blue"
        variant="link"
        leftIcon={<IoMdRefresh size={20} />}
      >
        Refresh list
      </Button>
    </Box>
  );
};
