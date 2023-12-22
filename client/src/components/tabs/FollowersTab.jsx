import { Box, Divider } from "@chakra-ui/react";
import { FollowerItem } from "./item/FollowerItem";

export const FollowersTab = ({ users, viewerFollowers }) => {
  return (
    <>
      {users &&
        users.map((v, index) => {
          let isFollowerViewer = viewerFollowers.includes(v.id);
          return (
            <Box key={index}>
              <FollowerItem
                id={v.id}
                image={v.image}
                name={v.name}
                email={v.email}
                desc={v.desc}
                isFollowerViewer={isFollowerViewer}
              />
              <Divider mt={2} mb={2} />
            </Box>
          );
        })}
    </>
  );
};
