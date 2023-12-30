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
import { useState } from "react";
import { FaEye, FaClipboard } from "react-icons/fa";
import { errorToast, infoToast } from "../../utils/Helper";
import { IoCopy } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";

export const PhasePage = () => {
  const toast = useToast();
  const handleCopyClipBoard = async (text) => {
    try {
      await navigator.clipboard.writeText("test");
      infoToast(toast, "Copied");
    } catch (e) {
      errorToast(toast, "Failed to copy");
    }
  };

  const [hidePhase, setHidePhase] = useState(true);
  const [wordList, setWordList] = useState([
    "test11",
    "test12",
    "test13",
    "test14",

    "test21",
    "test22",
    "test23",
    "test24",

    "test31",
    "test32",
    "test33",
    "test34",
  ]);

  return (
    <Box>
      <Text fontSize={28} mt={4} fontWeight="bold">
        Write down your Secret Recovery Phrase
      </Text>

      <Text fontSize={16} mt={2}>
        Write down this 12-word Secret Recovery Phrase and save it in a place
        that you trust and only you can access.
      </Text>

      <Text fontSize={16} textAlign="left" fontWeight="bold" mt={4}>
        Tips:
      </Text>
      <UnorderedList textAlign="left">
        <ListItem>Save in a password manager</ListItem>
        <ListItem>Store in a safe deposit box</ListItem>
        <ListItem>Integer molestie lorem at massa</ListItem>
        <ListItem>Write down and store in multiple secret places</ListItem>
      </UnorderedList>

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
                    size="sm"
                    w={100}
                    borderRadius={10}
                    value={v}
                    readOnly
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

      {!hidePhase && (
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
            onClick={handleCopyClipBoard}
          >
            <Box mr={1}>
              <IoCopy />
            </Box>
            Copy to clipboard
          </Button>
        </Flex>
      )}

      <Button
        mt={8}
        colorScheme="blue"
        size="md"
        fontSize={13}
        w="80%"
        borderRadius={32}
        mb={4}
        onClick={() => {
          if (hidePhase) setHidePhase(!hidePhase);
        }}
      >
        {hidePhase ? "Reveal Secret Recovery Phrase" : "Next"}
      </Button>
    </Box>
  );
};
