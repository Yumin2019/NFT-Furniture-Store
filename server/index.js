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
const worldRouter = require("./routes/world");

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
app.use(worldRouter);

app.listen(process.env.PORT, () =>
  console.log(`running express server on port ${process.env.PORT}`)
);

// ================== Game Logic ==================
const { furnitures, defaultMap, defaultGrid } = require("./data");
const {
  generatedRandomHexColor,
  getWorldData,
  generateRandomPosition,
  updateOnlines,
} = require("./utils/roomHelper");

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

io.listen(3001);

// 모든 유저 리스트와 방별 유저 리스트
// list: {id: -1}, rooms: {1: [], 2: [], ...}
const characters = { list: {}, rooms: {} };

// 모든 방에 대한 map 정보와 grid 정보
// {1: {map: defaultMap, grid: defaultGrid}, ... }
const maps = {};

// 룸 정보를 바탕으로 초기화한다.
const init = async () => {
  let list = await getWorldData();

  list.map((v, i) => {
    maps[v.id] = {
      map: defaultMap,
      grid: defaultGrid,
    };
    maps[v.id].map.items = JSON.parse(v.items) || [];
    characters.rooms[v.id] = [];
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
    map: defaultMap,
    grid: defaultGrid,
  };
  maps[world.id].map.items = JSON.parse(world.items) || [];
  characters.rooms[world.id] = [];

  // console.log(world);
  // console.log(maps[world.id]);
};

init();

io.on("connection", (socket) => {
  console.log("someone connected");

  socket.on("join", (roomId) => {
    // room에 자기 정보를 넣고 정보를 전달한다.
    characters.list[socket.id] = roomId;
    characters.rooms[roomId].push({
      id: socket.id,
      position: generateRandomPosition(maps[roomId]),
      hairColor: generatedRandomHexColor(),
    });

    socket.emit("joinRes", {
      map: maps[roomId].map,
      characters: characters.rooms[roomId],
      id: socket.id,
      items: furnitures,
    });

    // 방에 있던 다른 유저에게도 정보를 갱신한다.
    io.to(roomId).emit("characters", characters.rooms[roomId]);

    // 방에 참가한다.
    socket.join(roomId);
    console.log(characters);

    // 룸에서 online 수치를 업데이트한다.
    let online = characters.rooms[roomId]?.length || 0;
    updateOnlines(roomId, online);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    // list에서 삭제하고 room에서 삭제한다.
    let roomId = characters.list[socket.id];
    delete characters.list[socket.id];

    characters.rooms[roomId]?.splice(
      characters.rooms[roomId].findIndex((element) => element.id === socket.id),
      1
    );

    // 내부 인원에게 알린다.
    io.to(roomId).emit("characters", characters.rooms[roomId]);
    console.log(characters);

    // 룸에서 online 수치를 업데이트한다.
    let online = characters.rooms[roomId]?.length || 0;
    updateOnlines(roomId, online);
  });

  // 유저가 길찾기 요청을 보내는 경우, 처리한다.
  socket.on("move", (from, to, roomId) => {
    // const character = characters.rooms[roomId].find(
    //   (character) => character.id === socket.id
    // );
    // io.to(roomId).emit("playerMove", character);
  });

  // 아이템 리스트가 변경된 경우, 해당 방의 모든 플레이어의 위치 정보를 다시 설정하고 가구 정보를 업데이트 한다.
  socket.on("itemsUpdate", (items) => {
    let roomId = characters.list[socket.id];
    let roomCharacters = characters.rooms[roomId];
    let map = maps[roomId].map;

    console.log("items", items);

    map.items = items;
    roomCharacters.forEach((character) => {
      character.path = [];
      character.position = generateRandomPosition(maps[roomId]);
    });
    // 가구 정보에 따라 grid 업데이트(패스 파인딩)
    // updateGrid();
    // DB에 변경된 내용을 저장한다.
    // 개수별로 처리는 어떻게? 가구 수 증가 감소는?

    io.to(roomId).emit("mapUpdate", { map: map, characters: roomCharacters });
  });
});

module.exports = {
  addNewRoom,
};
