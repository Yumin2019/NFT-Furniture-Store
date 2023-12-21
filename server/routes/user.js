const { Router } = require("express");
const router = Router();
const db = require("../utils/mysql.js");
const mailer = require("../utils/mailer");
const { hash, randomGenerator } = require("../utils/helpers.js");

router.post("/resetPassword", async (req, res) => {
  try {
    const { token, password } = req.body;
    let [rows] = await db.query("SELECT * FROM `user` WHERE `resetToken` = ?", [
      token,
    ]);

    if (rows.length == 0) {
      res.status(400).send({ msg: "token is invalid" });
      return;
    }

    let now = new Date();
    let date = rows[0]["resetMailDate"];
    let diff = (now - date) / (1000 * 60);

    // 3분이 넘은 경우, 처리할 수 없도록 한다.
    if (diff > 3) {
      res
        .status(400)
        .send({ msg: "token is expired, request reset mail again" });
      return;
    }

    // 3분 이내 요청한 경우라면, 업데이트 처리해준다.
    let [results] = await db.query(
      "UPDATE `user` SET `password` = ? WHERE `resetToken` = ?",
      [password, token]
    );
    if (results.affectedRows > 0) {
      res.send(200);
    } else {
      res.send(500);
    }
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

router.post("/requestResetMail", async (req, res) => {
  try {
    const { email } = req.body;
    // 이메일 정보를 가진 유저가 있는지 확인한다.
    let [rows] = await db.query("SELECT * FROM `user` WHERE `email` = ?", [
      email,
    ]);
    if (rows.length == 0) {
      res.status(400).send({ msg: "email is invalid" });
      return;
    }

    // 해당 유저가 사용할 token 정보를 만들고 유저 정보에 업데이트 한다.
    let token = randomGenerator(20);
    let [result] = await db.query(
      "UPDATE `user` SET `resetToken` = ?, `resetMailDate` = NOW() WHERE `email` = ?",
      [token, email]
    );

    if (result.affectedRows == 0) {
      res.send(500);
      return;
    }

    let emailParam = {
      toEmail: email,
      subject: "[Furniture NFT Store] Reset password",
      html: `<p><span style="font-size:22px"><strong>This is a Mail to reset your password of Furniture NFT Store.</strong></span></p>
      <p>Reset Link:&nbsp;<a href="http://localhost:5173/resetPassword/${token}">http://localhost:5173/resetPassword/${token}</a></p>
      <p>&nbsp;</p>
      <p>if you didn&#39;t request reset mail. ignore this.</p>`,
    };

    mailer.sendGmail(emailParam);
    res.send(200);
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

// 유저 페이지에서 필요한 정보를 한번에 넘겨준다. NFT(블록체인과 통신) 가구수, 팔로잉, 팔로워수, 댓글 수, 유저 정보, world 정보
router.get("/getUserInfo/:userId", async (req, res) => {
  try {
    let userId = req.params["userId"];

    // 가구의 수를 구한다.
    let [furniRows] = await db.query(
      "SELECT `furniture_count`.`count` FROM `furniture_count` WHERE `userId` = ?",
      [userId]
    );

    let furniCount = 0;
    furniRows.map((v) => {
      furniCount += v["count"];
    });

    // following 수를 구한다.
    let [followingRow] = await db.query(
      "SELECT count(*) FROM `follow` WHERE `userId` = ?",
      [userId]
    );

    // follower 수를 구한다.
    let [followerRow] = await db.query(
      "SELECT count(*) FROM `follow` WHERE `targetId` = ?",
      [userId]
    );

    // 댓글 수를 구한다.
    let [commentsRow] = await db.query(
      "SELECT count(*) FROM `guest_book_comment` WHERE `originUserId` = ?",
      [userId]
    );

    // 유저와 월드 정보를 가져온다.
    let sql =
      "SELECT `user`.`id`, `user`.`name`, `user`.`email`, `user`.`image`, `user`.`desc`, `room`.`name` as `worldName`, `room`.`desc` as `worldDesc`, `room`.`online` FROM `user` JOIN `room` ON `user`.`id` = `room`.`id` WHERE `user`.`id` = ?";
    let [userRows] = await db.query(sql, [userId]);

    res.send({
      furnitureCount: furniCount,
      followingCount: followingRow[0]["count(*)"],
      followerCount: followerRow[0]["count(*)"],
      commentCount: commentsRow[0]["count(*)"],
      info: userRows[0],
    });
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

// =============================== COMMENT API ===============================
// 특정 유저의 방명록 정보를 가져온다.
router.get("/getComments/:targetId", async (req, res) => {
  try {
    let targetId = req.params["targetId"];
    let sql =
      "SELECT `guest_book_comment`.*, `user`.`name`, `user`.`email` FROM `guest_book_comment` JOIN `user` ON `guest_book_comment`.`userId` = `user`.`id` WHERE `guest_book_comment`.`originUserId` = ?";
    let [rows, fields] = await db.query(sql, [targetId]);
    res.send({ comments: rows, count: rows.length });
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

router.post("/writeComment", async (req, res) => {
  try {
    let userId = req.user.id;
    const { text, targetId } = req.body;

    if (!text) {
      res.status(400).send({ msg: "text parameter is neccessary" });
      return;
    }

    let sql =
      "INSERT INTO `guest_book_comment` (`originUserId`, `userId`, `text`, `createdAt`, `modifiedAt`) VALUES (?, ?, ?, NOW(), NOW())";
    let [results] = await db.query(sql, [targetId, userId, text]);
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

router.post("/deleteComment", async (req, res) => {
  try {
    const { commentId } = req.body;
    let userId = req.user.id;

    // commentId에 해당하는 댓글이 유저가 쓴 것이 맞는지 확인한다.
    let sql =
      "SELECT * FROM `guest_book_comment` WHERE `id` = ? AND `userId` = ?";
    let [rows] = await db.query(sql, [commentId, userId]);
    if (rows.length === 0) {
      res.status(400).send({
        msg: "this comment is already deleted or you're not an author.",
      });
      return;
    }

    // 해당하는 댓글을 삭제한다.
    sql = "DELETE FROM `guest_book_comment` WHERE `id` = ? AND `userId` = ?";
    let [results] = await db.query(sql, [commentId, userId]);
    if (results.affectedRows > 0) {
      res.send(200);
    } else {
      res.send(500);
    }
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

// 댓글을 수정한다.
router.post("/editComment", async (req, res) => {
  try {
    let userId = req.user.id;
    const { commentId, text } = req.body;

    // 해당 댓글이 있는지부터 확인한다.
    let sql =
      "SELECT * FROM `guest_book_comment` WHERE `id` = ? AND `userId` = ?";
    let [rows] = await db.query(sql, [commentId, userId]);
    if (rows.length === 0) {
      res.status(400).send({
        msg: "invalid comment or you're not an author.",
      });
      return;
    }

    sql =
      "UPDATE `guest_book_comment` SET `text` = ?, `modifiedAt` = NOW() WHERE `id` = ? AND `userId` = ?";
    let [results] = await db.query(sql, [text, commentId, userId]);
    if (results.affectedRows > 0) {
      res.send(200);
    } else {
      res.send(500);
    }
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

// 특정 유저의 가구 정보를 구한다.
router.get("/getFurnitures/:userId", async (req, res) => {
  try {
    let userId = req.params["userId"];
    let sql =
      "SELECT `furniture_count`.*, `furniture`.`name`, `furniture`.`desc`, `furniture`.`image` FROM `furniture_count` JOIN `furniture` ON `furniture_count`.`furnitureId` = `furniture`.`id` WHERE `userId` = ?";
    let [rows] = await db.query(sql, [userId]);

    res.send({ furnitures: rows, count: rows.length });
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

router.get("/getFurnitures", async (req, res) => {
  try {
    let [rows] = await db.query("SELECT * FROM `furniture`");
    res.send({ furnitures: rows, count: rows.length });
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

router.post("/follow", async (req, res) => {
  try {
    const { targetId } = req.body;
    let userId = req.user.id;

    // 자기 자신을 follow 하는 것은 불가하다.
    if (userId === targetId) {
      res.status(400).send({ msg: "user can't follow yourself" });
      return;
    }

    // 상대가 존재하는지 확인한다.
    let [targetRows] = await db.query(
      "SELECT count(*) FROM `user` WHERE `id` = ?",
      [targetId]
    );

    if (targetRows[0]["count(*)"] === 0) {
      res.status(400).send({ msg: "targetId is invalid" });
      return;
    }

    // 이미 follow 하고 있는지 확인한다.
    let [rows, fields] = await db.query(
      "SELECT * FROM `follow` WHERE `targetId` = ? AND `userId` = ?",
      [targetId, userId]
    );

    if (rows.length > 0) {
      res.status(400).send({ msg: "user already followed target" });
      return;
    }

    let [results] = await db.query(
      "INSERT INTO `follow` (`targetId`, `userId`) VALUES (?, ?)",
      [targetId, userId]
    );

    if (results.affectedRows > 0) {
      res.send(200);
    } else {
      res.send(500);
    }
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

router.post("/unfollow", async (req, res) => {
  try {
    const { targetId } = req.body;
    let userId = req.user.id;

    // 자기 자신을 unfollow 하는 것은 불가하다.
    if (userId === targetId) {
      res.status(400).send({ msg: "user can't unfollow yourself" });
      return;
    }

    // 상대가 존재하는지 확인한다.
    let [targetRows] = await db.query(
      "SELECT count(*) FROM `user` WHERE `id` = ?",
      [targetId]
    );

    if (targetRows[0]["count(*)"] === 0) {
      res.status(400).send({ msg: "targetId is invalid" });
      return;
    }

    // unfollow 할 수 있는지 확인한다.
    let [rows, fields] = await db.query(
      "SELECT * FROM `follow` WHERE `targetId` = ? AND `userId` = ?",
      [targetId, userId]
    );

    if (rows.length == 0) {
      res.status(400).send({ msg: "user is not following target" });
      return;
    }

    let [results] = await db.query(
      "DELETE FROM `follow` WHERE `targetId` = ? AND `userId` = ?",
      [targetId, userId]
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
