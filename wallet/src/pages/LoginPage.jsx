import {
  Button,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Box,
  useToast,
  Image,
} from "@chakra-ui/react";
import { useState } from "react";
import { errorToast, loadData, successToast } from "../utils/Helper";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [emailText, setEmailText] = useState("");
  const [passwordText, setPasswordText] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const clickLogin = async () => {
    let password = await loadData("password");
    if (passwordText === password) {
      navigate("/main");
    } else {
      errorToast(toast, `Login Failed`);
    }
  };

  return (
    <>
      <Center>
        <Box textAlign="center">
          <Text fontSize={40} mt={16} color="grey" fontWeight="400">
            Furniture Wallet
          </Text>
          <Text fontSize={24} mb={4} color="grey">
            Welcome back!
          </Text>
          <Center margin={8}>
            <Image width={128} src="/image/icon-128.png" />
          </Center>

          <InputGroup size="md" mb={8}>
            <Input
              variant="flushed"
              type="password"
              placeholder="Enter password"
              focusBorderColor="blue.400"
              value={passwordText}
              onChange={(e) => {
                setPasswordText(e.target.value);
              }}
            />
          </InputGroup>

          <Button
            colorScheme="blue"
            size="md"
            w="100%"
            borderRadius={32}
            mb={4}
            onClick={clickLogin}
          >
            Login
          </Button>

          <Button size="sm" variant="link" colorScheme="blue" mb={4}>
            Forgot password?
          </Button>
        </Box>
      </Center>
    </>
  );
};
