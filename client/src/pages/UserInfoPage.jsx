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
import {
  FaHeart,
  FaHeartBroken,
  FaRegQuestionCircle,
  FaWallet,
} from "react-icons/fa";
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
import {
  errorToast,
  getQueryParam,
  getRandomInt,
  successToast,
} from "../utils/Helper";
import { furnitureTokenAddress, tokenContract } from "../contracts/contract";
import { setTxHandler } from "../App";

let nftTabHandler = {};
export const setNftTabHandlers = (obj) => {
  nftTabHandler = obj;
};

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

const NFT_ITEM_LENGTH = 3;
export const HeartAnimContext = createContext(null);
export const UserInfoPage = () => {
  const [loginInfo, setLoginInfo] = useAtom(loginAtom);

  // 현재 유저 Following 여부
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHeartAnim, setIsHeartAnim] = useState(false);

  const [tabIndex, setTabIndex] = useState(0);
  const [isMyInfo, setIsMyInfo] = useState(false);
  const lottieRef = useRef();

  const [userInfo, setUserInfo] = useState({});
  const [furnitures, setFurnitures] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [followingsViewer, setFollowingsViewer] = useState([]);
  const [comments, setComments] = useState([]);
  const [nftList, setNftList] = useState([]);
  const [nftInfoList, setNftInfoList] = useState({});
  const toast = useToast();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

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

      /// 내가 팔로잉 하고 있는지
      let isFollowingViewer = idList.includes(parseInt(getQueryParam()));
      setIsFollowing(isFollowingViewer);
      console.log("isFollowingViewer ", isFollowingViewer);
      console.log(`idList `, idList);
    } catch (e) {
      console.log(e);
    }
  };

  const getComments = async () => {
    try {
      const userId = getQueryParam();
      let res = await api.get(`/getComments/${userId}`);
      setComments(res.data.comments);
      console.log(res.data.comments);
    } catch (e) {
      console.log(e);
    }
  };

  const getUserNFT = async () => {
    try {
      let res = await tokenContract.methods.getTokens(getQueryParam()).call();
      console.log(res);
      setNftList(res);
    } catch (e) {
      console.log(e);
      setNftList([]);
    }
  };

  const getNftInfoList = async () => {
    try {
      let res = await api.get("/getAllNftItems");
      console.log(res.data);
      setNftInfoList(res.data.items);
    } catch (e) {
      console.log(e);
    }
  };

  const clickMint = async () => {
    try {
      let itemIdx = getRandomInt(1, NFT_ITEM_LENGTH + 1);
      let bytecode = tokenContract.methods.mintToken(itemIdx).encodeABI();
      console.log(bytecode);

      let tx = {
        from: loginInfo.walletAddress,
        to: furnitureTokenAddress,
        data: bytecode,
        url: `${window.location.protocol}//${window.location.host}`,
        method: "mintToken",
      };

      let data = { type: "sendTx", tx: tx };
      window.postMessage(data);
    } catch (e) {
      errorToast(toast, "Failed to mint NFT");
      console.log(e);
    }
  };

  const clickConnect = async () => {
    try {
      let userId = loginInfo.id;
      let bytecode = tokenContract.methods
        .registerAccount(Number(userId))
        .encodeABI();
      console.log(bytecode);

      let tx = {
        from: loginInfo.walletAddress,
        to: furnitureTokenAddress,
        data: bytecode,
        url: `${window.location.protocol}//${window.location.host}`,
        method: "registerAccount",
      };

      let data = { type: "sendTx", tx: tx };
      window.postMessage(data);
    } catch (e) {
      errorToast(toast, "Failed to register");
      console.log(e);
    }
  };

  const checkLogin = async () => {
    try {
      let res = await api.get("/loginStatus");
      console.log(res.data);
      setLoginInfo(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const init = async () => {
    await checkLogin();
    getUserInfo();
    getNftInfoList();
    getUserNFT();
  };

  useEffect(() => {
    init();

    // 트랜잭션 처리 callback 등록
    setTxHandler(async (tx) => {
      if (tx.method === "mintToken") {
        successToast(toast, "NFT Mint Success");
        getUserNFT();
      } else if (tx.method === "registerAccount") {
        // User 정보에 account를 등록한다.
        let res = await api.post("/registerAccount", { address: tx.from });
        if (res.status === 200) {
          successToast(toast, "Account is registered");
          navigate(0);
        } else {
          errorToast(toast, "Failed to register");
        }
      } else if (tx.method === "deleteToken") {
        nftTabHandler.deleteToken(tx);
      } else if (tx.method === "sellToken") {
        nftTabHandler.sellToken(tx);
      } else if (tx.method === "cancelTokenSales") {
        nftTabHandler.cancelTokenSales(tx);
      } else if (tx.method === "buyToken") {
        nftTabHandler.buyToken(tx);
      }
    });
  }, []);

  useEffect(() => {
    setIsMyInfo(`${loginInfo?.id}` === getQueryParam());
    getFollowingsViewer();
  }, [loginInfo]);

  useEffect(() => {
    console.log("tab changed");
    if (tabIndex === 0) {
      getUserNFT();
    } else if (tabIndex === 1) {
      getFurnitures();
    } else if (tabIndex === 2) {
      getFollowers();
    } else if (tabIndex === 3) {
      getFollowings();
    } else if (tabIndex === 4) {
      getComments();
    }
  }, [tabIndex]);

  let isMyInfoOnLogin = loginInfo?.id && isMyInfo;
  return (
    <>
      <EditProfileDialog
        isOpen={isEditOpen}
        onClose={onEditClose}
        initProfile={userInfo?.info?.image || "/image/account_icon.svg"}
        initName={userInfo?.info?.name || ""}
        initDesc={userInfo?.info?.desc || ""}
        initWorldName={userInfo?.info?.worldName || ""}
        initWorldDesc={userInfo?.info?.worldDesc || ""}
        onResfresh={() => {
          getUserInfo();
          if (tabIndex === 4) {
            getComments();
          }
        }}
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

            {loginInfo?.id && (
              <Button
                colorScheme="teal"
                variant={isMyInfo ? null : "outline"}
                mt={2}
                minW={100}
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
                    clickFollowButton(!isFollowing, getQueryParam());
                  }
                }}
              >
                {isMyInfo ? "Edit" : isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}

            {isMyInfoOnLogin && loginInfo.walletAddress && (
              <Button
                colorScheme="blue"
                size="sm"
                mt={2}
                ml={2}
                rightIcon={<FaRegQuestionCircle />}
                onClick={clickMint}
              >
                Mint NFT
              </Button>
            )}

            {isMyInfoOnLogin && !loginInfo.walletAddress && (
              <Button
                colorScheme="pink"
                size="sm"
                mt={2}
                ml={2}
                rightIcon={<FaWallet />}
                onClick={clickConnect}
              >
                Connect Wallet
              </Button>
            )}
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
                  <NftTab
                    nftList={nftList}
                    nftInfoList={nftInfoList}
                    userInfo={userInfo?.info || {}}
                    onLoad={() => {
                      // 블록체인 컨트랜트의 상태가 변경되는데 시간이 꽤 걸려서 제대로 처리되지 않을 때가 있음.
                      getUserNFT();
                    }}
                  />
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
                  <GuestBookTab comments={comments} onRefresh={getComments} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </HeartAnimContext.Provider>
        </Box>
      </Center>
    </>
  );
};
