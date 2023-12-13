import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Checkbox,
  Center,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const RegisterPage = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  return (
    <>
      <Center>
        <Box w="25%" textAlign="center">
          <Text fontSize={40} mb={4} mt={100}>
            Furniture NFT Store
          </Text>
          <Input pr="4.5rem" placeholder="Enter name" mb={4} />
          <Input pr="4.5rem" placeholder="Enter email" mb={4} />
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
          <InputGroup size="md" mb={4}>
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
          <Checkbox mb={8}>
            I do accept the Terms and conditions of your site.
          </Checkbox>
          <Button colorScheme="teal" size="md" w="100%" mb={4}>
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
