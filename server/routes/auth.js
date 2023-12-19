const { Router } = require("express");
const passport = require("passport");
const router = Router();

const db = require("../config/mysql");
const { hashPassword, comparePassword } = require("../utils/helpers");

router.post("/login", passport.authenticate("local"), (req, res) => {
  console.log("logged in");
  res.send(200);
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

    console.log(result);
    if (result.affectedRows) {
      res.send(201);
    }
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

module.exports = router;
