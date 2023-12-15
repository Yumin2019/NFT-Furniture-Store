import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Divider,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Image,
  Stack,
  Spacer,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { MdCancel } from "react-icons/md";
import { nftDialogTextAtom } from "../tabs/item/NftItem";

export const NftDetailDialog = ({
  transferInfoList,
  blockInfo,
  dbInfo,
  isOpen,
  onClose,
  onBasicOpen,
  onSellOpen,
}) => {
  const [dialogTextAtom, setDialogTextAtom] = useAtom(nftDialogTextAtom);
  let isMyNft = "kym" === blockInfo.author;
  let isSelling = blockInfo.isSelling;
  return (
    <>
      <Modal onClose={onClose} size="lg" isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{dbInfo.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* NFT 이미지 */}
            <Box pl={4} pr={4} pb={4}>
              <Image
                boxSize="100%"
                border="0.5px solid grey"
                src={dbInfo.image}
              />
            </Box>

            <Text color="grey" fontSize={18}>
              {dbInfo.text}
            </Text>
            <Text fontSize={18} mt={2} color="teal.400">
              author: {blockInfo.author}
            </Text>
            <Text fontSize={18} color="teal.400">
              type: {dbInfo.couponType}
            </Text>

            <Divider mt={2} mb={2} />

            {/* 가격 정보 및 버튼  */}
            <Stack direction="row" alignItems="center">
              {isSelling && (
                <Text textColor="teal.400" fontSize={24}>
                  {blockInfo.price.toFixed(1)} MATIC
                </Text>
              )}

              <Spacer />
              {isMyNft && (
                <Button
                  colorScheme="teal"
                  variant="outline"
                  mt={2}
                  size="sm"
                  rightIcon={
                    !blockInfo.isSelling ? <FaMoneyBill /> : <MdCancel />
                  }
                  onClick={(e) => {
                    setDialogTextAtom({
                      nftDialogTitle: !isSelling ? "NFT Sell" : "Cancel Sales",
                      nftDialogText: !isSelling
                        ? "Are you sure you want to sell this NFT? (MATIC)"
                        : "Are you sure you want to cancel this sale?",
                      nftDialogYesText: !isSelling ? "Sell" : "Cancel Sales",
                    });
                    !isSelling ? onSellOpen() : onBasicOpen();
                    e.stopPropagation();
                  }}
                >
                  {!isSelling ? "NFT Sell" : "Cancel Sales"}
                </Button>
              )}

              {!isMyNft && isSelling && (
                <Button
                  colorScheme="teal"
                  mt={2}
                  size="sm"
                  rightIcon={<FaMoneyBill />}
                  onClick={(e) => {
                    setDialogTextAtom({
                      nftDialogTitle: "Buy NFT",
                      nftDialogText: `Are you sure you want to buy this NFT? (${price} MATIC)`,
                      nftDialogYesText: "Buy",
                    });
                    onBasicOpen();
                    e.stopPropagation();
                  }}
                >
                  Buy
                </Button>
              )}
            </Stack>

            {/* NFT 소유자 변경 이력 */}
            <Accordion allowMultiple mt={4}>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Transaction Details
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <TableContainer>
                    <Table size="sm">
                      <Thead>
                        <Tr>
                          <Th>From</Th>
                          <Th>To</Th>
                          <Th isNumeric>Price(MATIC)</Th>
                          <Th>Date</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {transferInfoList.map((v, index) => {
                          return (
                            <Tr key={index}>
                              <Td>{v.from}</Td>
                              <Td>{v.to}</Td>
                              <Td isNumeric>{v.price}</Td>
                              <Td>{v.date}</Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
