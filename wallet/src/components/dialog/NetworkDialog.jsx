import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Image,
  Box,
  Flex,
  Text,
  Spacer,
  Button,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { IoIosMenu } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { FaUserEdit, FaInfoCircle } from "react-icons/fa";
import { EditNetworkDialog } from "./EditNetworkDialog";
import { BasicDialog } from "./BasicDialog";
import { MdDeleteForever } from "react-icons/md";
import { dialogMaxWidth } from "../../utils/Helper";

export const NetworkDialog = ({
  onClose,
  isOpen,
  networks,
  setCurNetwork,
  curNetwork,
}) => {
  const btnRef = useRef(null);
  const [hoverIdx, setHoverIdx] = useState(-1);
  const [rowNetworks, setRowNetworks] = useState([]);

  useEffect(() => {
    let list = networks || [];
    let newNetworks = [...defNetworks, ...list];
    setRowNetworks(newNetworks);
    console.log(newNetworks);
  }, [isOpen]);

  const defNetworkCnt = 4;
  const defNetworks = [
    {
      name: "Ethereum Mainnet",
      src: "/image/eth_logo.png",
      rpcUrl:
        "https://eth-mainnet.g.alchemy.com/v2/yZVCAfqWyhjsvCfmmV_gpiypONY0MwYv",
      chainId: 1,
      currency: "ETH",
      explorerUrl: "https://etherscan.io",
    },
    {
      name: "Linea Mainnet",
      src: "/image/linea_logo.png",
      rpcUrl: "https://1rpc.io/linea",
      chainId: 59144,
      currency: "ETH",
      explorerUrl: "https://lineascan.build",
    },
    {
      name: "Polygon Mainnet",
      src: "/image/polygon_logo.png",
      rpcUrl:
        "https://polygon-mainnet.g.alchemy.com/v2/5uXiwGkwZjWmK4tLeBiLBsSvC4c5663w",
      chainId: 137,
      currency: "MATIC",
      explorerUrl: "https://polygonscan.com",
    },
    {
      name: "Polygon Mumbai",
      src: "",
      rpcUrl:
        "https://polygon-mumbai.g.alchemy.com/v2/K1bKo7VgILODfuOm3BD6D0GcZO42i7os",
      chainId: 80001,
      currency: "MATIC",
      explorerUrl: "https://mumbai.polygonscan.com",
    },
  ];

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isBasicOpen,
    onOpen: onBasicOpen,
    onClose: onBasicClose,
  } = useDisclosure();

  const [dialogInfo, setDialogInfo] = useState({
    name: "",
    url: "",
    title: "",
    yesText: "",
    text: "",
    networkInfo: {},
  });

  return (
    <Modal
      onClose={onClose}
      finalFocusRef={btnRef}
      isOpen={isOpen}
      scrollBehavior="inside"
    >
      <EditNetworkDialog
        isOpen={isEditOpen}
        onClose={onEditClose}
        networkInfo={dialogInfo.networkInfo}
        yesText={dialogInfo.yesText}
        noText="Cancel"
        isEditMode={dialogInfo.isEditMode}
      />

      <BasicDialog
        isOpen={isBasicOpen}
        onClose={onBasicClose}
        text={dialogInfo.text}
        title={dialogInfo.title}
        yesText={dialogInfo.yesText}
        noText="Cancel"
      />

      <ModalOverlay />
      <ModalContent maxW={dialogMaxWidth} ml={4} mr={4} mt={6} mb={6}>
        <ModalHeader fontSize={16} mt={4} fontWeight="bold" align="center">
          Select a network
        </ModalHeader>
        <ModalCloseButton size={32} mr={4} mt={4} />
        {rowNetworks.map((v, index) => {
          let isSelected = curNetwork?.name === v.name;
          let isEditable = index >= defNetworkCnt;
          return (
            <Flex
              key={index}
              cursor="pointer"
              alignItems="center"
              pb={2}
              pt={2}
              pr={4}
              background={
                isSelected ? "#eaf1fa" : hoverIdx === index ? "#f9faf9" : null
              }
              onMouseOver={() => setHoverIdx(index)}
              onMouseOut={() => setHoverIdx(-1)}
              onClick={() => {
                setCurNetwork(rowNetworks[index]);
                onClose();
              }}
            >
              <Box
                background="#0376c9"
                w="4px"
                h="45px"
                ml={1}
                borderRadius={4}
                visibility={isSelected ? "visible" : "hidden"}
              />
              {v.src.length !== 0 && (
                <Image boxSize={8} src={v.src} borderRadius="full" ml={4} />
              )}

              {v.src.length === 0 && (
                <Box
                  ml={4}
                  backgroundColor="#f2f4f6"
                  width={8}
                  height={8}
                  borderRadius={24}
                >
                  <Text position="relative" top="5px" left="10px" fontSize={14}>
                    {v.name.charAt(0)}
                  </Text>
                </Box>
              )}
              <Text ml={4} fontSize={16}>
                {v.name}
              </Text>
              <Spacer />
              <Menu>
                <MenuButton
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Box mb="4px">
                    <IoIosMenu size={20} color="black" />
                  </Box>
                </MenuButton>
                <MenuList padding={0}>
                  <MenuItem
                    padding={3}
                    onClick={(e) => {
                      setDialogInfo({
                        yesText: "OK",
                        networkInfo: v,
                        isEditMode: false,
                      });
                      onEditOpen();
                      e.stopPropagation();
                    }}
                  >
                    <FaInfoCircle size={18} color="#3082ce" />

                    <Text ml={2} fontSize={14}>
                      Show Information
                    </Text>
                  </MenuItem>
                  <Box opacity={!isEditable ? 0.5 : 1.0}>
                    <MenuItem
                      padding={3}
                      onClick={(e) => {
                        if (!isEditable) return;
                        setDialogInfo({
                          yesText: "Edit",
                          networkInfo: v,
                          isEditMode: true,
                        });
                        onEditOpen();
                        e.stopPropagation();
                      }}
                    >
                      <FaUserEdit size={18} color="grey" />
                      <Text ml={2} fontSize={14}>
                        Edit network
                      </Text>
                    </MenuItem>
                    <MenuItem
                      padding={3}
                      onClick={(e) => {
                        if (!isEditable) return;
                        setDialogInfo({
                          title: "Delete network",
                          yesText: "Delete",
                          text: `Are you sure you want to delete ${v.name}?`,
                        });
                        onBasicOpen();
                        e.stopPropagation();
                      }}
                    >
                      <MdDeleteForever size={18} color="red" />
                      <Box ml={2}>
                        <Text fontSize={14}>Delete network</Text>
                      </Box>
                    </MenuItem>
                  </Box>
                </MenuList>
              </Menu>
            </Flex>
          );
        })}

        <Button
          ml={4}
          mr={4}
          mt={8}
          colorScheme="blue"
          variant="outline"
          size="md"
          borderRadius={32}
          mb={4}
          onClick={() => {
            setDialogInfo({
              yesText: "Create",
              networkInfo: {
                name: "",
                src: "",
                rpcUrl: "",
                chainId: "",
                currency: "",
                explorerUrl: "",
              },
              isEditMode: true,
            });
            onEditOpen();
          }}
        >
          Add network
        </Button>
      </ModalContent>
    </Modal>
  );
};
