import { Box, Stack, Text, Spacer, Button, Image } from "@chakra-ui/react";
import { IoMdRefresh } from "react-icons/io";

export const TokensTab = ({ curNetwork, balanceInfo, onRefresh }) => {
  return (
    <Box width="100%" pr={2}>
      <Text textAlign="left" mb={4} fontSize={16}>
        Dec 26, 2023
      </Text>

      {balanceInfo && (
        <Box>
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
                {`${balanceInfo.value} ${curNetwork?.currency}`}
              </Text>
            </Stack>
            <Spacer />

            <Stack direction="column" textAlign="right">
              <Text fontWeight="600" fontSize={16}>
                ${balanceInfo.usdValue} USD
              </Text>
              <Text visibility="hidden" fontSize={16}>
                hidden
              </Text>
            </Stack>
          </Stack>
          <Box mt={4} />
        </Box>
      )}

      <Button
        mt={4}
        position="absolute"
        left={6}
        colorScheme="blue"
        variant="link"
        leftIcon={<IoMdRefresh size={20} />}
        onClick={onRefresh}
      >
        Refresh list
      </Button>
    </Box>
  );
};
