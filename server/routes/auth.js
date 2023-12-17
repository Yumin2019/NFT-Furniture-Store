const { Router } = require("express");
const passport = require("passport");
const router = Router();

const db = require("../config/mysql.js");
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

  let sql = "SELECT `email` from `user` where `email` = ?";
  db.query(sql, [email], (error, rows, fields) => {
    if (error) {
      console.log(error);
      res.send(500);
    } else if (rows.fieldCount > 0) {
      res.status(400).send({ msg: "user already exists" });
    } else {
      // const password = hashPassword(req.body.password);
      console.log(password);
      sql = "INSERT INTO `user` (`name`, `email`, `password`) VALUES (?, ?, ?)";
      db.query(sql, [name, email, password], (error, rows, fields) => {
        if (error) {
          console.log(error);
          res.send(500);
        } else {
          res.send(201);
        }
      });
    }
  });
});

module.exports = router;
