import { Box, Flex, Text, Spacer } from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa";

export const AccountRow = ({ hoverIdx, index, setHoverIdx, v, onClick }) => {
  return (
    <Flex
      key={index}
      cursor="pointer"
      alignItems="center"
      pb={2}
      pt={2}
      background={hoverIdx === index ? "#f9faf9" : null}
      onMouseOver={() => setHoverIdx(index)}
      onMouseOut={() => setHoverIdx(-1)}
      onClick={onClick}
    >
      <Box
        background="#0376c9"
        w="4px"
        h="45px"
        ml={1}
        mr={2}
        borderRadius={4}
        visibility={v.isSelected ? "visible" : "hidden"}
      />
      <FaUserCircle size={28} color="#3082ce" />
      <Box textAlign="left" ml={3} mt={1} mb={1}>
        <Text fontSize={14} textColor="#48494a" fontWeight="bold">
          {v.name}
        </Text>
        <Text fontSize={12} textColor="#48494a">
          {v.address}
        </Text>
      </Box>

      <Spacer />

      <Box textAlign="right" mr={2}>
        <Text fontSize={14} textColor="#48494a">
          {v.matic}
        </Text>
        <Text fontSize={12} textColor="#48494a">
          {v.usd}
        </Text>
      </Box>
    </Flex>
  );
};
