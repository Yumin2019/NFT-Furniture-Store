import {
  Button,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Box,
  useToast,
  Image,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  clearData,
  errorToast,
  isExtension,
  loadData,
  printLog,
  saveData,
  sendWorkerEvent,
  showTabOr,
} from "../utils/Helper";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { tabAtom } from "..";

export const LoginPage = () => {
  const [isTabAtom, setIsTabAtom] = useAtom(tabAtom);
  const [passwordText, setPasswordText] = useState("");
  const [loadPassword, setLoadPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const loadLoginInfo = async () => {
    let password = (await loadData("password")) || "";
    let accounts = (await loadData("accounts")) || [];

    if (accounts.length === 0 || password === "") {
      await clearData();
      printLog("no information");
      navigate("/intro");
      return;
    }

    setLoadPassword(password);
    let time = (await loadData("loginTime")) || 0;
    let curTime = new Date().getTime();

    // 최근 로그인 시간이 30분 미만인 경우, 메인 페이지로 이동한다.
    if (curTime - time < 30 * 60 * 1000) {
      printLog("auto login");
      navigate("/main");
    }
  };

  useEffect(() => {
    // 기존에 창이 떠 있는 경우에 창을 닫는다.
    sendWorkerEvent("closeWindow", {});
    loadLoginInfo();
  }, []);

  useEffect(() => {
    if (isExtension() && window.location.hash) {
      printLog(`${window.location.hash} hash on react`);
      if (window.location.hash === "#createWallet") {
        setIsTabAtom(true);
        navigate("/createWallet");
      } else if (window.location.hash === "#importWallet") {
        setIsTabAtom(true);
        navigate("/importWallet");
      }
    }
  }, []);

  const clickLogin = async () => {
    if (passwordText === loadPassword) {
      // 로그인 시간을 갱신한다.
      let curTime = new Date().getTime();
      await saveData("loginTime", curTime);
      navigate("/main");
    } else {
      errorToast(toast, `Login Failed`);
    }
  };

  return (
    <>
      <Center>
        <Box textAlign="center">
          <Text fontSize={40} mt={16} color="grey" fontWeight="400">
            Furniture Wallet
          </Text>
          <Text fontSize={24} mb={4} color="grey">
            Welcome back!
          </Text>
          <Center margin={8}>
            <Image width={128} src="/image/icon-128.png" />
          </Center>

          <InputGroup size="md" mb={8}>
            <Input
              variant="flushed"
              type="password"
              placeholder="Enter password"
              focusBorderColor="blue.400"
              value={passwordText}
              onChange={(e) => {
                setPasswordText(e.target.value);
              }}
            />
          </InputGroup>

          <Button
            colorScheme="blue"
            size="md"
            w="100%"
            borderRadius={32}
            mb={4}
            onClick={clickLogin}
          >
            Login
          </Button>

          <Button
            size="sm"
            variant="link"
            colorScheme="blue"
            mb={4}
            onClick={() => {
              showTabOr("importWallet", () => {
                navigate("/importWallet");
                setIsTabAtom(true);
              });
            }}
          >
            Forgot password?
          </Button>
        </Box>
      </Center>
    </>
  );
};
