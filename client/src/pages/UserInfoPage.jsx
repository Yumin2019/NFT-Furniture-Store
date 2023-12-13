import {
  Button,
  Center,
  Text,
  Image,
  Box,
  Divider,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
} from "@chakra-ui/react";
import { RoomItem } from "../components/RoomItem";
import { BiWorld } from "react-icons/bi";
import { useRef, useState } from "react";
import { FaRegHeart, FaHeart, FaHeartBroken } from "react-icons/fa";
import Lottie from "lottie-react";
import heartAnim from "../assets/HeartAnim.json";
import { ItemTab } from "../components/tabs/ItemTab";
import { FollowersTab } from "../components/tabs/FollowersTab";
import { GuestBookTab } from "../components/tabs/GuestBookTab";

const ColItem = ({ name, count, onClick }) => {
  return (
    <Button
      colorScheme="teal"
      variant="ghost"
      textAlign="center"
      margin={4}
      paddingTop={8}
      paddingBottom={8}
      onClick={onClick}
    >
      <div>
        <Text fontSize={18} mb={1}>
          {count}
        </Text>
        <Text fontSize={18} fontWeight="bold">
          {name}
        </Text>
      </div>
    </Button>
  );
};

export const UserInfoPage = () => {
  console.log("UserInfoPage");

  const [isFollower, setIsFollwer] = useState(false);
  const lottieRef = useRef();

  const clickFollowButton = () => {
    lottieRef.current.stop();
    if (!isFollower) {
      lottieRef.current.play();
      lottieRef.current.setSpeed(2);
    }
    setIsFollwer(!isFollower);
  };

  const user = {
    id: 1,
    name: "yumin",
    desc: "yumin is a really good programmer who can make many things. ",
    email: "richyumin@naver.com",
    nftCount: 10,
    furnitureCount: 5,
    followers: 2,
    followings: 1,
  };

  const myRoom = {
    id: 3,
    name: "Meta World",
    desc: "Welcome to learning React!",
    people: 1,
  };

  return (
    <>
      <Box position="absolute" top="10%" left="30%" w="40%">
        <Lottie
          lottieRef={lottieRef}
          animationData={heartAnim}
          loop={false}
          autoplay={false}
          onComplete={() => {
            lottieRef.current.stop();
          }}
        />
      </Box>

      <Center>
        <Box maxW="60%" padding={5}>
          <Box display="flex" alignItems="center">
            <Image
              boxSize="150px"
              border="0.5px solid grey"
              src="image/profile_image.png"
            />
            <ColItem name="NFT" count={10} onClick={() => {}} />
            <ColItem name="Furniture" count={10} onClick={() => {}} />
            <ColItem name="Followers" count={10} onClick={() => {}} />
            <ColItem name="Followings" count={10} onClick={() => {}} />
          </Box>

          <Box mt={4}>
            <Text fontSize={24} fontWeight="bold">
              {user.name}
            </Text>
            <Text fontSize={18} color="grey">
              {user.desc}
            </Text>
            <Text mt={2} fontSize={18} color="grey">
              {user.email}
            </Text>
            <Button
              colorScheme="teal"
              variant="outline"
              mt={2}
              width={100}
              size="sm"
              rightIcon={isFollower ? <FaHeartBroken /> : <FaHeart />}
              onClick={clickFollowButton}
            >
              {isFollower ? "Unfollow" : "Follow"}
            </Button>
          </Box>

          <Divider mt={4} mb={4} />

          <Box
            display="flex"
            alignItems="center"
            fontSize={16}
            fontWeight="bold"
            color="teal"
            mb={1}
          >
            <BiWorld fontSize={20} style={{ marginRight: 4 }} />
            {user.name}'s World
          </Box>

          <RoomItem room={myRoom} right="-91%" />

          <Tabs isFitted variant="enclosed" mt={4} colorScheme="teal">
            <TabList mb={2}>
              <Tab>NFT</Tab>
              <Tab>Furniture</Tab>
              <Tab>Followers</Tab>
              <Tab>Followings</Tab>
              <Tab>Guest Book</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <ItemTab />
              </TabPanel>
              <TabPanel>
                <ItemTab />
              </TabPanel>
              <TabPanel>
                <FollowersTab />
              </TabPanel>
              <TabPanel>
                <FollowersTab />
              </TabPanel>
              <TabPanel key={"aa"}>
                <GuestBookTab />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Center>
    </>
  );
};
