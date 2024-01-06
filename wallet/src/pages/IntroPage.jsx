import {
  Box,
  Center,
  Text,
  Button,
  Image,
  Checkbox,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HDWalletProvider from "@truffle/hdwallet-provider";
import { Web3 } from "web3";
import {
  isExtension,
  printLog,
  removeData,
  sendWorkerEvent,
  showTab as showTabOr,
} from "../utils/Helper";
import { useAtom } from "jotai";
import { tabAtom } from "..";

export const IntroPage = () => {
  const [isTabAtom, setIsTabAtom] = useAtom(tabAtom);
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  const clickCreate = () => {
    showTabOr("createWallet", () => {
      navigate("/createWallet");
      setIsTabAtom(true);
    });
  };

  const clickImport = () => {
    showTabOr("importWallet", () => {
      navigate("/importWallet");
      setIsTabAtom(true);
    });
  };

  useEffect(() => {
    if (isExtension()) {
      printLog(`${window.location.hash} hash on react`);
      if (window.location.hash === "#createWallet") {
        setIsTabAtom(true);
        navigate("/createWallet");
      } else if (window.location.hash === "#importWallet") {
        setIsTabAtom(true);
        navigate("/importWallet");
      }
    }

    // let provider = new HDWalletProvider({
    //   mnemonic: {
    //     phrase:
    //       "large taxi system hamster undo off field bamboo ramp excuse enrich panda",
    //     // password: 'test',
    //   },
    //   providerOrUrl:
    //   "https://eth-mainnet.g.alchemy.com/v2/yZVCAfqWyhjsvCfmmV_gpiypONY0MwYv",
    //   numberOfAddresses: 1,
    //   derivationPath: "m/44'/60'/0'/0/", // bip44, ethereum, account, change, index
    // });
    // // // Or, if web3 is alreay initialized, you can call the 'setProvider' on web3, web3.eth, web3.shh and/or web3.bzz

    // const web3 = new Web3(provider);
    // const wallets = provider.getAddresses();
    // console.log(wallets);
    // // web3.eth.accounts.privateKeyToAccount([0])
    // web3.eth.getAccounts().then(console.log);
  }, []);

  return (
    <Center>
      <Box textAlign="center" ml={2} mr={2}>
        <Text fontSize={40} mt={16} color="grey" fontWeight="400">
          Furniture Wallet
        </Text>
        <Text fontSize={16} mb={4} color="grey">
          Use your Furniture Wallet to login to decentralized apps - no signup
          needed.
        </Text>
        <Center
          margin={8}
          onClick={() => {
            navigate("/main"); // 개발용
          }}
        >
          <Image width={128} src="/image/icon-128.png" />
        </Center>

        <Checkbox
          isChecked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        >
          <Flex>
            <Text fontSize={14}>I agree to Furniture Wallet's</Text>
            <Button colorScheme="blue" variant="link" fontSize={14} ml={1}>
              Terms of use
            </Button>
          </Flex>
        </Checkbox>

        <Box opacity={isChecked ? 1.0 : 0.4}>
          <Button
            mt={6}
            colorScheme="blue"
            size="md"
            w="80%"
            borderRadius={32}
            mb={4}
            onClick={isChecked ? clickCreate : null}
          >
            Create a new wallet
          </Button>

          <Button
            mt={2}
            variant="outline"
            colorScheme="blue"
            w="80%"
            size="md"
            borderRadius={32}
            mb={4}
            onClick={isChecked ? clickImport : null}
          >
            Import an existing wallet
          </Button>
        </Box>
      </Box>
    </Center>
  );
};
