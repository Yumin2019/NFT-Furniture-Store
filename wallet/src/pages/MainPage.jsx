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
  Image,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { FaClipboard, FaBookmark } from "react-icons/fa";
import {
  IoIosSend,
  IoIosContacts,
  IoMdLogOut,
  IoIosArrowDown,
  IoIosMenu,
} from "react-icons/io";
import { useEffect, useState } from "react";
import { ActivityTab } from "../components/tabs/ActivityTab";
import { TokensTab } from "../components/tabs/TokensTab";
import { FaUserCircle } from "react-icons/fa";
import { NetworkDialog } from "../components/dialog/NetworkDialog";
import { AccountDialog } from "../components/dialog/AccountDialog";
import { Web3 } from "web3";
import {
  copyTextOnClipboard,
  errorToast,
  excludeHttp,
  infoToast,
  loadData,
  openInNewTab,
  printLog,
  removeData,
  saveData,
  truncate,
  validateUrl,
} from "../utils/Helper";
import { RiShareBoxFill } from "react-icons/ri";
import { TbReportSearch } from "react-icons/tb";
import { ContactDialog } from "../components/dialog/ContactDialog";
import { BookmarkDialog } from "../components/dialog/BookmarkDialog";
import { SendToDialog } from "../components/dialog/SendToDialog";
import { defNetworkCnt, defNetworks } from "../utils/Network";
import axios from "axios";

