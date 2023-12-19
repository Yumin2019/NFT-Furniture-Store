const { Router } = require("express");
const router = Router();
const db = require("../config/mysql.js");

// 특정 유저의 방명록 정보를 가져온다.
router.get("/getGuestBook/:userId", async (req, res) => {
  try {
    let userId = req.params["userId"];
    let sql =
      "SELECT `guest_book_comment`.*, `user`.`name`, `user`.`email` FROM `guest_book_comment` JOIN `user` ON `guest_book_comment`.`userId` = `user`.`id` WHERE `guest_book_comment`.`originUserId` = ?";
    let [rows, fields] = await db.query(sql, [userId]);
    res.send({ comments: rows, count: rows.length });
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

// 특정 유저의 following 정보를 가져온다.
// 팔로우 정보 + 팔로우 대상의 유저 정보 where 팔로우 하는 사람은 나 => 나의 팔로잉 정보
router.get("/getFollowings/:userId", async (req, res) => {
  try {
    let userId = req.params["userId"];
    let sql =
      "SELECT `user`.`id`, `user`.`name`, `user`.`email`, `user`.`image`, `user`.`desc` FROM `follow` JOIN `user` ON `follow`.`targetId` = `user`.`id` WHERE `follow`.`userId` = ?";
    let [rows, fields] = await db.query(sql, [userId]);
    res.send({ followings: rows, count: rows.length });
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

// 특정 유저의 follower 정보를 가져온다.
// 팔로우 정보 + 팔로우 하는 유저 정보 where 팔로우 당하는 사람은 나 => 나의 팔로워 정보
router.get("/getFollowers/:userId", async (req, res) => {
  try {
    let userId = req.params["userId"];
    let sql =
      "SELECT `user`.`id`, `user`.`name`, `user`.`email`, `user`.`image`, `user`.`desc` FROM `follow` JOIN `user` ON `follow`.`userId` = `user`.`id` WHERE `follow`.`targetId` = ?";
    let [rows, fields] = await db.query(sql, [userId]);
    res.send({ followers: rows, count: rows.length });
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

// 프로필 이미지 부분은 일단 제외한다.
router.post("/editProfile", async (req, res) => {
  const { name, desc, worldName, worldDesc } = req.body;
  if (!name && !desc && !worldName && !worldDesc) {
    res.status(400).send({ msg: "input values are invalid" });
    return;
  }

  try {
    let id = req.user.id;
    let roomResult = true;
    let userResult = true;

    // 유저 정보를 업데이트 하는 경우
    if (name || desc) {
      let userUpdate = {};
      if (name) userUpdate.name = name;
      if (desc) userUpdate.desc = desc;

      let sql = "UPDATE `user` SET ? WHERE ?";
      let params = [userUpdate, { id: id }];
      let [results] = await db.query(sql, params);
      userResult = results.affectedRows === 1;
    }

    // room 정보를 업데이트 하는 경우
    if (worldName || worldDesc) {
      let roomUpdate = {};
      if (worldName) roomUpdate.name = worldName;
      if (worldDesc) roomUpdate.desc = worldDesc;

      let sql = "UPDATE `room` SET ? WHERE ?";
      let params = [roomUpdate, { id: id }];
      let [results] = await db.query(sql, params);
      roomResult = results.affectedRows === 1;
    }

    if (userResult && roomResult) {
      return res.send(200);
    } else {
      return res.send(500);
    }
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

module.exports = router;
