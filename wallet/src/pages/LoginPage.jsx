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
import { api } from "../utils/Axios";
import { errorToast, successToast } from "../utils/Helper";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [show, setShow] = useState(false);
  const [emailText, setEmailText] = useState("");
  const [passwordText, setPasswordText] = useState("");

  const handleClick = () => setShow(!show);
  const toast = useToast();
  const navigate = useNavigate();

  const clickLogin = async () => {
    navigate("/");

    return;
    try {
      console.log(`email ${emailText}`);
      console.log(`password ${passwordText}`);

      let res = await api.post("login", {
        email: emailText,
        password: passwordText,
      });

      if (res.status === 200) {
        successToast(toast, `Login Success`);
        navigate("/");
      } else {
        errorToast(toast, `Login Failed`);
      }
    } catch (e) {
      console.log(e);
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
