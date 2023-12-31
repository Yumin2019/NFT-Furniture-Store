import { Box, Center, Text, Flex, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreatePasswordPage } from "../createWallet/CreatePasswordPage";
import { WalletRecoveryPage } from "./WalletRecoveryPage";
import { infoToast } from "../../utils/Helper";

export const ImportWalletPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [curStep, setCurStep] = useState(1);
  const [steps, setSteps] = useState([]);

  const createStep = (text, isCompleted, isCurrent) => {
    return { text, isCompleted, isCurrent };
  };

  useEffect(() => {
    if (curStep === 1) {
      setSteps([
        createStep("Confirm secret recovery phrase", false, true),
        createStep("Create password", false, false),
      ]);
    } else if (curStep === 2) {
      setSteps([
        createStep("Confirm secret recovery phrase", true, false),
        createStep("Create password", false, true),
      ]);
    }
  }, [curStep]);

  return (
    <Center>
      <Box textAlign="center" ml={2} mr={2} mt={8}>
        <Flex>
          {steps.map((v, index) => {
            let enable = "#0377ca";
            let disable = "#d6d9dc";
            let rightColor;
            let leftColor;

            if (curStep === 1) {
              leftColor = disable;
              rightColor = disable;
            } else if (curStep === 2) {
              if (index === 0) {
                rightColor = enable;
              } else if (index === 1) {
                leftColor = enable;
                rightColor = disable;
              }
            }

            return (
              <Box flex={1} key={index}>
                <Center>
                  <Box
                    backgroundColor={leftColor}
                    h="2px"
                    flex={1}
                    visibility={index === 0 ? "hidden" : "visible"}
                  />

                  <Box
                    backgroundColor={v.isCompleted ? "#0377ca" : "white"}
                    border={
                      v.isCompleted || v.isCurrent
                        ? "2px solid #0377ca"
                        : "2px solid #d6d9dc"
                    }
                    w={8}
                    h={8}
                    borderRadius={24}
                  >
                    <Text
                      fontSize={12}
                      textColor={
                        v.isCompleted
                          ? "white"
                          : v.isCurrent
                          ? "#0377ca"
                          : "black"
                      }
                      pt="6px"
                    >
                      {index + 1}
                    </Text>
                  </Box>

                  <Box
                    backgroundColor={rightColor}
                    h="2px"
                    flex={1}
                    visibility={index === 1 ? "hidden" : "visible"}
                  />
                </Center>

                <Text
                  fontSize={12}
                  textColor={
                    v.isCompleted || v.isCurrent ? "#0377ca" : "#3e3f41"
                  }
                  mt={2}
                >
                  {v.text}
                </Text>
              </Box>
            );
          })}
        </Flex>
        {curStep === 1 && (
          <WalletRecoveryPage
            onNext={() => {
              setCurStep(curStep + 1);
            }}
          />
        )}
        {curStep === 2 && (
          <CreatePasswordPage
            buttonText="import my wallet"
            onNext={() => {
              navigate("/main");
              infoToast(toast, "Imported your wallet.");
            }}
          />
        )}
      </Box>
    </Center>
  );
};
