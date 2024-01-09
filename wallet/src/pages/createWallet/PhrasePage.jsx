import {
  Box,
  Text,
  Button,
  Center,
  Input,
  Flex,
  Grid,
  GridItem,
  useToast,
} from "@chakra-ui/react";
import { ListItem, UnorderedList } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import {
  copyTextOnClipboard,
  createEtherAccount,
  createMnemonic,
  errorToast,
  getRandomInt,
  infoToast,
  printLog,
  saveData,
  successToast,
} from "../../utils/Helper";
import { IoCopy } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export const PhasePage = ({ onNext }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [isNext, setIsNext] = useState(false);
  const [hidePhase, setHidePhase] = useState(true);
  const [originalWordList, setOriginalWordList] = useState(Array(12).fill(""));
  const [wordList, setWordList] = useState(Array(12).fill(""));
  const [mnemonicText, setMnemonicText] = useState("");

  const [confirmIndexs, setConfirmIndexes] = useState(new Set([]));
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    let mnemonic = createMnemonic();
    let array = mnemonic.split(" ");
    printLog(array);
    setWordList(array);
    setOriginalWordList(array);
    setMnemonicText(mnemonic);
  }, []);

  useEffect(() => {
    let valid = true;
    wordList.map((v, index) => {
      if (v !== originalWordList[index]) {
        valid = false;
      }
    });

    printLog(valid);
    setIsValid(valid);
  }, [wordList]);

  return (
    <Box>
      <Text fontSize={28} mt={4} fontWeight="bold">
        {!isNext
          ? "Write down your Secret Recovery Phrase"
          : "Confirm Secret Recovery Phrase"}
      </Text>
      <Text fontSize={16} mt={2}>
        {!isNext
          ? "Write down this 12-word Secret Recovery Phrase and save it in a place that you trust and only you can access."
          : "Confirm Secret Recovery Phrase"}
      </Text>

      {!isNext && (
        <Box>
          <Text fontSize={16} textAlign="left" fontWeight="bold" mt={4}>
            Tips:
          </Text>
          <UnorderedList textAlign="left" fontSize={16}>
            <ListItem>Save in a password manager</ListItem>
            <ListItem>Store in a safe deposit box</ListItem>
            <ListItem>Integer molestie lorem at massa</ListItem>
            <ListItem>Write down and store in multiple secret places</ListItem>
          </UnorderedList>
        </Box>
      )}

      <Box position="relative" w="100%" h={190} mt={6}>
        <Grid
          templateColumns="repeat(3, 1fr)"
          border="1px solid #d6d9dc"
          padding={3}
          borderRadius={16}
        >
          {wordList &&
            wordList.map((v, index) => {
              const arr = [...confirmIndexs];
              let isEditable = isNext && arr.includes(index);

              return (
                <Flex alignItems="center" mt={index < 3 ? 0 : 3} key={index}>
                  <Text fontSize={16} w={8} mr={1}>
                    {index + 1}.
                  </Text>
                  <Input
                    size="sm"
                    w={100}
                    borderRadius={10}
                    border={isEditable ? "1px solid #0477c9" : null}
                    value={isNext ? wordList[index] : originalWordList[index]}
                    onChange={(e) => {
                      if (!isEditable) return;
                      let list = [...wordList];
                      list[index] = e.target.value;
                      setWordList(list);
                    }}
                    disabled={isNext && !isEditable}
                  />
                </Flex>
              );
            })}
        </Grid>

        <Box
          w="100%"
          h={190}
          position="relative"
          top={-190}
          background="black"
          opacity={0.94}
          borderRadius={5}
          visibility={hidePhase ? "visible" : "hidden"}
        >
          <Center top={10} position="relative">
            <FaEye color="white" />
          </Center>
          <Text
            top={20}
            position="relative"
            fontSize={12}
            textColor="white"
            fontWeight="bold"
          >
            Make sure nobody is looking
          </Text>
        </Box>
      </Box>
      {!hidePhase && !isNext && (
        <Flex mt={6}>
          <Button
            flex={1}
            colorScheme="blue"
            variant="link"
            size="sm"
            borderRadius={25}
            onClick={() => setHidePhase(!hidePhase)}
          >
            <Box mr={1}>
              <IoMdEyeOff />
            </Box>
            Hide seed phrase
          </Button>

          <Button
            flex={1}
            colorScheme="blue"
            variant="link"
            size="sm"
            borderRadius={25}
            onClick={() => {
              let text = "";
              wordList.map((v) => {
                text += `${v} `;
              });
              copyTextOnClipboard(text);
            }}
          >
            <Box mr={1}>
              <IoCopy />
            </Box>
            Copy to clipboard
          </Button>
        </Flex>
      )}

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
            // 초기 구문보기 처리
            if (hidePhase) {
              setHidePhase(!hidePhase);
            } else if (!isNext) {
              setIsNext(true);

              // 구문중에 3개를 랜덤으로 잡고 다시 입력하도록 한다.
              let set = new Set([]);
              while (set.size < 3) {
                let rand = getRandomInt(0, 12);
                set.add(rand);
              }

              let list = [...wordList];
              set.forEach((v) => {
                list[v] = "";
              });

              printLog(list);
              printLog(set);
              setWordList(list);
              setConfirmIndexes(set);
            } else if (isValid) {
              let accounts = await createEtherAccount(mnemonicText);
              saveData("accounts", accounts);
              saveData("accountIdx", 0);
              navigate("/main");
              successToast(toast, "Account created");
            }
          }}
        >
          {hidePhase
            ? "Reveal Secret Recovery Phrase"
            : !isNext
            ? "Next"
            : "Confirm"}
        </Button>
      </Box>
    </Box>
  );
};
