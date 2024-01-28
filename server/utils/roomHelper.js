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

// 현재 접속자 정보 처리
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

// 내부에서 사용하는 룸 정보 관리, 방 주인만 호출한다.
const updateRoom = async (id, value) => {
  try {
    let [results] = await db.query(
      "UPDATE `room` SET `items` = ? WHERE `id` = ?",
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

const gridToVector3 = (gridPosition, map, width = 1, height = 1) => {
  return [
    width / map.gridDivision / 2 + gridPosition[0] / map.gridDivision,
    height / map.gridDivision / 2 + gridPosition[1] / map.gridDivision,
  ];
};

// 생성 좌표 뽑기(랜덤))
const generateRandomPosition = (roomMap) => {
  let map = roomMap.map;
  const x = Math.floor(Math.random() * map.size[0] * map.gridDivision);
  const y = Math.floor(Math.random() * map.size[1] * map.gridDivision);

  return gridToVector3([x, y], map);
};

module.exports = {
  getWorldData,
  generatedRandomHexColor,
  generateRandomPosition,
  updateOnlines,
  updateRoom,
};
