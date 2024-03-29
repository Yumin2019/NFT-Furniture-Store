const { Router } = require("express");
const router = Router();
const db = require("../utils/mysql.js");
const mailer = require("../utils/mailer");
const { hash, randomGenerator } = require("../utils/helpers.js");
const { uploadS3, s3 } = require("../utils/upload");

// 자신의 방 정보와 팔로우하고 있는 유저의 방 정보를 넘긴다. (userId 기준)
router.get("/getWorldList", async (req, res) => {
  try {
    let userId = req.user.id;

    // following 유저들의 id 정보를 구한다.
    let [rows] = await db.query("SELECT * FROM `follow` WHERE `userId` = ?", [
      userId,
    ]);

    let idList = [];
    rows.map((v) => {
      idList.push(v["targetId"]);
    });

    // 팔로잉 하는 유저방, 자신의 방 정보를 구해서 반환한다.
    idList.push(userId);
    let [roomRows] = await db.query("SELECT * FROM `room` WHERE `id` IN (?)", [
      idList,
    ]);

    res.send({ rooms: roomRows, count: roomRows.length });
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
      "SELECT * FROM `guest_book_comment` WHERE `id` = ? AND (`userId` = ? OR `originUserId` = ?)";
    let [rows] = await db.query(sql, [commentId, userId, userId]);
    if (rows.length === 0) {
      res.status(400).send({
        msg: "this comment is already deleted or you're not an author.",
      });
      return;
    }

    // 해당하는 댓글을 삭제한다.
    sql =
      "DELETE FROM `guest_book_comment` WHERE `id` = ? AND (`userId` = ? OR `originUserId` = ?)";
    let [results] = await db.query(sql, [commentId, userId, userId]);
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

    console.log(commentId);
    console.log(text);

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

// 토큰 삭제 이후에 호출하는 API
// 보안적으로 취약한 부분이다. 상용 블록체인 플랫폼에서는 백엔드에서 모든 처리를 끝낸 이후에 아이템의 개수를 증가시키는 형태일 것.
// 우리 앱에서는 프론트가 처리를 한 이후에 개수 요청에 대한 처리를 백엔드에 던지고 있음. 그리고 백엔드는 블록체인 상태를 따로 확인하지 않음.
router.post("/consumeToken", async (req, res) => {
  try {
    let userId = req.user.id;
    let { furnitureId } = req.body;

    // 매칭 되는 정보가 있다면, 수를 증가하고 없으면 삽입한다.
    let [rows] = await db.query(
      "SELECT * from `furniture_count` WHERE `userId` = ? AND `furnitureId` = ?",
      [userId, furnitureId]
    );

    let [results] = await db.query(
      rows.length === 0
        ? "INSERT INTO `furniture_count` (`userId`, `furnitureId`, `count`) VALUES (?, ?, 1)"
        : "UPDATE `furniture_count` SET `count` = `count` + 1 WHERE `userId` = ? AND `furnitureId` = ?",
      [userId, furnitureId]
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

// account 정보를 등록한다.
router.post("/registerAccount", async (req, res) => {
  try {
    let userId = req.user.id;
    let { address } = req.body;
    let [results] = await db.query(
      "UPDATE `user` SET `walletAddress` = ? WHERE `id` = ?",
      [address, userId]
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

// 프로필 이미지 부분은 일단 제외한다.
router.post("/editProfile", uploadS3.single("image"), async (req, res) => {
  let { name, desc, worldName, worldDesc } = req.body;
  if (!name || name === "") {
    res.status(400).send({ msg: "name is necessary" });
    return;
  } else if (!worldName || worldName === "") {
    res.status(400).send({ msg: "worldName is necessary" });
    return;
  }

  if (!desc) desc = "";
  if (!worldDesc) worldDesc = "";

  try {
    let id = req.user.id;
    let sql = "UPDATE `user` SET ? WHERE `id` = ?";
    let setJson = { name, desc };
    console.log(req.file);

    // 이미지를 변경하는 경우, 이전 이미지를 삭제한다.
    if (req.file) {
      let [userRows] = await db.query(
        "SELECT `image` from `user` WHERE `id` = ?",
        [id]
      );
      let imagePath = userRows[0].image;
      console.log("imagePath: ", imagePath);

      if (imagePath && imagePath !== "") {
        imagePath = imagePath.substring(imagePath.length - 33);
        s3.deleteObject(
          {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: imagePath, // 삭제하고 싶은 이미지의 key
          },
          (err, data) => {
            if (err) console.log(err);
            else console.log(data);
          }
        );
      }

      setJson.image = req.file.location;
    }

    let params = [setJson, id];
    let [userResults] = await db.query(sql, params);

    sql = "UPDATE `room` SET ? WHERE `id` = ?";
    params = [{ name: worldName, desc: worldDesc }, id];
    let [roomResults] = await db.query(sql, params);

    if (userResults.affectedRows === 1 && roomResults.affectedRows === 1) {
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