export const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://eth-mainnet.g.alchemy.com/v2/yZVCAfqWyhjsvCfmmV_gpiypONY0MwYv"
  )
);
export const MainPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [isAccountHover, setIsAccountHover] = useState(false);
  const [isMenuHover, setIsMenuHover] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const [balanceInfo, setBalanceInfo] = useState({ value: "0", usdValue: "0" });
  const [accountIdx, setAccountIdx] = useState(0);
  const [networkIdx, setNetworkIdx] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [networks, setNetworks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [curAccount, setCurAccount] = useState({});
  const [curNetwork, setCurNetwork] = useState({
    name: "",
    src: "",
    rpcUrl: "",
    chainId: 1,
    currency: "",
    explorerUrl: "",
  });

  const loadAccounts = async () => {
    let idx = (await loadData("accountIdx")) || 0;
    let accountsData = (await loadData("accounts")) || [];
    setAccountIdx(idx);
    setAccounts(accountsData);
    setCurAccount(accountsData[idx]);

    printLog(`accountIdx = ${idx}`);
    printLog(accountsData);
    printLog(accountsData[idx]);

    // 트랜잭션 처리에 사용할 수 있도록 미리 계정을 추가한다. (signing)
    web3.eth.accounts.wallet.clear();
    accountsData.map((v) => {
      const signer = web3.eth.accounts.privateKeyToAccount(v.privateKey);
      web3.eth.accounts.wallet.add(signer);
    });
  };

  const loadContacts = async () => {
    let contactsData = (await loadData("contacts")) || [];
    setContacts(contactsData);
    printLog(contactsData);
  };

  const loadBookmarks = async () => {
    let bookmarkData = (await loadData("bookmarks")) || [];
    setBookmarks(bookmarkData);
    printLog(bookmarkData);
  };

  const loadNetworks = async () => {
    let idx = (await loadData("networkIdx")) || 0;
    let networkData = (await loadData("networks")) || [];

    if (idx < defNetworkCnt) {
      setCurNetwork(defNetworks[idx]);
      printLog(defNetworks[idx]);
    } else {
      setCurNetwork(networkData[idx - defNetworkCnt]);
      printLog(defNetworks[idx - defNetworkCnt]);
    }

    setNetworks(networkData);
    printLog(networkData);
  };

  const loadActivities = async () => {
    try {
      if (!curAccount || !curAccount.address) return;
      let activities = (await loadData(`activity_${curAccount.address}`)) || [];

      setActivities(activities);
      printLog(activities);
    } catch (e) {
      printLog(e);
    }
  };

  const getBalance = async () => {
    try {
      if (!curNetwork || !validateUrl(curNetwork.rpcUrl)) return;

      let rpcUrl = curNetwork.rpcUrl;
      let httpProvider = new Web3.providers.HttpProvider(rpcUrl);
      web3.setProvider(httpProvider);

      let address = curAccount.address;
      let balance = await web3.eth.getBalance(address);
      let currency = curNetwork.currency;
      console.log("network: ", curNetwork.name);
      console.log("address: ", address);
      console.log("balance", balance);

      let ether = Number(
        parseFloat(web3.utils.fromWei(balance, "ether")).toFixed(4)
      );

      // currency to usd
      let res = await axios.get(
        `https://min-api.cryptocompare.com/data/price?fsym=${currency}&tsyms=USD`
      );

      let usd = (ether * res.data.USD).toFixed(2);
      console.log(currency, ether);
      console.log("USD", usd);
      setBalanceInfo({ value: ether, usdValue: usd, usdRatio: res.data.USD });
    } catch (e) {
      printLog(e);
    }
  };

  useEffect(() => {
    getBalance();
    loadActivities();
  }, [curNetwork, curAccount]);

  useEffect(() => {
    loadAccounts();
    loadContacts();
    loadBookmarks();
    loadNetworks();
  }, []);

  const clickNetwork = () => {
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

  const {
    isOpen: isContactOpen,
    onOpen: onContactOpen,
    onClose: onContactClose,
  } = useDisclosure();

  const {
    isOpen: isSendOpen,
    onOpen: onSendOpen,
    onClose: onSendClose,
  } = useDisclosure();

  const {
    isOpen: isBookmarkOpen,
    onOpen: onBookmarkOpen,
    onClose: onBookmarkClose,
  } = useDisclosure();

  return (
    <Box textAlign="center">
      <AccountDialog
        isOpen={isAccountOpen}
        onClose={onAccountClose}
        accounts={accounts}
        curIdx={accountIdx}
        setCurIdx={setAccountIdx}
        setAccount={setCurAccount}
        loadAccount={() => {
          loadAccounts();
        }}
      />

      <NetworkDialog
        isOpen={isNetworkOpen}
        onClose={onNetworkClose}
        networks={networks}
        curNetwork={curNetwork}
        setCurNetwork={setCurNetwork}
        setNetworkIdx={setNetworkIdx}
        loadNetworks={() => {
          loadNetworks();
        }}
      />

      <ContactDialog
        isOpen={isContactOpen}
        onClose={onContactClose}
        contacts={contacts}
        loadContacts={() => {
          loadContacts();
        }}
      />

      <BookmarkDialog
        isOpen={isBookmarkOpen}
        onClose={onBookmarkClose}
        bookmarks={bookmarks}
        loadBookmarks={() => {
          loadBookmarks();
        }}
      />

      <SendToDialog
        isOpen={isSendOpen}
        onClose={onSendClose}
        accounts={accounts}
        contacts={contacts}
        curNetwork={curNetwork}
        curAccount={curAccount}
        balanceInfo={balanceInfo}
        activities={activities}
        loadActivities={loadActivities}
      />

      <Flex alignItems="center" pt={2} pb={2} shadow="lg">
        <Tooltip label={curNetwork?.name} placement="right" fontSize={12}>
          <Stack
            onClick={clickNetwork}
            cursor="pointer"
            direction="row"
            alignItems="center"
            backgroundColor="#f2f4f6"
            borderRadius={24}
            ml={2}
            pl={3}
            pr={3}
            pt={1.5}
            pb={1.5}
          >
            {curNetwork?.src?.length === 0 && (
              <Stack direction="row" alignItems="center">
                <Text fontSize={12}>{curNetwork?.name?.charAt(0)}</Text>
                <IoIosArrowDown size={14} />
              </Stack>
            )}

            {curNetwork?.src?.length !== 0 && (
              <Stack direction="row" alignItems="center">
                <Image w={4} src={curNetwork.src} borderRadius="full" />
                <IoIosArrowDown size={14} />
              </Stack>
            )}
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
                {curAccount && curAccount.name}
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
                <TbReportSearch size={20} />
                <Text ml={2} fontSize={14}>
                  Privacy policy
                </Text>
              </MenuItem>
              <MenuItem
                padding={3}
                onClick={() => {
                  openInNewTab(
                    `${curNetwork?.explorerUrl}/address/${curAccount.address}`
                  );
                }}
              >
                <RiShareBoxFill size={18} />

                <Box ml={2}>
                  <Text fontSize={14}>View on explorer</Text>
                  <Text fontSize={12}>
                    {excludeHttp(curNetwork?.explorerUrl)}
                  </Text>
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
          onClick={() => {
            copyTextOnClipboard(toast, curAccount?.address || "");
          }}
        >
          {curAccount?.address && truncate(curAccount.address, 10)}
        </Button>
      </Tooltip>
      <Text fontSize={32} mt={4}>
        {balanceInfo?.value} {curNetwork?.currency}
      </Text>
      <Text fontSize={16}>{`$${balanceInfo?.usdValue} USD`}</Text>
      <Center mt={6}>
        <Stack direction="row">
          <Box width="50px" ml="10px" mr="10px" onClick={onSendOpen}>
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

          <Box width="60px" ml="5px" mr="5px" onClick={onContactOpen}>
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

          <Box width="70px" onClick={onBookmarkOpen}>
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

          <Box
            width="50px"
            ml="10px"
            mr="10px"
            onClick={async () => {
              await saveData("loginTime", 0);
              navigate("/");
            }}
          >
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
            <TokensTab
              curNetwork={curNetwork}
              balanceInfo={balanceInfo}
              onRefresh={() => {
                getBalance();
                infoToast(toast, "Refreshed");
              }}
            />
          </TabPanel>
          <TabPanel>
            <ActivityTab
              curNetwork={curNetwork}
              activities={activities}
              balanceInfo={balanceInfo}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
