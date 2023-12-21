import { Button, Center, Input, Text, Box, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { errorToast, infoToast, validateEmail } from "../utils/Helper";
import { api } from "../utils/Axios";
import { useNavigate } from "react-router-dom";

export const FindPasswordPage = () => {
  const [emailText, setEmailText] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const clickContinue = async () => {
    try {
      if (emailText.length === 0) {
        infoToast(toast, "input email");
        return;
      }

      if (!validateEmail(emailText)) {
        infoToast(toast, `invalid email`);
        return;
      }

      let res = await api.post("requestResetMail", { email: emailText });
      if (res.status === 200) {
        infoToast(toast, "check out your email");
        navigate("/");
      } else {
        errorToast(toast, res.data.msg);
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
            Forgot Password
          </Text>

          <Text mb={4}>
            You will receive a link to reset your password via email.
          </Text>
          <Input
            pr="4.5rem"
            placeholder="Enter email"
            mb={4}
            value={emailText}
            onChange={(e) => {
              setEmailText(e.target.value);
            }}
          />

          <Button
            colorScheme="teal"
            size="md"
            w="100%"
            mb={4}
            onClick={clickContinue}
          >
            Continue
          </Button>
        </Box>
      </Center>
    </>
  );
};
