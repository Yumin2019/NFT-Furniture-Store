import { useEffect } from "react";
import { io } from "socket.io-client";
import { atom, useAtom } from "jotai";

export const socket = io("http://localhost:3001");
export const charactersAtom = atom([]);
export const mapAtom = atom(null);
export const userAtom = atom(null);
export const itemsAtom = atom(null);

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

    function onHello(data) {
      setMap(data.map);
      setUser(data.id);
      setItems(data.items);
      setCharacters(data.characters);
    }

    function onCharacters(characters) {
      setCharacters(characters);
    }

    function onPlayerMove(character) {
      console.log("playerMove");
      setCharacters((prev) => {
        return prev.map((_character) => {
          if (_character.id === character.id) {
            return character;
          }
          return _character;
        });
      });
    }

    function onMapUpdate(value) {
      setMap(value.map);
      setCharacters(value.characters);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("hello", onHello);
    socket.on("characters", onCharacters);
    socket.on("playerMove", onPlayerMove);
    socket.on("mapUpdate", onMapUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("hello", onHello);
      socket.off("characters", onCharacters);
      socket.off("playerMove", onPlayerMove);
      socket.off("mapUpdate", onMapUpdate);
    };
  }, []);
};
