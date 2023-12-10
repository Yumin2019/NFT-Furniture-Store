import {
  Button,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

export const ResetPasswordPage = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  return (
    <>
      <Center>
        <Text fontSize={40} mb={4} mt={100}>
          Reset Password
        </Text>
      </Center>

      <Center mb={4}>
        <Text>You can reset your password and then use it.</Text>
      </Center>

      <Center>
        <InputGroup size="md" mb={4} w="50%">
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
      </Center>

      <Center>
        <InputGroup size="md" mb={8} w="50%">
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
      </Center>

      <Center>
        <Button colorScheme="blue" size="md" w="50%" mb={4}>
          Reset
        </Button>
      </Center>
    </>
  );
};
