// Basic Module
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const MySQLStore = require("express-mysql-session")(session);
require("dotenv").config();
require("./strategies/local");

const passport = require("passport");
const app = express();

// Module
const { Server } = require("socket.io");

// Router
const frontRouter = require("./routes/front");
const userRouter = require("./routes/user");

app.use(express.json());

// CORS 설정
app.use(
  cors({
    origin: "http://localhost:5173", // 접근 권한을 부여하는 도메인
    credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
    optionsSuccessStatus: 200, // 응답 상태 200으로 설정
  })
);

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    store: new MySQLStore({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

// 권한 없이 접근할 수 있는 api를 처리한다.
app.use(frontRouter);

app.use((req, res, next) => {
  console.log("user 정보: ", req.user);
  if (req.user) next();
  else res.send(401);
});

// other router
app.use(userRouter);

app.listen(process.env.PORT, () =>
  console.log(`running express server on port ${process.env.PORT}`)
);

// ================== Game Logic ==================
const { furnitures, getDefaultMap } = require("./data");
const {
  generatedRandomHexColor,
  getWorldData,
  generateRandomPosition,
  updateOnlines,
  updateRoom,
} = require("./utils/roomHelper");

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

io.listen(3001);

// 모든 유저 리스트와 방별 유저 리스트
// list: {socket.id: roomName, ...}, rooms: {1: {}, 2: {}, ...}
const characters = { list: {}, rooms: {} };

// 모든 방에 대한 map 정보와 grid 정보
// {1: {map: defaultMap, ... }
const maps = {};

// 룸 정보를 바탕으로 초기화한다.
const init = async () => {
  let list = await getWorldData();

  list.map((v, i) => {
    maps[v.id] = {
      map: getDefaultMap(),
    };
    maps[v.id].map.items = JSON.parse(v.items) || [];
    characters.rooms[v.id] = {};
  });

  // console.log(list);
  // console.log(maps);
};

// 새로운 회원이 만들어진 경우에 처리한다.
const addNewRoom = async (id) => {
  let list = await getWorldData(id);
  if (list.length === 0) return;

  let world = list[0];
  maps[world.id] = {
    map: getDefaultMap(),
  };
  maps[world.id].map.items = JSON.parse(world.items) || [];
  characters.rooms[world.id] = {};

  // console.log(world);
  // console.log(maps[world.id]);
};

init();

io.on("connection", (socket) => {
  console.log("someone connected");

  socket.on("join", (roomId) => {
    console.log(`user joined roomId = ${roomId}`);

    // room에 자기 정보를 넣고 정보를 전달한다.
    characters.list[socket.id] = roomId;
    characters.rooms[roomId][socket.id] = {
      id: socket.id,
      position: generateRandomPosition(maps[roomId]),
      hairColor: generatedRandomHexColor(),
      curAnim: "Idle",
      rotation: 0,
    };

    socket.emit("joinRes", {
      map: maps[roomId].map,
      characters: characters.rooms[roomId],
      id: socket.id,
      items: furnitures,
    });

    // 방에 있던 다른 유저에게도 정보를 갱신한다.
    socket.to(roomId).emit("characters", characters.rooms[roomId]);

    // 방에 참가한다.
    socket.join(roomId);
    console.log(roomId, maps[roomId].map);

    // 룸에서 online 수치를 업데이트한다.
    let online = Object.keys(characters.rooms[roomId]).length;
    console.log("online", online);
    updateOnlines(roomId, online);
  });

  const exitRoom = () => {
    // list에서 삭제하고 room에서 삭제한다.
    let roomId = characters.list[socket.id];
    console.log(`user exited roomId = ${roomId}`);

    if (characters.list[socket.id]) {
      delete characters.list[socket.id];
    }

    if (characters.rooms[roomId]) {
      delete characters.rooms[roomId][socket.id];
    }

    // 내부 인원에게 알린다.
    io.to(roomId).emit("characters", characters.rooms[roomId]);
    console.log(characters);

    // 룸에서 online 수치를 업데이트한다.
    let online = characters.rooms[roomId]
      ? Object.keys(characters.rooms[roomId]).length
      : 0;
    updateOnlines(roomId, online);
  };

  socket.on("exit", () => {
    exitRoom();
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    exitRoom();
  });

  // 유저가 움직인 경우에 처리한다.
  socket.on("move", (positionList, rotationY) => {
    let roomId = characters.list[socket.id];
    let rooms = characters.rooms[roomId];
    if (rooms) {
      // onCharacter의 경우 변경사항 인식이 안 되어서 onCharacters로 처리
      rooms[socket.id].position = positionList;
      rooms[socket.id].rotation = rotationY;
      socket.to(roomId).emit("characters", rooms);
    }
  });

  // 애니메이션이 변경된 경우, 다른 유저에게 해당 정보를 전달
  socket.on("changeAnim", (animation) => {
    let roomId = characters.list[socket.id];
    let rooms = characters.rooms[roomId];
    if (rooms) {
      rooms[socket.id].curAnim = animation;
      socket.to(roomId).emit("characters", rooms);
    }
  });

  // 아이템 리스트가 변경된 경우, 해당 방의 모든 플레이어의 위치 정보를 다시 설정하고 가구 정보를 업데이트 한다.
  socket.on("itemsUpdate", (items) => {
    let roomId = characters.list[socket.id];
    let map = maps[roomId].map;
    map.items = [...items];

    console.log("roomId", roomId);
    console.log("items", map.items);

    // DB에 변경된 내용을 저장한다.
    updateRoom(roomId, JSON.stringify(map.items));

    // 방 내부에 존재하는 유저에게 맵 정보 전달
    io.to(roomId).emit("mapUpdate", map);
  });
});

module.exports = {
  addNewRoom,
};
