import {
  Button,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Checkbox,
} from "@chakra-ui/react";
import { useState } from "react";

export const RegisterPage = () => {
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
        <Input pr="4.5rem" placeholder="Enter name" mb={4} w="50%" />
      </Center>
      <Center>
        <Input pr="4.5rem" placeholder="Enter email" mb={4} w="50%" />
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
        <InputGroup size="md" mb={4} w="50%">
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
        <Checkbox mb={8}>
          I do accept the Terms and conditions of your site.
        </Checkbox>
      </Center>
      <Center>
        <Button colorScheme="blue" size="md" w="50%" mb={4}>
          Register
        </Button>
      </Center>

      <Center>
        <Text mr={1}>Already have a account?</Text>
        <Button size="sm" variant="link" colorScheme="blue">
          Login
        </Button>
      </Center>
    </>
  );
};
