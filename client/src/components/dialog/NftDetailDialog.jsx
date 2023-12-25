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
import { loginAtom } from "../../pages/MainPage";
import { FaMoneyBill } from "react-icons/fa";
import { web3 } from "../../contracts/contract";

export const NftDetailDialog = ({
  token,
  info,
  owner,
  transferInfoList,
  isOpen,
  onClose,
  onBasicOpen,
  onSellOpen,
}) => {
  const [dialogTextAtom, setDialogTextAtom] = useAtom(nftDialogTextAtom);
  const [loginInfo] = useAtom(loginAtom);
  let isSelling = token?.isSelling || false;
  let isMyNft = loginInfo?.id === Number(token?.userId);

  return (
    <>
      <Modal onClose={onClose} size="lg" isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {info?.name} #{Number(token?.tokenId)}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* NFT 이미지 */}
            <Box pl={4} pr={4} pb={4}>
              <Image
                boxSize="100%"
                border="0.5px solid grey"
                src={info?.image || "/image/furniture_icon.svg"}
              />
            </Box>

            <Text color="grey" fontSize={18}>
              {info?.desc}
            </Text>
            <Text fontSize={18} mt={2} color="teal.400">
              owner: {owner}
            </Text>
            <Text fontSize={18} color="teal.400">
              type: furniture
            </Text>

            <Divider mt={2} mb={2} />

            {/* 가격 정보 및 버튼  */}
            <Stack direction="row" alignItems="center">
              {isSelling && (
                <Text textColor="teal.400" fontSize={20}>
                  {web3.utils.fromWei(token?.price, "ether")} MATIC
                </Text>
              )}

              <Spacer />
              {loginInfo?.id && isMyNft && (
                <Button
                  colorScheme="teal"
                  variant="outline"
                  mt={2}
                  size="sm"
                  rightIcon={!isSelling ? <FaMoneyBill /> : <MdCancel />}
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

              {loginInfo?.id && !isMyNft && isSelling && (
                <Button
                  colorScheme="teal"
                  mt={2}
                  size="sm"
                  rightIcon={<FaMoneyBill />}
                  onClick={(e) => {
                    setDialogTextAtom({
                      nftDialogTitle: "Buy NFT",
                      nftDialogText: `Are you sure you want to buy this NFT? (${token?.price} MATIC)`,
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
            <Button colorScheme="teal" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
