import { FurnitureCard } from "../components/FurnitureCard";
import { Button, Grid, Center, useDisclosure, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { RoomDialog } from "../components/dialog/RoomDialog";
const PageNumber = ({ number }) => {
  return (
    <Button
      colorScheme="teal"
      size="sm"
      fontSize={18}
      variant="ghost"
      fontWeight="bold"
    >
      {number}
    </Button>
  );
};

export const MainPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <RoomDialog isOpen={isOpen} onClose={onClose} />
      <Box
        w="100%"
        zIndex={100}
        position="fixed"
        top="0"
        backgroundColor="teal"
        height={75}
        pt={2.5}
        pl={8}
      >
        <header>
          <h1
            style={{
              color: "white",
              display: "inline-block",
              fontSize: 30,
              fontWeight: "bold",
            }}
          >
            Furniture NFT Store
          </h1>
          <div style={{ margin: 10, float: "right" }}>
            <Link to={"/login"}>
              <Button colorScheme="gray" size="sm" mr={4}>
                Login
              </Button>
            </Link>
            <Link to={"/userInfo"}>
              <Button colorScheme="gray" size="sm" mr={4}>
                My Info
              </Button>
            </Link>
            <Link to={"/register"}>
              <Button colorScheme="gray" size="sm" mr={4}>
                Register
              </Button>
            </Link>
            <Button colorScheme="gray" size="sm" mr={4} onClick={onOpen}>
              Furniture World
            </Button>
          </div>
        </header>
      </Box>

      <Center paddingTop={100}>
        <Grid templateColumns="repeat(6, 1fr)" gap={6}>
          <FurnitureCard w="100%" />
          <FurnitureCard w="100%" />
          <FurnitureCard w="100%" />
          <FurnitureCard w="100%" />
          <FurnitureCard w="100%" />
          <FurnitureCard w="100%" />
        </Grid>
      </Center>
      <div style={{ margin: 16 }} />
      <Center>
        <Grid templateColumns="repeat(6, 1fr)" gap={6}>
          <FurnitureCard w="100%" />
          <FurnitureCard w="100%" />
          <FurnitureCard w="100%" />
          <FurnitureCard w="100%" />
          <FurnitureCard w="100%" />
          <FurnitureCard w="100%" />
        </Grid>
      </Center>
      <div style={{ margin: 16 }} />
      <Center>
        <Button
          colorScheme="teal"
          size="sm"
          variant="ghost"
          fontSize={30}
          mr={1}
          pb={1}
        >
          «
        </Button>
        <PageNumber number={1} />
        <PageNumber number={2} />
        <PageNumber number={3} />
        <Button
          colorScheme="teal"
          size="sm"
          variant="ghost"
          fontSize={30}
          ml={1}
          pb={1}
        >
          »
        </Button>
      </Center>
    </>
  );
};
