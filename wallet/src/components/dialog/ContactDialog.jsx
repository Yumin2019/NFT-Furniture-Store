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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaClipboard, FaUserCircle, FaUserEdit } from "react-icons/fa";
import { IoIosMenu } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { EditContactDialog } from "./EditContactDialog";
import { BasicDialog } from "./BasicDialog";
import {
  copyTextOnClipboard,
  dialogMaxWidth,
  errorToast,
  infoToast,
  printLog,
  removeElement,
  saveData,
  validateEtherAddress,
} from "../../utils/Helper";

export const ContactDialog = ({ onClose, isOpen, contacts, loadContacts }) => {
  const btnRef = useRef(null);
  const toast = useToast();
  const [hoverIdx, setHoverIdx] = useState(-1);
  const [newAccountIdx, setNewAccountIdx] = useState(0);

  useEffect(() => {
    let list = contacts || [];
    setNewAccountIdx(list.length);
  }, []);

  const [dialogInfo, setContactInfo] = useState({
    name: "",
    address: "",
    title: "",
    yesText: "",
    text: "",
    idx: -1,
  });

  const {
    isOpen: isContactOpen,
    onOpen: onContactOpen,
    onClose: onContactClose,
  } = useDisclosure();

  const {
    isOpen: isBasicOpen,
    onOpen: onBasicOpen,
    onClose: onBasicClose,
  } = useDisclosure();

  return (
    <Modal
      onClose={onClose}
      finalFocusRef={btnRef}
      isOpen={isOpen}
      scrollBehavior="inside"
    >
      <EditContactDialog
        isOpen={isContactOpen}
        onClose={onContactClose}
        initialName={dialogInfo.name}
        initialAddress={dialogInfo.address}
        title={dialogInfo.title}
        yesText={dialogInfo.yesText}
        noText="Cancel"
        onClick={async (nameText, addressText) => {
          let name = nameText || "";
          let address = addressText || "";
          let idx = dialogInfo.idx;
          let saveContacts = [...contacts];

          if (name === "" || address === "") {
            errorToast(toast, "name or address is empty");
            return;
          } else if (!validateEtherAddress(address)) {
            errorToast(toast, "address is invalid");
            return;
          }

          if (dialogInfo.yesText === "Create") {
            let row = { name, address };
            saveContacts.push(row);
          } else if (dialogInfo.yesText === "Edit") {
            saveContacts[idx].name = name;
            saveContacts[idx].address = address;
          }

          printLog(name);
          printLog(address);
          printLog(idx);
          printLog(saveContacts);

          await saveData("contacts", saveContacts);
          loadContacts();
          onContactClose();
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
          let saveContacts = [...contacts];
          if (dialogInfo.yesText === "Delete") {
            saveContacts = removeElement(saveContacts, dialogInfo.idx + 1);
          }

          printLog(saveContacts);
          await saveData("contacts", saveContacts);
          loadContacts();
          onBasicClose();
        }}
      />

      <ModalOverlay />
      <ModalContent maxW={dialogMaxWidth} ml={4} mr={4} mt={6} mb={6}>
        <ModalHeader fontSize={16} mt={4} fontWeight="bold" align="center">
          Contact
        </ModalHeader>
        <ModalCloseButton size={32} mr={4} mt={4} />

        {contacts &&
          contacts.map((v, index) => {
            return (
              <Flex
                key={index}
                cursor="pointer"
                alignItems="center"
                pb={2}
                pt={2}
                background={hoverIdx === index ? "#f9faf9" : null}
                onMouseOver={() => setHoverIdx(index)}
                onMouseOut={() => setHoverIdx(-1)}
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
                    {v.address}
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

                <Menu>
                  <MenuButton>
                    <Box mb="4px" mr={4}>
                      <IoIosMenu size={20} color="black" />
                    </Box>
                  </MenuButton>
                  <MenuList padding={0}>
                    <MenuItem
                      padding={3}
                      onClick={(e) => {
                        copyTextOnClipboard(toast, v.address);
                      }}
                    >
                      <FaClipboard size={18} color="#3182ce" />
                      <Text ml={2} fontSize={14}>
                        Copy address
                      </Text>
                    </MenuItem>
                    <MenuItem
                      padding={3}
                      onClick={(e) => {
                        console.log(v.address);
                        setContactInfo({
                          name: v.name,
                          address: v.address,
                          title: "Edit contact",
                          yesText: "Edit",
                          idx: index,
                        });
                        onContactOpen();
                      }}
                    >
                      <FaUserEdit size={18} color="grey" />
                      <Text ml={2} fontSize={14}>
                        Edit contact
                      </Text>
                    </MenuItem>
                    <MenuItem
                      padding={3}
                      onClick={(e) => {
                        setContactInfo({
                          name: v.name,
                          address: v.address,
                          title: "Delete contact",
                          yesText: "Delete",
                          text: `Are you sure you want to delete this? (${v.name}, ${v.address})`,
                          idx: index,
                        });
                        onBasicOpen();
                      }}
                    >
                      <MdDeleteForever size={18} color="red" />
                      <Box ml={2}>
                        <Text fontSize={14}>Delete account</Text>
                      </Box>
                    </MenuItem>
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
          leftIcon={<FaPlus />}
          onClick={() => {
            setContactInfo({
              name: "",
              address: "",
              title: "Create contact",
              yesText: "Create",
              text: "",
              idx: newAccountIdx,
            });

            onContactOpen();
          }}
        >
          Add new contact
        </Button>
      </ModalContent>
    </Modal>
  );
};
