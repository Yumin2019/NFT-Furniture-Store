import {
  Box,
  Center,
  Text,
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreatePasswordPage } from "./CreatePasswordPage";
import { PhasePage } from "./PhrasePage";

export const CreateWalletPage = () => {
  const navigate = useNavigate();
  const [curStep, setCurStep] = useState(1);
  const [steps, setSteps] = useState([]);

  const createStep = (text, isCompleted, isCurrent) => {
    return { text, isCompleted, isCurrent };
  };

  useEffect(() => {
    if (curStep === 1) {
      setSteps([
        createStep("Create password", false, true),
        createStep("Secure wallet", false, false),
        createStep("Confirm secret recovery phrase", false, false),
      ]);
    } else if (curStep === 2) {
      setSteps([
        createStep("Create password", true, false),
        createStep("Secure wallet", false, true),
        createStep("Confirm secret recovery phrase", false, false),
      ]);
    } else {
      setSteps([
        createStep("Create password", true, false),
        createStep("Secure wallet", true, false),
        createStep("Confirm secret recovery phrase", false, true),
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
              } else if (index === 2) {
                leftColor = disable;
              }
            } else if (curStep === 3) {
              leftColor = enable;
              rightColor = enable;
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
                    visibility={index === 2 ? "hidden" : "visible"}
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

        <Box pl={4} pr={4}>
          {curStep === 1 && (
            <CreatePasswordPage
              buttonText="Create a wallet"
              onNext={() => {
                setCurStep(curStep + 1);
              }}
            />
          )}

          {curStep > 1 && (
            <PhasePage
              onNext={() => {
                setCurStep(curStep + 1);
              }}
            />
          )}
        </Box>
      </Box>
    </Center>
  );
};
