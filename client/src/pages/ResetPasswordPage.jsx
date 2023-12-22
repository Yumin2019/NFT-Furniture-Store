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
import { useNavigate } from "react-router-dom";
import { api } from "../utils/Axios";
import {
  errorToast,
  getQueryParam,
  infoToast,
  successToast,
} from "../utils/Helper";

export const ResetPasswordPage = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [passwordText, setPasswordText] = useState("");
  const [passwordAgainText, setPasswordAgainText] = useState("");
  const navigate = useNavigate();

  const clickContinue = async () => {
    try {
      // check empty
      if (passwordText.length === 0 || passwordAgainText.length === 0) {
        infoToast(toast, "input password");
        return;
      }

      // check password(비밀번호 제약은 걸지 않음)
      if (passwordText != passwordAgainText) {
        infoToast(toast, `Password is not same`);
        return;
      }

      const token = getQueryParam();
      let res = await api.post("/resetPassword", {
        token: token,
        password: passwordText,
      });

      if (res.status === 200) {
        successToast(toast, "Changed Password");
        navigate("/");
      } else {
        errorToast(toast, "Reset Password Failed");
      }
    } catch (e) {
      console.log(e);
      errorToast(toast, e.response.data.msg);
    }
  };

  return (
    <>
      <Center>
        <Box width="25%" textAlign="center">
          <Text fontSize={40} mb={4} mt={100}>
            Reset Password
          </Text>

          <Text mb={4}>You can reset your password and then use it.</Text>

          <InputGroup size="md" mb={4}>
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder="Enter password"
              value={passwordText}
              onChange={(e) => {
                setPasswordText(e.target.value);
              }}
            />
            <InputRightElement width="4.5rem">
              <Button size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>

          <InputGroup size="md" mb={8}>
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder="Enter password again"
              value={passwordAgainText}
              onChange={(e) => {
                setPasswordAgainText(e.target.value);
              }}
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
            onClick={clickContinue}
          >
            Reset
          </Button>
        </Box>
      </Center>
    </>
  );
};
