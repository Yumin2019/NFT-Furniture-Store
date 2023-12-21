import {
  Button,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Box,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/Axios";
import { useAtom } from "jotai";
import { loginAtom } from "./MainPage";
import { errorToast, successToast } from "../utils/Helper";

export const LoginPage = () => {
  const [show, setShow] = useState(false);
  const [emailText, setEmailText] = useState("");
  const [passwordText, setPasswordText] = useState("");
  const [isLogin, setIsLogin] = useAtom(loginAtom);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const navigate = useNavigate();

  const onClickLogin = async () => {
    try {
      console.log(`email ${emailText}`);
      console.log(`password ${passwordText}`);

      let res = await api.post("login", {
        email: emailText,
        password: passwordText,
      });

      setIsLogin(res.status === 200);
      if (res.status === 200) {
        successToast(toast, `Login Success`);
        navigate("/");
      } else {
        errorToast(toast, `Login Failed`);
      }
    } catch (e) {
      console.log(e);
      errorToast(toast, e.response.data.msg);
    }
  };

  return (
    <>
      <Center>
        <Box w="25%" textAlign="center">
          <Text fontSize={40} mb={4} mt={100}>
            Furniture NFT Store
          </Text>
          <Input
            pr="4.5rem"
            placeholder="Enter email"
            mb={4}
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
          />
          <InputGroup size="md" mb={8}>
            <Input
              value={passwordText}
              onChange={(e) => {
                setPasswordText(e.target.value);
              }}
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder="Enter password"
            />
            <InputRightElement width="4.5rem">
              <Button size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>

          <Button
            colorScheme="teal"
            size="md"
            w="100%"
            mb={4}
            onClick={onClickLogin}
          >
            Login
          </Button>

          <Link to={"/findPassword"}>
            <Button size="sm" variant="link" colorScheme="teal" mb={4}>
              Forgot password?
            </Button>
          </Link>

          <Text mr={1}>New to Furniture NFT Store?</Text>
          <Link to={"/register"}>
            <Button size="sm" variant="link" colorScheme="teal">
              Join now
            </Button>
          </Link>
        </Box>
      </Center>
    </>
  );
};
