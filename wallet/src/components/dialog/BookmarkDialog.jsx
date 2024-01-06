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
import { FaBookmark } from "react-icons/fa";
import { IoIosMenu } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { EditContactDialog } from "./EditContactDialog";
import { BasicDialog } from "./BasicDialog";
import { BsPencilSquare } from "react-icons/bs";
import {
  dialogMaxWidth,
  errorToast,
  openInNewTab,
  printLog,
  saveData,
  validateUrl,
} from "../../utils/Helper";

export const BookmarkDialog = ({
  onClose,
  isOpen,
  bookmarks,
  loadBookmarks,
}) => {
  const btnRef = useRef(null);
  const toast = useToast();
  const [hoverIdx, setHoverIdx] = useState(-1);
  const [newBookmarkIdx, setNewBookmarkIdx] = useState(0);

  const [dialogInfo, setDialogInfo] = useState({
    name: "",
    url: "",
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

  useEffect(() => {}, [isOpen]);
  useEffect(() => {
    let list = bookmarks || [];
    setNewBookmarkIdx(list.length);
  }, []);

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
        initialAddress={dialogInfo.url}
        title={dialogInfo.title}
        yesText={dialogInfo.yesText}
        noText="Cancel"
        placeHolder2="URL"
        rowText2="URL"
        onClick={(nameText, urlText) => {
          let name = nameText || "";
          let url = urlText || "";
          let idx = dialogInfo.idx;
          let saveBookmarks = [...bookmarks];

          if (name === "" || url === "") {
            errorToast(toast, "name or url is empty");
            return;
          } else if (!validateUrl(url)) {
            errorToast(toast, "url is invalid");
            return;
          }

          if (dialogInfo.yesText === "Create") {
            let row = { name, url };
            saveBookmarks.push(row);
          } else if (dialogInfo.yesText === "Edit") {
            saveBookmarks[idx].name = name;
            saveBookmarks[idx].url = url;
          }

          printLog(name);
          printLog(url);
          printLog(idx);
          printLog(saveBookmarks);

          saveData("bookmarks", saveBookmarks);
          loadBookmarks();
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
        onClick={() => {
          let saveBookmarks = [...bookmarks];
          if (dialogInfo.yesText === "Delete") {
            for (let i = dialogInfo.idx + 1; i < saveBookmarks.length; ++i) {
              saveBookmarks[i - 1] = saveBookmarks[i];
            }
            saveBookmarks.pop();
          }

          printLog(saveBookmarks);
          saveData("bookmarks", saveBookmarks);
          loadBookmarks();
          onBasicClose();
        }}
      />

      <ModalOverlay />
      <ModalContent maxW={dialogMaxWidth} ml={4} mr={4} mt={6} mb={6}>
        <ModalHeader fontSize={16} mt={4} fontWeight="bold" align="center">
          Bookmark
        </ModalHeader>
        <ModalCloseButton size={32} mr={4} mt={4} />

        {bookmarks.map((v, index) => {
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
              <Box
                backgroundColor="#f2f4f6"
                width={8}
                height={8}
                borderRadius={24}
              >
                <Text position="relative" top="5px" left="10px" fontSize={14}>
                  {v.name.charAt(0)}
                </Text>
              </Box>
              <Box textAlign="left" ml={3} mt={1} mb={1}>
                <Text fontSize={14} textColor="#48494a" fontWeight="bold">
                  {v.name}
                </Text>
                <Text fontSize={12} textColor="#48494a">
                  {v.url}
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
                    onClick={() => {
                      openInNewTab(v.url);
                    }}
                  >
                    <FaBookmark size={18} color="#3082ce" />
                    <Text ml={2} fontSize={14}>
                      Open in new tab
                    </Text>
                  </MenuItem>
                  <MenuItem
                    padding={3}
                    onClick={() => {
                      setDialogInfo({
                        name: v.name,
                        url: v.url,
                        title: "Edit bookmark",
                        yesText: "Edit",
                        text: "",
                        idx: index,
                      });
                      onContactOpen();
                    }}
                  >
                    <BsPencilSquare size={18} color="grey" />
                    <Text ml={2} fontSize={14}>
                      Edit bookmark
                    </Text>
                  </MenuItem>
                  <MenuItem
                    padding={3}
                    onClick={() => {
                      setDialogInfo({
                        name: v.name,
                        url: v.url,
                        title: "Delete bookmark",
                        yesText: "Delete",
                        text: `Are you sure you want to delete this? (${v.name}, ${v.url})`,
                        idx: index,
                      });
                      onBasicOpen();
                    }}
                  >
                    <MdDeleteForever size={18} color="red" />
                    <Box ml={2}>
                      <Text fontSize={14}>Delete bookmark</Text>
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
            setDialogInfo({
              name: "",
              url: "",
              title: "Create bookmark",
              yesText: "Create",
              text: "",
              idx: newBookmarkIdx,
            });

            onContactOpen();
          }}
        >
          Add new bookmark
        </Button>
      </ModalContent>
    </Modal>
  );
};
