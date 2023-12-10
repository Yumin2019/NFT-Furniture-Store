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
import { Link } from "react-router-dom";

export const LoginPage = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  return (
    <>
      <Center>
        <Box w="25%" textAlign="center">
          <Text fontSize={40} mb={4} mt={100}>
            Furniture NFT Store
          </Text>
          <Input pr="4.5rem" placeholder="Enter email" mb={4} />
          <InputGroup size="md" mb={8}>
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

          <Button colorScheme="teal" size="md" w="100%" mb={4}>
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
