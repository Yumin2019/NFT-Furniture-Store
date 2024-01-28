import {
  Card,
  CardBody,
  Heading,
  Divider,
  Button,
  Image,
  Stack,
  Text,
  Flex,
  Spacer,
  Center,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { FaMoneyBill } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { nftDialogTextAtom } from "./tabs/item/NftItem";
import { loginAtom } from "../pages/MainPage";
import { web3 } from "../contracts/contract";

export const NftCard = ({
  info,
  token,
  owner,
  onBasicOpen,
  onSellOpen,
  onItemClick,
}) => {
  const [dialogTextAtom, setDialogTextAtom] = useAtom(nftDialogTextAtom);
  const [loginInfo] = useAtom(loginAtom);
  let isMyNft = loginInfo?.id === Number(token.userId);
  return (
    <>
      <Card width={250} maxW="sm" border="1px solid grey" onClick={onItemClick}>
        <CardBody>
          <Center>
            <Image
              src={
                info?.image
                  ? `/image/furniture/${info.image}.png`
                  : "/image/furniture_icon.svg"
              }
              width={150}
              borderRadius="lg"
            />
          </Center>

          <Stack mt="6">
            <Heading fontSize={18}>
              {info?.name} #{Number(token?.tokenId)}
            </Heading>
            <Text fontSize={16} color="grey">
              {info?.desc}
            </Text>
            <Text fontSize={14} color="teal.400">
              owner: {owner}
            </Text>
            <Text fontSize={14} color="teal.400">
              type: furniture
            </Text>

            <Text textColor="teal.400" fontSize={20}>
              {web3.utils.fromWei(token?.price, "ether")} MATIC
            </Text>
          </Stack>
          <Divider marginTop={2} marginBottom={2} />
          <Flex>
            <Spacer />
            {loginInfo?.walletAddress && isMyNft && (
              <Button
                colorScheme="teal"
                mt={2}
                size="sm"
                rightIcon={<MdCancel />}
                onClick={(e) => {
                  setDialogTextAtom({
                    nftDialogTitle: "Cancel Sales",
                    nftDialogText: "Are you sure you want to cancel this sale?",
                    nftDialogYesText: "Cancel Sales",
                    info: info,
                    token: token,
                  });
                  onBasicOpen();
                  e.stopPropagation();
                }}
              >
                Cancel Sales
              </Button>
            )}

            {loginInfo?.walletAddress && !isMyNft && (
              <Button
                mt={2}
                colorScheme="teal"
                size="sm"
                rightIcon={<FaMoneyBill />}
                onClick={(e) => {
                  setDialogTextAtom({
                    nftDialogTitle: "Buy NFT",
                    nftDialogText: `Are you sure you want to buy this NFT? (${web3.utils.fromWei(
                      token?.price,
                      "ether"
                    )} MATIC)`,
                    nftDialogYesText: "Buy",
                    info: info,
                    token: token,
                  });
                  onBasicOpen();
                  e.stopPropagation();
                }}
              >
                Buy
              </Button>
            )}
          </Flex>
        </CardBody>
      </Card>
    </>
  );
};
