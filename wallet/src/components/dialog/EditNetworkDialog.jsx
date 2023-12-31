import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Button,
  Text,
  Input,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

export const EditNetworkDialog = ({
  onClose,
  isOpen,
  yesText,
  noText,
  onClick,
  networkInfo,
  isEditMode,
}) => {
  const btnRef = useRef(null);
  const [networkName, setNetworkName] = useState("");
  const [rpcUrl, setRpcUrl] = useState("");
  const [chainId, setChainId] = useState("");
  const [curSymbol, setCurSymbol] = useState("");
  const [explorerUrl, setExplorerUrl] = useState("");

  useEffect(() => {
    setNetworkName(networkInfo.name);
    setRpcUrl(networkInfo.rpcUrl);
    setChainId(networkInfo.chainId);
    setCurSymbol(networkInfo.currency);
    setExplorerUrl(networkInfo.explorerUrl);
  }, [isOpen]);

  return (
    <Modal
      onClose={onClose}
      finalFocusRef={btnRef}
      isOpen={isOpen}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent maxW="100%" ml={4} mr={4} mt={6} mb={6} pl={4} pr={4}>
        <ModalHeader fontSize={16} mt={4} fontWeight="bold" align="center">
          {!isEditMode
            ? "Network Information"
            : networkInfo.name
            ? "Edit Network"
            : "Create Network"}
        </ModalHeader>
        <ModalCloseButton size={32} mr={4} mt={4} />

        <Text fontSize={16} fontWeight="bold">
          Network name
        </Text>
        <Input
          mt={1}
          placeholder="Network name"
          value={networkName}
          readOnly={!isEditMode}
          onChange={(e) => setNetworkName(e.target.value)}
          size="md"
          _placeholder={{ color: "grey" }}
          focusBorderColor="blue.500"
        />

        <Text fontSize={16} fontWeight="bold" mt={4}>
          RPC URL
        </Text>
        <Input
          mt={1}
          placeholder="Network RPC URL"
          value={rpcUrl}
          readOnly={!isEditMode}
          onChange={(e) => setRpcUrl(e.target.value)}
          size="md"
          _placeholder={{ color: "grey" }}
          focusBorderColor="blue.500"
        />

        <Text fontSize={16} fontWeight="bold" mt={4}>
          Chain ID
        </Text>
        <Input
          mt={1}
          placeholder="Chain ID"
          value={chainId}
          readOnly={!isEditMode}
          onChange={(e) => setChainId(e.target.value)}
          size="md"
          _placeholder={{ color: "grey" }}
          focusBorderColor="blue.500"
        />

        <Text fontSize={16} fontWeight="bold" mt={4}>
          Currency symbol
        </Text>
        <Input
          mt={1}
          placeholder="currency symbol"
          value={curSymbol}
          readOnly={!isEditMode}
          onChange={(e) => setCurSymbol(e.target.value)}
          size="md"
          _placeholder={{ color: "grey" }}
          focusBorderColor="blue.500"
        />

        <Text fontSize={16} fontWeight="bold" mt={4}>
          Block explorer URL (Optional)
        </Text>
        <Input
          mt={1}
          placeholder="Block explorer URL"
          value={explorerUrl}
          readOnly={!isEditMode}
          onChange={(e) => setExplorerUrl(e.target.value)}
          size="md"
          _placeholder={{ color: "grey" }}
          focusBorderColor="blue.500"
        />

        <Flex mt={4} mb={4}>
          <Spacer />

          {isEditMode && (
            <Button colorScheme="blue" variant="outline" onClick={onClose}>
              {noText}
            </Button>
          )}

          <Button ml={4} colorScheme="blue" onClick={onClick}>
            {yesText}
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
};
