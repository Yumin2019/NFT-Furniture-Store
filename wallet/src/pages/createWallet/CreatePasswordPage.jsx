/*global chrome*/
import {
  Box,
  Text,
  InputGroup,
  Input,
  Button,
  InputRightElement,
  Checkbox,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useState } from "react";
import { saveData, sendWorkerEvent } from "../../utils/Helper";

export const CreatePasswordPage = ({ onNext, buttonText }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [pwText, setPwText] = useState("");
  const [confirmPwText, setConfirmPwText] = useState("");

  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const clickCreate = () => {
    saveData("password", pwText);
    onNext();
  };

  useEffect(() => {
    if (!isChecked || pwText.length < 8 || pwText !== confirmPwText) {
      setIsValid(false);
      return;
    }

    setIsValid(true);
  }, [isChecked, pwText, confirmPwText]);

  return (
    <Box>
      <Text fontSize={28} mt={4} fontWeight="bold">
        Create password
      </Text>

      <Text fontSize={16} mt={2}>
        This password will be used for Furniture Wallet only on this device.
        Furniture Wallet can't recover this password.
      </Text>

      <InputGroup size="md" mt={6}>
        <Input
          pr="4.5rem"
          type={showPw ? "text" : "password"}
          placeholder="Enter password(8 charactres min)"
          focusBorderColor="blue.400"
          value={pwText}
          onChange={(e) => {
            setPwText(e.target.value);
          }}
        />
        <InputRightElement width="4.5rem">
          <Button
            size="sm"
            colorScheme="blue"
            variant="ghost"
            onClick={() => {
              setShowPw(!showPw);
            }}
          >
            {showPw ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>

      <InputGroup size="md" mt={4}>
        <Input
          pr="4.5rem"
          type={showConfirmPw ? "text" : "password"}
          placeholder="Confirm password"
          focusBorderColor="blue.400"
          value={confirmPwText}
          onChange={(e) => {
            setConfirmPwText(e.target.value);
          }}
        />

        <InputRightElement width="4.5rem">
          <Button
            size="sm"
            colorScheme="blue"
            variant="ghost"
            onClick={() => {
              setShowConfirmPw(!showConfirmPw);
            }}
          >
            {showConfirmPw ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>

      <Checkbox
        mt={4}
        isChecked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
      >
        <Text fontSize={14}>
          I understand that Furniture Wallet can't recover this password for me.
        </Text>
      </Checkbox>

      <Box opacity={isValid ? 1.0 : 0.4}>
        <Button
          mt={6}
          colorScheme="blue"
          size="md"
          w="80%"
          fontSize={13}
          borderRadius={32}
          mb={4}
          onClick={isValid ? clickCreate : null}
        >
          {buttonText}
        </Button>
      </Box>
    </Box>
  );
};
