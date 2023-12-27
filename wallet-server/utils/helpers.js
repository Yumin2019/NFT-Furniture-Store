const bcrypt = require("bcryptjs");

function hash(password) {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
}

function comparePassword(raw, hash) {
  return bcrypt.compareSync(raw, hash);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

function randomGenerator(num) {
  let res = "";
  for (let i = 0; i < num; i++) {
    const random = getRandomInt(0, 26); // 0 ~ 25
    res += String.fromCharCode(97 + random); // a to z
  }
  return res;
}

module.exports = {
  hash,
  comparePassword,
  randomGenerator,
};
