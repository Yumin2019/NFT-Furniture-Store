import {
  Box,
  Center,
  Text,
  Button,
  Image,
  Checkbox,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const IntroPage = () => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  const clickCreate = () => {
    navigate("/createWallet");
  };

  const clickImport = () => {
    navigate("/importWallet");
  };

  return (
    <Center>
      <Box textAlign="center" ml={2} mr={2}>
        <Text fontSize={40} mt={16} color="grey" fontWeight="400">
          Furniture Wallet
        </Text>
        <Text fontSize={16} mb={4} color="grey">
          Use your Furniture Wallet to login to decentralized apps - no signup
          needed.
        </Text>
        <Center
          margin={8}
          onClick={() => {
            navigate("/main"); // 개발용
          }}
        >
          <Image width={128} src="/image/icon-128.png" />
        </Center>

        <Checkbox
          isChecked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        >
          <Flex>
            <Text fontSize={14}>I agree to Furniture Wallet's</Text>
            <Button colorScheme="blue" variant="link" fontSize={14} ml={1}>
              Terms of use
            </Button>
          </Flex>
        </Checkbox>

        <Box opacity={isChecked ? 1.0 : 0.4}>
          <Button
            mt={6}
            colorScheme="blue"
            size="md"
            w="80%"
            borderRadius={32}
            mb={4}
            onClick={isChecked ? clickCreate : null}
          >
            Create a new wallet
          </Button>

          <Button
            mt={2}
            variant="outline"
            colorScheme="blue"
            w="80%"
            size="md"
            borderRadius={32}
            mb={4}
            onClick={isChecked ? clickImport : null}
          >
            Import an existing wallet
          </Button>
        </Box>
      </Box>
    </Center>
  );
};
