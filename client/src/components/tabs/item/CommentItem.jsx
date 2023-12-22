import { Box, Flex, Image, Text, Stack, Button } from "@chakra-ui/react";
import { dateToString } from "../../../utils/Helper";
export let editText = "";
export let clickComment = -1;
export const CommentItem = ({
  data,
  deletable,
  editable,
  onDelOpen,
  onEditOpen,
}) => {
  return (
    <>
      <Flex width="100%">
        <Image
          boxSize="65px"
          border="0.5px solid grey"
          src={data?.image || "/image/account_icon.svg"}
        />
        <Stack direction="column" ml={4}>
          <Box display="flex" textAlign="center">
            <Text fontWeight="bold" fontSize={16} mr={3}>
              {data?.name}
            </Text>
            <Text color="grey" fontSize={13} mt="3px">
              {dateToString(data?.createdAt)}
              {data?.createdAt === data?.modifiedAt
                ? ""
                : `(modified:
              ${dateToString(data?.modifiedAt)})`}
            </Text>
            <Stack direction="row" position="absolute" right={4}>
              {editable && (
                <Button
                  colorScheme="teal"
                  size="xs"
                  onClick={() => {
                    editText = data?.text || "";
                    clickComment = data.id;
                    onEditOpen();
                  }}
                >
                  Edit
                </Button>
              )}
              {deletable && (
                <Button
                  colorScheme="teal"
                  size="xs"
                  onClick={() => {
                    clickComment = data.id;
                    onDelOpen();
                  }}
                >
                  Delete
                </Button>
              )}
            </Stack>
          </Box>
          <Text>{data?.text}</Text>
        </Stack>
      </Flex>
    </>
  );
};
