import { useEffect } from "react";
import { io } from "socket.io-client";
import { atom, useAtom } from "jotai";

export const socket = io("http://localhost:3001");
export const charactersAtom = atom(null);
export const mapAtom = atom(null);
export const userAtom = atom(null);
export const itemsAtom = atom([]);

export const SocketManager = () => {
  const [_characters, setCharacters] = useAtom(charactersAtom);
  const [_map, setMap] = useAtom(mapAtom);
  const [_user, setUser] = useAtom(userAtom);
  const [_items, setItems] = useAtom(itemsAtom);

  useEffect(() => {
    function onConnect() {
      console.log("connected");
    }

    function onDisconnect() {
      console.log("disconnected");
    }

    function onJoinRes(data) {
      console.log("onJoinRes");
      console.log(data.map);
      setMap(data.map);
      setUser(data.id);
      setItems(data.items);
      setCharacters(data.characters);
    }

    function onCharacters(characters) {
      console.log(characters);
      setCharacters(characters);
    }

    function onCharacter(socketId, character) {
      console.log(character);
      setCharacters((prev) => {
        let keys = Object.keys(prev);
        return keys.map((key) => {
          if (socketId === key) {
            return character;
          }
          return prev[key];
        });
      });
    }

    function onMapUpdate(data) {
      setMap(data.map);
      setCharacters(data.characters);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("joinRes", onJoinRes);
    socket.on("characters", onCharacters);
    socket.on("character", onCharacter);
    socket.on("mapUpdate", onMapUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("joinRes", onJoinRes);
      socket.off("characters", onCharacters);
      socket.off("character", onCharacter);
      socket.off("mapUpdate", onMapUpdate);
    };
  }, []);
};
