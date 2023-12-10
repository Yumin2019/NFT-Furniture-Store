import {
  Card,
  CardBody,
  Heading,
  Divider,
  Button,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";

export const NftCard = () => {
  return (
    <>
      <Card width={250} maxW="sm" border="1px solid grey">
        <CardBody>
          <Image
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            alt="Green double couch with wooden legs"
            borderRadius="lg"
          />
          <Stack mt="6" spacing="3">
            <Heading size="md">Living room Sofa</Heading>
            <Text>소파 아이템 1</Text>
            <Text color="blue.600" fontSize="16">
              0.01 MATIC
            </Text>
          </Stack>
          <Divider marginTop={2} marginBottom={2} />
          <Button marginTop={4} variant="solid" colorScheme="blue">
            Buy now
          </Button>
        </CardBody>
      </Card>
    </>
  );
};
