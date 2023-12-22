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
  useToast,
} from "@chakra-ui/react";
import { RoomItem } from "../components/RoomItem";
import { BiWorld } from "react-icons/bi";
import { createContext, useRef, useState, useEffect } from "react";
import { FaHeart, FaHeartBroken } from "react-icons/fa";
import Lottie from "lottie-react";
import heartAnim from "../assets/HeartAnim.json";
import { FollowersTab } from "../components/tabs/FollowersTab";
import { GuestBookTab } from "../components/tabs/GuestBookTab";
import { FurnitureTab } from "../components/tabs/FurnitureTab";
import { NftTab } from "./../components/tabs/NftTab";
import { RiPencilFill } from "react-icons/ri";
import { EditProfileDialog } from "../components/dialog/EditProfileDialog";
import { useAtom } from "jotai";
import { loginAtom } from "./MainPage";
import { api } from "../utils/Axios";
import { errorToast, getQueryParam } from "../utils/Helper";

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
  const [loginInfo] = useAtom(loginAtom);
  console.log(`loginInfo: `, loginInfo);

  const [isHeartAnim, setIsHeartAnim] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const [tabIndex, setTabIndex] = useState(0);
  const lottieRef = useRef();
  const isMyInfo = `${loginInfo.id}` === getQueryParam();

  const [userInfo, setUserInfo] = useState({});
  const [furnitures, setFurnitures] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [followingsViewer, setFollowingsViewer] = useState([]);
  const toast = useToast();

  const clickFollowButton = async (isFollow, id) => {
    try {
      console.log(`isFollow = ${isFollow}`);
      if (!loginInfo.id) return;

      let res = await api.post(isFollow ? `/follow` : `/unfollow`, {
        targetId: id,
      });

      if (res.status === 200) {
        lottieRef.current.stop();
        if (isFollow) {
          lottieRef.current.play();
          lottieRef.current.setSpeed(2);
        }
        setIsHeartAnim(isFollow);
        getFollowingsViewer();
      } else {
        errorToast(toast, `${isFollow ? `Follow` : `Unfollow`} Failed`);
      }
    } catch (e) {
      console.log(e);
      errorToast(toast, `${isFollow ? `Follow` : `Unfollow`} Failed`);
    }
  };

  const getUserInfo = async () => {
    try {
      const userId = getQueryParam();
      let res = await api.get(`/getUserInfo/${userId}`);
      setUserInfo(res.data || {});
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getFurnitures = async () => {
    try {
      const userId = getQueryParam();
      let res = await api.get(`/getFurnitures/${userId}`);
      console.log(res.data.furnitures);
      setFurnitures(res.data.furnitures);
    } catch (e) {
      console.log(e);
    }
  };

  const getFollowers = async () => {
    try {
      const userId = getQueryParam();
      let res = await api.get(`/getFollowers/${userId}`);
      console.log(res.data.followers);
      setFollowers(res.data.followers);
    } catch (e) {
      console.log(e);
    }
  };

  const getFollowings = async () => {
    try {
      const userId = getQueryParam();
      let res = await api.get(`/getFollowings/${userId}`);
      console.log(res.data.followings);
      setFollowings(res.data.followings);
    } catch (e) {
      console.log(e);
    }
  };

  const getFollowingsViewer = async () => {
    try {
      if (!loginInfo.id) return;
      let res = await api.get(`/getFollowings/${loginInfo.id}`);

      // viewer의 followings id list
      let idList = [];
      res.data.followings.map((v) => idList.push(v.id));
      setFollowingsViewer(idList);
      console.log(`idList `, idList);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUserInfo();
    getFollowingsViewer();
  }, []);

  useEffect(() => {
    console.log("tab changed");
    if (tabIndex === 1) {
      getFurnitures();
    } else if (tabIndex === 2) {
      getFollowers();
    } else if (tabIndex === 3) {
      getFollowings();
    }
  }, [tabIndex]);

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
        initProfile={userInfo?.info?.image || "/image/account_icon.svg"}
        initName={userInfo?.info?.name}
        initDesc={userInfo?.info?.desc}
        initWorldName={userInfo?.info?.worldName}
        initWorldDesc={userInfo?.info?.worldDesc}
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
              src={userInfo?.info?.image || "/image/account_icon.svg"}
            />
            <ColItem
              name="NFT"
              count={100}
              onClick={() => {
                setTabIndex(0);
              }}
            />
            <ColItem
              name="Furniture"
              count={userInfo?.furnitureCount || 0}
              onClick={() => {
                setTabIndex(1);
              }}
            />
            <ColItem
              name="Followers"
              count={userInfo?.followerCount || 0}
              onClick={() => {
                setTabIndex(2);
              }}
            />
            <ColItem
              name="Following"
              count={userInfo?.followingCount || 0}
              onClick={() => {
                setTabIndex(3);
              }}
            />
            <ColItem
              name="Guest Book"
              count={userInfo?.commentCount || 0}
              onClick={() => {
                setTabIndex(4);
              }}
            />
          </Box>

          <Box mt={4}>
            <Text fontSize={24} fontWeight="bold">
              {userInfo?.info?.name}
            </Text>
            <Text fontSize={18} color="grey">
              {userInfo?.info?.desc}
            </Text>
            <Text mt={2} fontSize={18} color="grey">
              {userInfo?.info?.email}
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
            {userInfo?.info?.name}'s World
          </Box>

          <RoomItem
            room={{
              name: userInfo?.info?.worldName,
              desc: userInfo?.info?.worldDesc,
              online: userInfo?.info?.online,
            }}
            desc={userInfo}
            right="-91%"
          />
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
                  <FurnitureTab furnitures={furnitures} />
                </TabPanel>
                <TabPanel>
                  <FollowersTab
                    users={followers}
                    viewerFollowers={followingsViewer}
                  />
                </TabPanel>
                <TabPanel>
                  <FollowersTab
                    users={followings}
                    viewerFollowers={followingsViewer}
                  />
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
