const { randomGenerator } = require("./helpers");

let aws = require("aws-sdk");
aws.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION,
});

let multer = require("multer");
let multerS3 = require("multer-s3");
let s3 = new aws.S3();

const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, callback) => {
      callback(null, `profile/${randomGenerator(25)}`);
    },
    acl: "public-read-write",
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = {
  uploadS3,
  s3,
};
