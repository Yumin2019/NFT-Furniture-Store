import {
  Button,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";

export const ResetPasswordPage = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
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
            />
            <InputRightElement width="4.5rem">
              <Button size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>

          <Button colorScheme="teal" size="md" w="100%" mb={4}>
            Reset
          </Button>
        </Box>
      </Center>
    </>
  );
};
