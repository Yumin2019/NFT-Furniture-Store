const { Router } = require("express");
const router = Router();
const db = require("../utils/mysql");

router.post("/connectWorld/:roomId", async (req, res) => {
  try {
    let roomId = req.params["roomId"];
    let [results] = await db.query(
      "UPDATE `room` SET `oneline` = `oneline` + 1 WHERE `id` = ?",
      [roomId]
    );

    if (results.affectedRows === 1) {
      res.send(200);
    } else {
      res.send(500);
    }
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

router.post("/disconnectWorld/:roomId", async (req, res) => {
  try {
    let roomId = req.params["roomId"];
    let [results] = await db.query(
      "UPDATE `room` SET `oneline` = `oneline` - 1 WHERE `id` = ?",
      [roomId]
    );

    if (results.affectedRows === 1) {
      res.send(200);
    } else {
      res.send(500);
    }
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

module.exports = router;
