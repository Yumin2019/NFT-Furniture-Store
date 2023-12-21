import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Checkbox,
  Center,
  Box,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  errorToast,
  infoToast,
  successToast,
  validateEmail,
} from "../utils/Helper";
import { api } from "../utils/Axios";

export const RegisterPage = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const [allowTerms, setAllowTerms] = useState(false);
  const [nameText, setNameText] = useState("");
  const [emailText, setEmailText] = useState("");
  const [passwordText, setPasswordText] = useState("");
  const [passwordAgainText, setPasswordAgainText] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const clickRegister = async () => {
    try {
      // check empty
      if (
        nameText.length === 0 ||
        emailText.length === 0 ||
        passwordText.length === 0 ||
        passwordAgainText.length === 0
      ) {
        infoToast(toast, `input all blanks`);
        return;
      }

      // terms of policy
      if (!allowTerms) {
        infoToast(toast, `You have to allow Terms and conditions`);
        return;
      }

      // email check
      if (!validateEmail(emailText)) {
        infoToast(toast, `Invalid Email`);
        return;
      }

      // check password(비밀번호 제약은 걸지 않음)
      if (passwordText != passwordAgainText) {
        infoToast(toast, `Password is not same`);
        return;
      }

      let res = await api.post("/register", {
        name: nameText,
        email: emailText,
        password: passwordText,
      });

      if (res.status === 200) {
        successToast(toast, `Registered`);
        navigate("/");
      } else {
        errorToast(toast, "Registration Failed");
      }
    } catch (e) {
      errorToast(toast, e.response.data.msg);
      console.log(e);
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
            placeholder="Enter name"
            mb={4}
            value={nameText}
            onChange={(e) => {
              setNameText(e.target.value);
            }}
          />
          <Input
            pr="4.5rem"
            placeholder="Enter email"
            mb={4}
            value={emailText}
            onChange={(e) => {
              setEmailText(e.target.value);
            }}
          />
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
          <InputGroup size="md" mb={4}>
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
          <Checkbox
            mb={8}
            onChange={(e) => {
              setAllowTerms(e.target.checked);
            }}
            onChan
          >
            I do accept the Terms and conditions of your site.
          </Checkbox>
          <Button
            colorScheme="teal"
            size="md"
            w="100%"
            mb={4}
            onClick={clickRegister}
          >
            Register
          </Button>
          <Text mr={1}>Already have an account?</Text>
          <Link to={"/login"}>
            <Button size="sm" variant="link" colorScheme="teal">
              Login
            </Button>
          </Link>
        </Box>
      </Center>
    </>
  );
};
