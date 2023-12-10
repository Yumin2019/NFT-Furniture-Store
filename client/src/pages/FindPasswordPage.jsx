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

export const FindPasswordPage = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
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
          <Input pr="4.5rem" placeholder="Enter email" mb={4} />

          <Button colorScheme="teal" size="md" w="100%" mb={4}>
            Continue
          </Button>
        </Box>
      </Center>
    </>
  );
};
