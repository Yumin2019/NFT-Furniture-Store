import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const MainPage = () => {
  return (
    <Link to={"/login"}>
      <Button size="sm" variant="link" colorScheme="teal">
        Join now
      </Button>
    </Link>
  );
};
