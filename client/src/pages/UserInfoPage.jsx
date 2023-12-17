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
  useDisclosure,
} from "@chakra-ui/react";
import { RoomItem } from "../components/RoomItem";
import { BiWorld } from "react-icons/bi";
import { createContext, useRef, useState } from "react";
import { FaHeart, FaHeartBroken } from "react-icons/fa";
import Lottie from "lottie-react";
import heartAnim from "../assets/HeartAnim.json";
import { FollowersTab } from "../components/tabs/FollowersTab";
import { GuestBookTab } from "../components/tabs/GuestBookTab";
import { FurnitureTab } from "../components/tabs/FurnitureTab";
import { NftTab } from "./../components/tabs/NftTab";
import { RiPencilFill } from "react-icons/ri";
import { EditProfileDialog } from "../components/dialog/EditProfileDialog";

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

export const HeartAnimContext = createContext(null);
export const UserInfoPage = () => {
  console.log("UserInfoPage");

  const [isHeartAnim, setIsHeartAnim] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const lottieRef = useRef();
  const isMyInfo = true;

  const clickFollowButton = (flag) => {
    lottieRef.current.stop();
    if (flag) {
      lottieRef.current.play();
      lottieRef.current.setSpeed(2);
    }
    setIsHeartAnim(flag);
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

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  return (
    <>
      <EditProfileDialog
        isOpen={isEditOpen}
        onClose={onEditClose}
        initProfile="image/profile_image.png"
        initName={user.name}
        initDesc={user.desc}
        initWorldName={myRoom.name}
        initWorldDesc={myRoom.desc}
      />

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
            <ColItem
              name="NFT"
              count={10}
              onClick={() => {
                setTabIndex(0);
              }}
            />
            <ColItem
              name="Furniture"
              count={10}
              onClick={() => {
                setTabIndex(1);
              }}
            />
            <ColItem
              name="Followers"
              count={10}
              onClick={() => {
                setTabIndex(2);
              }}
            />
            <ColItem
              name="Following"
              count={10}
              onClick={() => {
                setTabIndex(3);
              }}
            />
            <ColItem
              name="Guest Book"
              count={10}
              onClick={() => {
                setTabIndex(4);
              }}
            />
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
              variant={isMyInfo ? null : "outline"}
              mt={2}
              width={100}
              size="sm"
              rightIcon={
                isMyInfo ? (
                  <RiPencilFill />
                ) : isFollowing ? (
                  <FaHeartBroken />
                ) : (
                  <FaHeart />
                )
              }
              onClick={() => {
                if (isMyInfo) {
                  onEditOpen();
                } else {
                  setIsFollowing(!isFollowing);
                  clickFollowButton(!isFollowing);
                }
              }}
            >
              {isMyInfo ? "Edit" : isFollowing ? "Unfollow" : "Follow"}
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
          <HeartAnimContext.Provider value={clickFollowButton}>
            <Tabs
              isFitted
              variant="enclosed"
              mt={4}
              colorScheme="teal"
              size="md"
              onChange={(index) => {
                setTabIndex(index);
              }}
              index={tabIndex}
            >
              <TabList mb={2}>
                <Tab>NFT</Tab>
                <Tab>Furniture</Tab>
                <Tab>Followers</Tab>
                <Tab>Following</Tab>
                <Tab>Guest Book</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <NftTab />
                </TabPanel>
                <TabPanel>
                  <FurnitureTab />
                </TabPanel>
                <TabPanel>
                  <FollowersTab />
                </TabPanel>
                <TabPanel>
                  <FollowersTab />
                </TabPanel>
                <TabPanel>
                  <GuestBookTab />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </HeartAnimContext.Provider>
        </Box>
      </Center>
    </>
  );
};
