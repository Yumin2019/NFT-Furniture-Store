const passport = require("passport");
const { Strategy } = require("passport-local");
const { comparePassword } = require("../utils/helpers");
const db = require("../utils/mysql");

passport.serializeUser((user, done) => {
  // console.log("Serializing User...");
  // console.log(user);
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  // console.log("Deserializing User");
  // console.log(user);

  try {
    let sql =
      "SELECT `id`, `name`, `email`, `walletAddress` from `user` where `email` = ?";
    let params = [user.email];
    let [rows, fields] = await db.query(sql, params);

    if (rows.length > 0) {
      done(null, rows[0]);
    }
  } catch (error) {
    console.log(error);
    done(error, null);
  }
});

passport.use(
  new Strategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      // console.log("strategy");
      // console.log(email);
      // console.log(password);

      try {
        if (!email || !password) throw new Error("Missing Credentials");

        let sql =
          "SELECT `id`, `name`, `email`, `password`, `walletAddress` from `user` where `email` = ?";
        let params = [email];
        let [rows, fields] = await db.query(sql, params);

        // 해시 함수 부분 추가해야 함.
        const isValid = password === rows[0].password;
        if (isValid) {
          console.log("Authenicated Successfully!");
          done(null, {
            id: rows[0].id,
            name: rows[0].name,
            email: rows[0].email,
            walletAddress: rows[0].walletAddress,
          });
        } else {
          console.log("Invalid Authentication");
          done(null, null);
        }
      } catch (error) {
        console.log(error);
        done(error, null);
      }
    }
  )
);
