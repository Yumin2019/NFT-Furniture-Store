import {
  Button,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

export const FindPasswordPage = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  return (
    <>
      <Center>
        <Text fontSize={40} mb={4} mt={100}>
          Forgot Password
        </Text>
      </Center>

      <Center mb={4}>
        <Text>You will receive a link to reset your password via email.</Text>
      </Center>
      <Center mb={4}>
        <Input pr="4.5rem" placeholder="Enter email" mb={4} w="50%" />
      </Center>

      <Center>
        <Button colorScheme="blue" size="md" w="50%" mb={4}>
          Continue
        </Button>
      </Center>
    </>
  );
};
