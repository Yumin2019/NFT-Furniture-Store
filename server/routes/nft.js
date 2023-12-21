const { Router } = require("express");
const router = Router();
const db = require("../utils/mysql");

// DB에 존재하는 모든 NFT 정보를 제공한다. (NFT정보로 사용되는 교환권 정보)
router.get("/getAllNftItems", async (req, res) => {
  try {
    let [rows, fields] = await db.query("SELECT * FROM `nft_item`");
    res.send({ nftItems: rows, count: rows.length });
  } catch (e) {
    console.log(e);
    res.send(500);
  }
});

module.exports = router;
