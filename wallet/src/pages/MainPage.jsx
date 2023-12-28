import {
  Box,
  Button,
  Text,
  IconButton,
  Stack,
  Center,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Tabs,
  Tooltip,
  Spacer,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaClipboard, FaBookmark } from "react-icons/fa";
import {
  IoIosSend,
  IoIosContacts,
  IoMdLogOut,
  IoIosArrowDown,
  IoIosMenu,
} from "react-icons/io";
import { useState } from "react";
import { ActivityTab } from "../components/tabs/ActivityTab";
import { TokensTab } from "../components/tabs/TokensTab";
import { FaUserCircle } from "react-icons/fa";
import { NetworkDialog } from "../components/dialog/NetworkDialog";

export const MainPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const clickNetwork = () => {
    console.log("tab");
    onNetOpen();
  };

  const {
    isOpen: isNetOpen,
    onOpen: onNetOpen,
    onClose: onNetClose,
  } = useDisclosure();

  return (
    <Box textAlign="center">
      <NetworkDialog
        isOpen={isNetOpen}
        onOpen={onNetOpen}
        onClose={onNetClose}
      />

      <Flex alignItems="center" pt={2} pb={2} shadow="lg">
        <Tooltip label="Mumbai Testnet" placement="right" fontSize={12}>
          <Stack
            onClick={clickNetwork}
            cursor="pointer"
            direction="row"
            alignItems="center"
            backgroundColor="#f2f4f6"
            borderRadius={24}
            w="55px"
            ml={2}
            pl={3}
            pr={3}
            pt={1.5}
            pb={1.5}
          >
            <Text fontSize={12}>M</Text>
            <IoIosArrowDown size={14} />
          </Stack>
        </Tooltip>

        <Box flex={1}>
          <Center>
            <Stack direction="row" alignItems="center">
              <FaUserCircle size={24} color="#3082ce" />
              <Text textAlign="center" fontWeight="700" fontSize={14} mb={1}>
                Account 1
              </Text>
              <IoIosArrowDown size={14} />
            </Stack>
          </Center>
        </Box>

        <Stack direction="row" mr={2} w="55px">
          <Spacer />
          <IoIosMenu size={24} />
        </Stack>
      </Flex>

      <Tooltip hasArrow label="Copy to clipboard" fontSize={12}>
        <Button
          mt={8}
          colorScheme="blue"
          variant="outline"
          size="sm"
          borderRadius={25}
          rightIcon={<FaClipboard />}
        >
          0x8aDd5..16bda
        </Button>
      </Tooltip>
      <Text fontSize={32} mt={4}>
        0.1807 MATIC
      </Text>
      <Text fontSize={16}>$0.19 USD</Text>
      <Center mt={6}>
        <Stack direction="row">
          <Box width="70px">
            <IconButton
              isRound={true}
              colorScheme="blue"
              fontSize={24}
              icon={<IoIosSend />}
            />

            <Text fontSize={14} mt={1}>
              Send
            </Text>
          </Box>

          <Box width="70px">
            <IconButton
              isRound={true}
              colorScheme="blue"
              fontSize={28}
              icon={<IoIosContacts />}
            />

            <Text fontSize={14} mt={1}>
              Contact
            </Text>
          </Box>

          <Box width="70px">
            <IconButton
              isRound={true}
              colorScheme="blue"
              fontSize={20}
              icon={<FaBookmark />}
            />

            <Text fontSize={14} mt={1}>
              Bookmark
            </Text>
          </Box>

          <Link to={"/login"}>
            <Box width="70px">
              <IconButton
                isRound={true}
                colorScheme="blue"
                fontSize={28}
                icon={<IoMdLogOut />}
              />
              <Text fontSize={14} mt={1}>
                Logout
              </Text>
            </Box>
          </Link>
        </Stack>
      </Center>
      <Tabs
        isFitted
        mt={4}
        colorScheme="blue"
        size="md"
        onChange={(index) => {
          setTabIndex(index);
        }}
        index={tabIndex}
      >
        <TabList mb={2}>
          <Tab>Tokens</Tab>
          <Tab>Activity</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TokensTab />
          </TabPanel>
          <TabPanel>
            <ActivityTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
