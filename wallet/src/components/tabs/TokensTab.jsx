import { Box, Stack, Text, Spacer, Button } from "@chakra-ui/react";
import { IoMdRefresh } from "react-icons/io";

export const TokensTab = () => {
  const activities = [
    {
      title: "MATIC",
      matic: "0.1807 MATIC",
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
                backgroundColor="#f2f4f6"
                pt={1.5}
                pb={1.5}
                pl={3}
                pr={3}
                mb={4}
                borderRadius={24}
                fontSize={16}
              >
                M
              </Box>

              <Stack direction="column" textAlign="left" ml={1}>
                <Text fontSize={16} fontWeight="600">
                  {v.title}
                </Text>
                <Text textColor="grey" fontSize={16}>
                  {v.matic}
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
