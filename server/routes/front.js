const { Router } = require("express");
const passport = require("passport");
const router = Router();
const mailer = require("../utils/mailer");

const db = require("../utils/mysql");
const {
  hashPassword,
  comparePassword,
  randomGenerator,
} = require("../utils/helpers");

// ======================== GET API ========================
router.get("/loginStatus", async (req, res) => {
  if (req.user) res.send(req.user);
  else res.send({ msg: "user is not logged in" });
});

// World 정보를 구하는 API
router.get("/getWorldInfo/:id", async (req, res) => {
  try {
    let roomId = req.params["id"];
    let [rows] = await db.query("SELECT * FROM `room` WHERE `id` = ?", [
      roomId,
    ]);

    if (rows.length == 1) {
      res.send(rows[0]);
      return;
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
    let [rows] = await db.query(sql, [userId]);
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
    let [rows] = await db.query(sql, [userId]);
    res.send({ followers: rows, count: rows.length });
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

router.get("/getUserList", async (req, res) => {
  try {
    let [rows] = await db.query("SELECT `id`, `name`, `email` FROM `user`");
    let json = {};
    rows.map((v) => {
      json[v.id] = v;
    });
    res.send({ users: json, count: rows.length });
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
      "SELECT `user`.`id`, `user`.`name`, `user`.`email`, `user`.`image`, `user`.`desc`, `room`.`name` as `worldName`, `room`.`desc` as `worldDesc`, `room`.`online` FROM `user` LEFT JOIN `room` ON `user`.`id` = `room`.`id` WHERE `user`.`id` = ?";
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

// 특정 유저의 방명록 정보를 가져온다.
router.get("/getComments/:targetId", async (req, res) => {
  try {
    let targetId = req.params["targetId"];
    let sql =
      "SELECT `guest_book_comment`.*, `user`.`name`, `user`.`email`, `user`.`image` FROM `guest_book_comment` JOIN `user` ON `guest_book_comment`.`userId` = `user`.`id` WHERE `guest_book_comment`.`originUserId` = ? ORDER BY `createdAt` DESC";
    let [rows, fields] = await db.query(sql, [targetId]);
    res.send({ comments: rows, count: rows.length });
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

// ======================== NFT API ========================
// DB에 존재하는 모든 NFT 정보를 제공한다. (NFT정보로 사용되는 교환권 정보)
router.get("/getAllNftItems", async (req, res) => {
  try {
    let [rows, fields] = await db.query("SELECT * FROM `nft_item`");

    let result = { count: rows.length, items: {} };
    result.count = rows.length;
    rows.map((v) => {
      result.items[v.id] = v;
    });
    res.send(result);
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

// 특정 nft의 전송 정보를 가져온다.
router.get("/getNftTransfers/:nftId", async (req, res) => {
  try {
    let sql =
      "SELECT `nft_transfer`.*, `user1`.`name` as `fromName`, `user2`.`name` as `toName` FROM `nft_transfer` LEFT JOIN `user` as `user1` ON `nft_transfer`.`fromUserId` = `user1`.`id` LEFT JOIN `user` as `user2` ON `nft_transfer`.`toUserId` = `user2`.`id`WHERE `nft_transfer`.`nftId` = ?";
    let nftId = req.params["nftId"];
    let [rows, fields] = await db.query(sql, [nftId]);
    res.send({ transfers: rows, count: rows.length });
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

// NFT 전송 정보를 추가한다. 주로 NFT를 구매하는 경우에 호출한다.
router.post("/addNftTransfer", async (req, res) => {
  try {
    let { nftId, fromUserId, toUserId, price } = req.body;
    if (!nftId || !fromUserId || !toUserId || !price) {
      res.status(400).send({ msg: "input values are invalid" });
      return;
    }

    let sql =
      "INSERT INTO `nft_transfer` (`nftId`, `fromUserId`, `toUserId`, `date`, `price`) VALUES (?, ?, ?, NOW(), ?)";
    let [result] = await db.query(sql, [nftId, fromUserId, toUserId, price]);

    console.log(result);
    if (result.affectedRows) {
      res.send(200);
    }
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

// ======================== AUTH API ========================
router.post("/login", passport.authenticate("local"), (req, res) => {
  console.log("logged in");
  res.send(200);
});

// 계정 주소와 매칭되는 정보가 있다면, 해당 정보로 로그인한다. (local 전략을 수행하여 처리한다 )
// 해당 부부은 보안적으로 고려된 부부은 아니며, 애초에 DB와 Wallet간 커플링을 풀어야 한다. (설계 미스)
router.post("/loginWithAddress", async (req, res) => {
  try {
    let sql =
      "SELECT `email`, `password` from `user` where `walletAddress` = ?";
    let params = [req.body.address];
    let [rows, fields] = await db.query(sql, params);

    // 중복된 이메일을 확인한다.
    if (rows.length === 0) {
      res.status(400).send({ msg: "invalid user" });
      return;
    }

    let email = rows[0]["email"];
    let password = rows[0]["password"];

    // 클라에게 이메일, 패스워드 정보를 제공한다. (다시 요청 보내서 로그인 처리에 사용)
    res.status(200).send({ email, password });
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

router.post("/logout", (req, res) => {
  if (!req.user) {
    res.status(400).send({ msg: "you're logged in" });
    return;
  }

  req.logOut((err) => {
    if (err) {
      res.status(400).send({ msg: "logout failled" });
    } else {
      console.log("로그아웃됨.");
      res.send(200);
    }
  });
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).send({ msg: "input values are invalid" });
    return;
  }

  try {
    let sql = "SELECT `email` from `user` where `email` = ?";
    let params = [email];
    let [rows, fields] = await db.query(sql, params);

    // 중복된 이메일을 확인한다.
    if (rows.length > 0) {
      res.status(400).send({ msg: "user already exists" });
      return;
    }

    // 계정 회원가입 처리
    // 해시함수 부분 추가해야 함.
    const password = req.body.password; // hashPassword(req.body.password);
    console.log(password);

    sql = "INSERT INTO `user` (`name`, `email`, `password`) VALUES (?, ?, ?)";
    params = [name, email, password];
    let [result] = await db.query(sql, params);

    // room을 생성한다.
    sql = "INSERT INTO `room` (`name`, `desc`) VALUES (?, ?)";
    params = [name, email, password];
    let [roomResult] = await db.query(sql, params);

    console.log(result);
    console.log(roomResult);
    if (result.affectedRows && roomResult.affectedRows) {
      res.send(200);
    }
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

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

module.exports = router;
