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
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
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
import { AccountDialog } from "../components/dialog/AccountDialog";
import { errorToast, infoToast } from "../utils/Helper";
import { RiShareBoxFill } from "react-icons/ri";
import { TbReportSearch } from "react-icons/tb";

export const MainPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [isAccountHover, setIsAccountHover] = useState(false);
  const [isMenuHover, setIsMenuHover] = useState(false);
  const toast = useToast();

  const handleCopyClipBoard = async (text) => {
    try {
      await navigator.clipboard.writeText("test");
      infoToast(toast, "Copied");
    } catch (e) {
      errorToast(toast, "Failed to copy");
    }
  };

  const clickNetwork = () => {
    console.log("tab");
    onNetworkOpen();
  };

  const clickAccount = () => {
    onAccountOpen();
  };

  const {
    isOpen: isNetworkOpen,
    onOpen: onNetworkOpen,
    onClose: onNetworkClose,
  } = useDisclosure();

  const {
    isOpen: isAccountOpen,
    onOpen: onAccountOpen,
    onClose: onAccountClose,
  } = useDisclosure();

  return (
    <Box textAlign="center">
      <AccountDialog
        isOpen={isAccountOpen}
        onOpen={onAccountOpen}
        onClose={onAccountClose}
      />

      <NetworkDialog
        isOpen={isNetworkOpen}
        onOpen={onNetworkOpen}
        onClose={onNetworkClose}
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
            <Stack
              direction="row"
              alignItems="center"
              cursor="pointer"
              onMouseOut={() => setIsAccountHover(false)}
              onMouseOver={() => setIsAccountHover(true)}
              backgroundColor={isAccountHover ? "#f9faf9" : null}
              borderRadius={10}
              onClick={clickAccount}
              pt={2}
              pb={2}
              pl={4}
              pr={4}
            >
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

          <Menu>
            <MenuButton px={4} py={2}>
              <Box
                cursor="pointer"
                onMouseOut={() => setIsMenuHover(false)}
                onMouseOver={() => setIsMenuHover(true)}
                backgroundColor={isMenuHover ? "#f9faf9" : null}
              >
                <IoIosMenu size={24} />
              </Box>
            </MenuButton>
            <MenuList padding={0}>
              <MenuItem padding={3}>
                <RiShareBoxFill size={18} />
                <Text ml={2} fontSize={14}>
                  View on explorer
                </Text>
              </MenuItem>
              <MenuItem padding={3}>
                <TbReportSearch size={20} />
                <Box ml={2}>
                  <Text fontSize={14}>Privacy policy</Text>
                  <Text fontSize={12}>mumbai.polygonscan.com</Text>
                </Box>
              </MenuItem>
            </MenuList>
          </Menu>
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
          onClick={handleCopyClipBoard}
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
