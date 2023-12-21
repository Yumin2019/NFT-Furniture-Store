const { Router } = require("express");
const router = Router();
const db = require("../utils/mysql");

// 자신의 방 정보와 팔로우하고 있는 유저의 방 정보를 넘긴다.
router.get("/getWorldList", async (req, res) => {
  try {
    // follow 테이블의 userId 정보를 모두 가져와서 targetId 정보를 구한다.
    let [rows, fields] = await db.query(
      "SELECT * FROM `follow` WHERE `userId` = ?",
      [req.user.id]
    );

    let idList = [];
    rows.map((v) => {
      idList.push(v["targetId"]);
    });

    // 팔로우 유저의 방, 자신의 방 정보를 구해서 반환한다.
    idList.push(req.user.id);
    let [roomRows, roomfields] = await db.query(
      "SELECT * FROM `room` WHERE `id` IN (?)",
      [idList]
    );

    res.send({ rooms: roomRows, count: roomRows.length });
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    let roomId = req.params["id"];
    let [rows, fields] = await db.query("SELECT * FROM `room` WHERE `id` = ?", [
      roomId,
    ]);

    if (rows.length == 1) {
      res.send(rows[0]);
      return;
    }

    res.send(500);
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

router.post("/connectWorld/:id", async (req, res) => {
  try {
    let roomId = req.params["id"];
    let [results] = await db.query(
      "UPDATE `room` SET `oneline` = `oneline` + 1 WHERE `id` = ?",
      [roomId]
    );

    if (results.affectedRows === 1) {
      res.send(200);
      return;
    }

    res.send(500);
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

router.post("/disconnectWorld/:id", async (req, res) => {
  try {
    let roomId = req.params["id"];
    let [results] = await db.query(
      "UPDATE `room` SET `oneline` = `oneline` - 1 WHERE `id` = ?",
      [roomId]
    );

    if (results.affectedRows === 1) {
      res.send(200);
      return;
    }

    res.send(500);
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

module.exports = router;
