const db = require("../utils/mysql");
const pathfinding = require("pathfinding");

// World 정보 데이터베이스 처리
const getWorldData = async (id) => {
  try {
    let sql = "SELECT * FROM `room`";
    if (id) sql += " WHERE `id` = ?";
    let [rows, fields] = await db.query(sql, id ? [id] : undefined);
    return rows;
  } catch (e) {
    console.log(e);
  }

  return [];
};

const updateOnlines = async (id, value) => {
  try {
    let [results] = await db.query(
      "UPDATE `room` SET `online` = ? WHERE `id` = ?",
      [value, id]
    );
    return results;
  } catch (e) {
    console.log(e);
  }
};

const generatedRandomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

// 맵에서 움직일 수 없는 영역을 설정한다. maps[roomName]을 인자로 넣어서 처리
const updateGrid = (roomMap) => {
  let map = roomMap.map;
  let grid = roomMap.grid;

  // reset grid
  for (let x = 0; x < map.size[0] * map.gridDivision; ++x) {
    for (let y = 0; y < map.size[1] * map.gridDivision; ++y) {
      grid.setWalkableAt(x, y, true);
    }
  }

  map.items.forEach((item) => {
    // 카펫이거나 벽걸이의 경우 넘어간다.
    if (item.walkable || item.wall) {
      return;
    }

    const width =
      item.rotation === 1 || item.rotation === 3 ? item.size[1] : item.size[0];
    const height =
      item.rotation === 1 || item.rotation === 3 ? item.size[0] : item.size[1];

    for (let x = 0; x < width; ++x) {
      for (let y = 0; y < height; ++y) {
        grid.setWalkableAt(
          item.gridPosition[0] + x,
          item.gridPosition[1] + y,
          false
        );
      }
    }
  });
};

// 넘겨준 grid에서 생성 좌표 뽑기(랜덤))
const generateRandomPosition = (roomMap) => {
  let map = roomMap.map;
  let grid = roomMap.grid;

  while (true) {
    const x = Math.floor(Math.random() * map.size[0] * map.gridDivision);
    const y = Math.floor(Math.random() * map.size[1] * map.gridDivision);

    if (grid.isWalkableAt(x, y)) {
      return [x, y];
    }
  }
};

module.exports = {
  getWorldData,
  generatedRandomHexColor,
  updateGrid,
  generateRandomPosition,
  updateOnlines,
};
