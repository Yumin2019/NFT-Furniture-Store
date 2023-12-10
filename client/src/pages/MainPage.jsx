import { NftCard } from "../components/NftCard";
import { Button, Grid, GridItem, position, Center } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  nav {
    float: right;
  }

  h1 {
    display: inline-block;
    vertical-align: middle;
    color: white;
    margin: 0.5rem;
    padding: 0;
    font-size: 1.5rem;
    font-weight: bold;
  }

  header {
    width: 100%;
    z-index: 5;
    position: fixed;
    top: 0px;
    background: #3082ce;
    padding: 20px;
  }
`;

export const MainPage = () => {
  return (
    <>
      <Wrapper>
        <header>
          <h1>Furniture NFT Store</h1>
          <nav style={{ margin: 10 }}>
            <Link to={"/login"}>
              <Button colorScheme="teal" size="sm" mr={4}>
                Login
              </Button>
            </Link>

            <Button colorScheme="teal" size="sm" mr={4}>
              My Info
            </Button>
            <Button colorScheme="teal" size="sm" mr={4}>
              Register
            </Button>
          </nav>
        </header>

        <Center paddingTop={100}>
          <Grid templateColumns="repeat(6, 1fr)" gap={6}>
            <NftCard w="100%" />
            <NftCard w="100%" />
            <NftCard w="100%" />
            <NftCard w="100%" />
            <NftCard w="100%" />
            <NftCard w="100%" />
          </Grid>
        </Center>
        <div style={{ margin: 16 }} />

        <Center>
          <Grid templateColumns="repeat(6, 1fr)" gap={6}>
            <NftCard w="100%" />
            <NftCard w="100%" />
            <NftCard w="100%" />
            <NftCard w="100%" />
            <NftCard w="100%" />
            <NftCard w="100%" />
          </Grid>
        </Center>
        <div style={{ margin: 16 }} />
        <Center>
          <Button colorScheme="teal" size="sm" mr={4}>
            «
          </Button>
          <Button colorScheme="teal" size="sm" mr={4}>
            1
          </Button>
          <Button colorScheme="teal" size="sm" mr={4}>
            2
          </Button>
          <Button colorScheme="teal" size="sm" mr={4}>
            3
          </Button>
          <Button colorScheme="teal" size="sm" mr={4}>
            »
          </Button>
        </Center>
      </Wrapper>
    </>
  );
};
