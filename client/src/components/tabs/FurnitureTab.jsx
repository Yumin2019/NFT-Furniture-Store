import { Box, Divider, useDisclosure } from "@chakra-ui/react";
import { FurnitureItem } from "./item/FurnitureItem";
import { FurnitureDetailDialog } from "../dialog/FurnitureDetailDialog";
import { useState } from "react";

export const FurnitureTab = ({ furnitures }) => {
  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose,
  } = useDisclosure();

  const [furnitureInfo, setFurnitureInfo] = useState();

  return (
    <>
      <FurnitureDetailDialog
        isOpen={isDetailOpen}
        onClose={onDetailClose}
        furniture={furnitureInfo}
      />

      {furnitures &&
        furnitures.map((v, index) => {
          return (
            <Box
              key={index}
              onClick={() => {
                setFurnitureInfo(furnitures[index]);
                onDetailOpen();
              }}
            >
              <FurnitureItem
                image={
                  v?.image
                    ? `/image/furniture/${v.image}.png`
                    : "/image/furniture_icon.svg"
                }
                name={v.name}
                text={v.desc}
                count={v.count}
              />
              <Divider mt={2} mb={2} />
            </Box>
          );
        })}
    </>
  );
};
