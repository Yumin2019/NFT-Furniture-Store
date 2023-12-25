create database if not exists`furniture_nft_store`;
use `furniture_nft_store`;

drop table if exists `follow`;
drop table if exists `furniture`;
drop table if exists `furniture_count`;
drop table if exists `guest_book_comment`;
drop table if exists `nft_item`;
drop table if exists `nft_transfer`;
drop table if exists `room`;
drop table if exists `user`;

CREATE TABLE `furniture_nft_store`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  #`roomId` INT NOT NULL AUTO_INCREMENT,
  `resetMailDate` DATETIME NULL,
  `resetToken` VARCHAR(255) NULL,
  `image` VARCHAR(255) NULL,
  `desc` VARCHAR(255) NULL,
  `walletAddress` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE);

CREATE TABLE `furniture_nft_store`.`room` (
  `id` INT NOT NULL AUTO_INCREMENT,
  #`userId` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `desc` VARCHAR(255) NULL,
  `online` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`));

CREATE TABLE `furniture_nft_store`.`nft_item` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `furnitureId` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `desc` VARCHAR(255) NULL,
  `image` VARCHAR(255) NULL,
  PRIMARY KEY (`id`));
#`couponType` ENUM('furniture', 'character') NOT NULL,

CREATE TABLE `furniture_nft_store`.`furniture` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `desc` VARCHAR(255) NULL,
  `image` VARCHAR(255) NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `furniture_nft_store`.`furniture_count` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `furnitureId` INT NOT NULL,
  `count` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`));

CREATE TABLE `furniture_nft_store`.`nft_transfer` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nftId` INT NOT NULL,
  `fromUserId` INT NOT NULL,
  `toUserId` INT NOT NULL,
  `date` DATETIME NOT NULL,
  `price` DOUBLE NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`));

CREATE TABLE `furniture_nft_store`.`guest_book_comment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `originUserId` INT NOT NULL,
  `userId` INT NOT NULL,
  `text` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `modifiedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `furniture_nft_store`.`follow` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `targetId` INT NOT NULL,
  `userId` INT NOT NULL,
  PRIMARY KEY (`id`));

SELECT * FROM furniture_nft_store.user;

# user와 room은 같이 생성된다. 동일한 id를 사용한다. 
INSERT INTO `user` (`name`, `email`, `password`) VALUES ('test1', 'richyumin@naver.com', '1234');
INSERT INTO `room` (`name`, `desc`) VALUES ('Furniture room1', 'This is a Furniture World1');

INSERT INTO `user` (`name`, `email`, `password`) VALUES ('test2', 'test2@naver.com', '1234');
INSERT INTO `room` (`name`, `desc`) VALUES ('Furniture room2', 'This is a Furniture World2');

# 가구 데이터와 NFT 정보용 데이터는 미리 생성한다. (게임으로 치면 교환권 같은 개념)
INSERT INTO `furniture` (`name`, `desc`) VALUES ('furiture1', 'furniture1');
INSERT INTO `furniture` (`name`, `desc`) VALUES ('furiture2', 'furniture2');
INSERT INTO `furniture` (`name`, `desc`) VALUES ('furiture3', 'furniture3');

# NFT 아이템 정보(교환권 데이터)
INSERT INTO `nft_item` (`furnitureId`, `name`, `desc`) VALUES (1, 'furniture1 coupon', 'furniture1 coupon');
INSERT INTO `nft_item` (`furnitureId`, `name`, `desc`) VALUES (2, 'furniture2 coupon', 'furniture2 coupon');
INSERT INTO `nft_item` (`furnitureId`, `name`, `desc`) VALUES (3, 'furniture3 coupon', 'furniture3 coupon');

# user는 3개의 가구를 1개씩 가진다. 
INSERT INTO `furniture_count` (`userId`, `furnitureId`, `count`) VALUES (1, 1, 1);
INSERT INTO `furniture_count` (`userId`, `furnitureId`, `count`) VALUES (1, 2, 1);
INSERT INTO `furniture_count` (`userId`, `furnitureId`, `count`) VALUES (1, 3, 1);

# nft transfer pass
# INSERT INTO `nft_transfer` (`nftId`, `fromUserId`, `toUserId`, `date`, `price`) VALUES (1, 1, 2, '2023-12-03 15:15:15', 1);

INSERT INTO `guest_book_comment` (`originUserId`, `userId`, `text`, `createdAt`, `modifiedAt`) VALUES (1, 2, 'hello', '2023-12-03 15:15:15', '2023-12-03 15:15:15');

INSERT INTO `follow` (`targetId`, `userId`) VALUES (1, 2);
INSERT INTO `follow` (`targetId`, `userId`) VALUES (2, 1);