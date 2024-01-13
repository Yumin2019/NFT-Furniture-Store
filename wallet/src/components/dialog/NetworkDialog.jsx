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
  useToast,
} from "@chakra-ui/react";
import { IoIosMenu } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { FaUserEdit, FaInfoCircle } from "react-icons/fa";
import { EditNetworkDialog } from "./EditNetworkDialog";
import { BasicDialog } from "./BasicDialog";
import { MdDeleteForever } from "react-icons/md";
import {
  dialogMaxWidth,
  errorToast,
  printLog,
  saveData,
  validateUrl,
} from "../../utils/Helper";
import { defNetworkCnt, defNetworks } from "../../utils/Network";

export const NetworkDialog = ({
  onClose,
  isOpen,
  networks,
  setNetworkIdx,
  setCurNetwork,
  curNetwork,
  loadNetworks,
}) => {
  const btnRef = useRef(null);
  const toast = useToast();
  const [hoverIdx, setHoverIdx] = useState(-1);
  const [rowNetworks, setRowNetworks] = useState([]);

  const convertNetwork = () => {
    let list = networks || [];
    let newNetworks = [...defNetworks, ...list];
    setRowNetworks(newNetworks);
    console.log(newNetworks);
  };

  useEffect(() => {
    convertNetwork();
  }, [isOpen, networks]);

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
    idx: -1,
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
        onClick={async (
          networkNameText,
          rpcUrlText,
          chainIdText,
          curSymbolText,
          explorerUrlText
        ) => {
          let name = networkNameText || "";
          let src = "";
          let rpcUrl = rpcUrlText || "";
          let chainId = parseInt(chainIdText) || -1;
          let currency = (curSymbolText || "").toUpperCase();
          let explorerUrl = explorerUrlText || "";
          let idx = dialogInfo.idx;

          if (
            name === "" ||
            rpcUrl === "" ||
            chainId === "" ||
            currency === "" ||
            explorerUrl === ""
          ) {
            errorToast(toast, "empty values");
            return;
          } else if (!validateUrl(rpcUrl)) {
            errorToast(toast, "RPC URL is invalid");
            return;
          } else if (chainId === -1) {
            errorToast(toast, "Invalid Chain ID");
            return;
          } else if (!validateUrl(explorerUrl)) {
            errorToast(toast, "Explorer URL is invalid");
            return;
          }

          let json = {
            name,
            src,
            rpcUrl,
            chainId,
            currency,
            explorerUrl,
          };

          let saveNetworks = [...networks];

          console.log(dialogInfo.yesText);
          if (dialogInfo.yesText === "Create") {
            saveNetworks.push(json);
          } else if (dialogInfo.yesText === "Edit") {
            saveNetworks[idx - defNetworkCnt] = json;
          }

          printLog(json);
          await saveData("networks", saveNetworks);
          loadNetworks();
          onEditClose();
        }}
      />

      <BasicDialog
        isOpen={isBasicOpen}
        onClose={onBasicClose}
        text={dialogInfo.text}
        title={dialogInfo.title}
        yesText={dialogInfo.yesText}
        noText="Cancel"
        onClick={async () => {
          let saveNetworks = [...networks];
          if (dialogInfo.yesText === "Delete") {
            for (
              let i = dialogInfo.idx + 1 - defNetworkCnt;
              i < saveNetworks.length;
              ++i
            ) {
              saveNetworks[i - 1] = saveNetworks[i];
            }
            saveNetworks.pop();
          }

          // 현재 네트워크를 설정하려고 하는 경우, 네트워크를 이더리움 메인넷으로 교체한다.
          if (
            curNetwork.name === rowNetworks[dialogInfo.idx].name &&
            curNetwork.chainId === rowNetworks[dialogInfo.idx].chainId
          ) {
            printLog("network to ethereum mainnet");
            await saveData("networkIdx", 0);
            setNetworkIdx(0);
          }

          printLog(saveNetworks);
          await saveData("networks", saveNetworks);
          loadNetworks();
          onBasicClose();
        }}
      />

      <ModalOverlay />
      <ModalContent maxW={dialogMaxWidth} ml={4} mr={4} mt={6} mb={6}>
        <ModalHeader fontSize={16} mt={4} fontWeight="bold" align="center">
          Select a network
        </ModalHeader>
        <ModalCloseButton size={32} mr={4} mt={4} />
        {rowNetworks &&
          rowNetworks.map((v, index) => {
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
                onClick={async () => {
                  setNetworkIdx(index);
                  setCurNetwork(rowNetworks[index]);
                  await saveData("networkIdx", index);
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
                {v.src?.length !== 0 && (
                  <Image boxSize={8} src={v.src} borderRadius="full" ml={4} />
                )}

                {v.src?.length === 0 && (
                  <Box
                    ml={4}
                    backgroundColor="#f2f4f6"
                    width={8}
                    height={8}
                    borderRadius={24}
                  >
                    <Text
                      position="relative"
                      top="5px"
                      left="10px"
                      fontSize={14}
                    >
                      {v?.name?.charAt(0)}
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
                          idx: index,
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
                            idx: index,
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
                            idx: index,
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
                idx: -1,
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
