import {
  Button,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const LoginPage = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  return (
    <>
      <Center>
        <Text fontSize={40} mb={4} mt={100}>
          Furniture NFT Store
        </Text>
      </Center>
      <Center>
        <Input pr="4.5rem" placeholder="Enter email" mb={4} w="50%" />
      </Center>
      <Center>
        <InputGroup size="md" mb={8} w="50%">
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
        <Button colorScheme="blue" size="md" w="50%" mb={4}>
          Login
        </Button>
      </Center>

      <Center>
        <Link to={"/findPassword"}>
          <Button size="sm" variant="link" colorScheme="blue" mb={4}>
            Forgot password?
          </Button>
        </Link>
      </Center>

      <Center>
        <Text mr={1}>New to Furniture NFT Store?</Text>
        <Link to={"/register"}>
          <Button size="sm" variant="link" colorScheme="blue">
            Join now
          </Button>
        </Link>
      </Center>
    </>
  );
};
