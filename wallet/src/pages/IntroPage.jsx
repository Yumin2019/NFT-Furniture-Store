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
import * as bip39 from "bip39";
import HDWalletProvider from "@truffle/hdwallet-provider";
import { Web3 } from "web3";
import { hdkey } from "ethereumjs-wallet";

const mnemonic = bip39.generateMnemonic();
console.log("isValid: ", bip39.validateMnemonic(mnemonic));
console.log(mnemonic);

export const IntroPage = () => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  const clickCreate = () => {
    navigate("/createWallet");
  };

  const clickImport = () => {
    navigate("/importWallet");
  };

  const createAccount = async () => {
    const seed = await bip39.mnemonicToSeed(
      "large taxi system hamster undo off field bamboo ramp excuse enrich panda"
    ); // seed === entropy
    const rootKey = hdkey.fromMasterSeed(seed);
    const hardenedKey = rootKey.derivePath("m/44'/60'/0'/0");

    let accounts = [];
    for (let i = 0; i < 1; i++) {
      const wallet = hardenedKey.deriveChild(i).getWallet();
      let address = "0x" + wallet.getAddress().toString("hex");
      let privateKey = wallet.getPrivateKey().toString("hex");
      accounts.push({ address: address, privateKey: privateKey });
    }

    console.log(accounts);
    return accounts;
  };

  useEffect(() => {
    createAccount();
    let provider = new HDWalletProvider({
      mnemonic: {
        phrase:
          "large taxi system hamster undo off field bamboo ramp excuse enrich panda",
        // password: 'test',
      },
      providerOrUrl:
        "https://polygon-mumbai.g.alchemy.com/v2/K1bKo7VgILODfuOm3BD6D0GcZO42i7os",
      // "https://eth-mainnet.g.alchemy.com/v2/yZVCAfqWyhjsvCfmmV_gpiypONY0MwYv",
      // providerOrUrl: "http://localhost:8545",
      numberOfAddresses: 1,
      derivationPath: "m/44'/60'/0'/0/", // bip44, ethereum, account, change, index
    });
    // // Or, if web3 is alreay initialized, you can call the 'setProvider' on web3, web3.eth, web3.shh and/or web3.bzz

    const web3 = new Web3(provider);
    const wallets = provider.getAddresses();
    console.log(wallets);
    // web3.eth.accounts.privateKeyToAccount([0])
    web3.eth.getAccounts().then(console.log);
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
