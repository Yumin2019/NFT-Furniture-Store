import {
  Button,
  Stack,
  Divider,
  Input,
  Box,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { CommentItem, clickComment, editText } from "./item/CommentItem";
import { BasicDialog } from "../dialog/BasicDialog";
import { InputDialog } from "../dialog/InputDialog";
import { useAtom } from "jotai";
import { loginAtom } from "../../pages/MainPage";
import { errorToast, getQueryParam, successToast } from "../../utils/Helper";
import { api } from "../../utils/Axios";
import { useState } from "react";

export const GuestBookTab = ({ comments, onRefresh }) => {
  const toast = useToast();
  const [loginInfo] = useAtom(loginAtom);
  const {
    isOpen: isDelOpen,
    onOpen: onDelOpen,
    onClose: onDelClose,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const [commentText, setCommentText] = useState("");

  const clickDelete = async () => {
    try {
      let res = await api.post("deleteComment", { commentId: clickComment });
      if (res.status === 200) {
        successToast(toast, "Comment deleted");
        onRefresh();
        onDelClose();
      } else {
        errorToast(toast, "Failed to delete comment");
      }
    } catch (e) {
      errorToast(toast, "Failed to delete comment");
      console.log(e);
    }
  };

  const clickEdit = async (text) => {
    try {
      let res = await api.post("editComment", {
        text: text,
        commentId: clickComment,
      });
      if (res.status === 200) {
        successToast(toast, "Comment edited");
        onRefresh();
        onEditClose();
      } else {
        errorToast(toast, "Failed to edit comment");
      }
    } catch (e) {
      errorToast(toast, "Failed to edit comment");
      console.log(e);
    }
  };

  const clickWrite = async () => {
    if (commentText.length === 0) return;
    try {
      let res = await api.post("writeComment", {
        text: commentText,
        targetId: getQueryParam(),
      });
      if (res.status === 200) {
        successToast(toast, "Comment creatd");
        onRefresh();
        setCommentText("");
      } else {
        errorToast(toast, "Failed to create comment");
      }
    } catch (e) {
      errorToast(toast, "Failed to create comment");
      console.log(e);
    }
  };

  return (
    <>
      <BasicDialog
        isOpen={isDelOpen}
        onClose={onDelClose}
        onClick={clickDelete}
        title="Delete this Comment?"
        text="Are you sure you want to delete your comment? This comment will be deleted."
        yesText="Delete"
        noText="Cancel"
      />
      <InputDialog
        isOpen={isEditOpen}
        onClose={onEditClose}
        initialText={editText}
        onClick={clickEdit}
        title="Edit Comment"
        inputPlaceholder="write a comment"
        yesText="Edit"
        noText="Cancel"
      />

      {loginInfo?.id && (
        <Stack direction="row" alignItems="center" mb={6}>
          <Input
            value={commentText}
            onChange={(e) => {
              setCommentText(e.target.value);
            }}
            placeholder="write a comment"
            size="md"
            color="teal"
            _placeholder={{ color: "inherit" }}
            focusBorderColor="teal.500"
          />
          <Button
            colorScheme="teal"
            size="sm"
            height="38px"
            onClick={clickWrite}
          >
            Comment
          </Button>
        </Stack>
      )}

      <Divider mt={2} mb={2} />

      {comments &&
        comments.map((v, index) => {
          return (
            <Box key={index}>
              <CommentItem
                data={v}
                deletable={
                  v.userId === loginInfo.id ||
                  `${loginInfo.id}` === getQueryParam()
                }
                editable={v.userId === loginInfo.id}
                isDelOpen={isDelOpen}
                onDelOpen={onDelOpen}
                onDelClose={onDelClose}
                isEditOpen={isEditOpen}
                onEditOpen={onEditOpen}
                onEditClose={onEditClose}
              />
              <Divider mt={2} mb={2} />
            </Box>
          );
        })}
    </>
  );
};
