import {
  Box,
  Text,
  Button,
  Input,
  Flex,
  Grid,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  clearData,
  createEtherAccount,
  errorToast,
  infoToast,
  printLog,
  saveData,
  successToast,
} from "../../utils/Helper";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { validateMnemonic } from "bip39";

export const WalletRecoveryPage = ({ onNext }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(true);
  const [wordList, setWordList] = useState(Array(12).fill(""));
  const [hideList, setHideList] = useState(Array(12).fill(false));
  const [mnemonicText, setMnemonicText] = useState("");

  useEffect(() => {
    let mnemonic = wordList.join(" ");
    let valid = validateMnemonic(mnemonic);
    printLog(valid);
    setIsValid(valid);
    setMnemonicText(mnemonic);
  }, [wordList]);

  return (
    <Box>
      <Text fontSize={28} mt={4} fontWeight="bold">
        Access your wallet with your Secret Recovery Phrase
      </Text>
      <Text fontSize={16} mt={2}>
        We will use your Secret Recovery Phrase to validate your ownership,
        restore your wallet and set up a new password.
      </Text>

      <Box position="relative" w="100%" h={190} mt={6}>
        <Grid
          templateColumns="repeat(3, 1fr)"
          border="1px solid #d6d9dc"
          padding={3}
          borderRadius={16}
        >
          {wordList &&
            wordList.map((v, index) => {
              return (
                <Flex alignItems="center" mt={index < 3 ? 0 : 3} key={index}>
                  <Text fontSize={16} w={8} mr={1}>
                    {index + 1}.
                  </Text>

                  <Input
                    mr={2}
                    size="sm"
                    w={100}
                    type={!hideList[index] ? "text" : "password"}
                    borderRadius={10}
                    value={wordList[index]}
                    onChange={(e) => {
                      let list = [...wordList];
                      list[index] = e.target.value;
                      setWordList(list);
                    }}
                  />

                  <Box
                    onClick={() => {
                      let list = [...hideList];
                      list[index] = !list[index];
                      setHideList(list);
                    }}
                  >
                    {hideList[index] ? (
                      <IoMdEyeOff size={24} />
                    ) : (
                      <IoMdEye size={24} />
                    )}
                  </Box>
                </Flex>
              );
            })}
        </Grid>
      </Box>

      <Box opacity={isValid ? 1.0 : 0.4}>
        <Button
          mt={8}
          colorScheme="blue"
          size="md"
          fontSize={13}
          w="80%"
          borderRadius={32}
          mb={4}
          onClick={async () => {
            if (isValid) {
              let accounts = await createEtherAccount(mnemonicText);
              await clearData();
              await saveData("accounts", accounts);
              await saveData("accountIdx", 0);
              onNext();
            }
          }}
        >
          Confirm Secret Recovery Phrase
        </Button>
      </Box>
    </Box>
  );
};
