create database if not exists`furniture_wallet`;
use `furniture_wallet`;

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
INSERT INTO `user` (`name`, `email`, `password`) VALUES ('test2', 'test2@naver.com', '1234');
