import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Box,
  Flex,
  Text,
  Spacer,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaUserCircle, FaUserEdit } from "react-icons/fa";
import {
  dialogMaxWidth,
  printLog,
  saveData,
  truncate,
} from "../../utils/Helper";
import { EditAccountDialog } from "./EditAccountDialog";

export const AccountDialog = ({
  onClose,
  isOpen,
  accounts,
  curIdx,
  loadAccount,
  setCurIdx,
  setAccount,
}) => {
  const btnRef = useRef(null);
  const [hoverIdx, setHoverIdx] = useState(-1);
  const [curAccountIdx, setCurAccountIdx] = useState(0);
  const [newAccountIdx, setNewAccountIdx] = useState(0);
  const [rowAccounts, setRowAccounts] = useState([]);

  const convertAccount = () => {
    let list = [];
    let idx = curIdx || 0;
    let newAccountIdx = -1;
    accounts?.map((v, index) => {
      if (v.isVisible) {
        list.push({
          name: v.name,
          address: v.address,
          matic: "0 MATIC",
          usd: "$0.00 USD",
          isSelected: idx === index,
        });
      } else if (newAccountIdx === -1) {
        newAccountIdx = index;
      }
    });

    setRowAccounts(list);
    setCurAccountIdx(idx);
    setNewAccountIdx(newAccountIdx);
    printLog("newAccountIdx", newAccountIdx);
  };

  useEffect(() => {
    convertAccount();
  }, [isOpen]);

  const {
    isOpen: isAccountOpen,
    onOpen: onAccountOpen,
    onClose: onAccountClose,
  } = useDisclosure();

  const [dialogInfo, setDialogInfo] = useState({
    title: "",
    yesText: "",
    placeHolder: "",
    idx: -1,
  });

  return (
    <Modal
      onClose={onClose}
      finalFocusRef={btnRef}
      isOpen={isOpen}
      scrollBehavior="inside"
    >
      <EditAccountDialog
        isOpen={isAccountOpen}
        onClose={onAccountClose}
        title={dialogInfo.title}
        yesText={dialogInfo.yesText}
        noText="Cancel"
        placeHolder1={dialogInfo.placeHolder}
        onClick={async (text) => {
          let saveAccounts = [...accounts];
          let name = text || dialogInfo.placeHolder;
          let idx = dialogInfo.idx;
          saveAccounts[idx].isVisible = true;
          saveAccounts[idx].name = name;

          printLog(saveAccounts);
          printLog(idx);
          printLog(name);

          await saveData("accounts", saveAccounts);
          onAccountClose();
          loadAccount();
          convertAccount();
        }}
      />

      <ModalOverlay />
      <ModalContent maxW={dialogMaxWidth} ml={4} mr={4} mt={6} mb={6}>
        <ModalHeader fontSize={16} mt={4} fontWeight="bold" align="center">
          Select an account
        </ModalHeader>
        <ModalCloseButton size={32} mr={4} mt={4} />

        {rowAccounts.map((v, index) => {
          return (
            <Flex
              key={index}
              cursor="pointer"
              alignItems="center"
              pb={2}
              pt={2}
              background={
                v.isSelected ? "#eaf1fa" : hoverIdx === index ? "#f9faf9" : null
              }
              borderBottomLeftRadius={index === 9 ? 10 : 0}
              borderBottomRightRadius={index === 9 ? 10 : 0}
              onMouseOver={() => setHoverIdx(index)}
              onMouseOut={() => setHoverIdx(-1)}
              onClick={() => {
                setCurIdx(index);
                setAccount(accounts[index]);
                onClose();
              }}
            >
              <Box
                background="#0376c9"
                w="4px"
                h="45px"
                ml={1}
                mr={2}
                borderRadius={4}
                visibility={v.isSelected ? "visible" : "hidden"}
              />
              <FaUserCircle size={28} color="#3082ce" />
              <Box textAlign="left" ml={3} mt={1} mb={1}>
                <Text fontSize={14} textColor="#48494a" fontWeight="bold">
                  {v.name}
                </Text>
                <Text fontSize={12} textColor="#48494a">
                  {truncate(v.address, 10)}
                </Text>
              </Box>

              <Spacer />

              <Box textAlign="right" mr={2}>
                <Text fontSize={14} textColor="#48494a">
                  {v.matic}
                </Text>
                <Text fontSize={12} textColor="#48494a">
                  {v.usd}
                </Text>
              </Box>
              <Box mb="18px" mr={4}>
                <FaUserEdit
                  size={18}
                  color="grey"
                  onClick={(e) => {
                    setDialogInfo({
                      title: "Edit account",
                      yesText: "Edit",
                      placeHolder: v.name,
                      idx: index,
                    });
                    onAccountOpen();
                    e.stopPropagation();
                  }}
                />
              </Box>
            </Flex>
          );
        })}

        {newAccountIdx !== -1 && (
          <Button
            ml={4}
            mr={4}
            mt={8}
            colorScheme="blue"
            variant="outline"
            size="md"
            borderRadius={32}
            mb={4}
            leftIcon={<FaPlus />}
            onClick={(e) => {
              setDialogInfo({
                title: "Add account",
                yesText: "Add",
                placeHolder: `Account ${newAccountIdx + 1}`,
                idx: newAccountIdx,
              });
              onAccountOpen();
            }}
          >
            Add new account
          </Button>
        )}
      </ModalContent>
    </Modal>
  );
};
