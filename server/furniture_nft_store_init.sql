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
  `items` VARCHAR(1000) NULL DEFAULT '[]',
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
# NFT 아이템 정보(교환권 데이터)
INSERT INTO `furniture` (`name`, `desc`, `image`) VALUES ('washer', 'washer desc', 'washer'), ('toiletSquare', 'toiletSquare desc', 'toiletSquare'), ('trashcan', 'trashcan desc', 'trashcan'), ('bathroomCabinetDrawer', 'bathroomCabinetDrawer desc', 'bathroomCabinetDrawer'), ('bathtub', 'bathtub desc', 'bathtub'), ('bathroomMirror', 'bathroomMirror desc', 'bathroomMirror'), ('bathroomCabinet', 'bathroomCabinet desc', 'bathroomCabinet'), ('bathroomSink', 'bathroomSink desc', 'bathroomSink'), ('showerRound', 'showerRound desc', 'showerRound'), ('tableCoffee', 'tableCoffee desc', 'tableCoffee'), ('loungeSofaCorner', 'loungeSofaCorner desc', 'loungeSofaCorner'), ('bear', 'bear desc', 'bear'), ('loungeSofaOttoman', 'loungeSofaOttoman desc', 'loungeSofaOttoman'), ('tableCoffeeGlassSquare', 'tableCoffeeGlassSquare desc', 'tableCoffeeGlassSquare'), ('loungeDesignSofaCorner', 'loungeDesignSofaCorner desc', 'loungeDesignSofaCorner'), ('loungeDesignSofa', 'loungeDesignSofa desc', 'loungeDesignSofa'), ('loungeSofa', 'loungeSofa desc', 'loungeSofa'), ('bookcaseOpenLow', 'bookcaseOpenLow desc', 'bookcaseOpenLow'), ('kitchenBar', 'kitchenBar desc', 'kitchenBar'), ('bookcaseClosedWide', 'bookcaseClosedWide desc', 'bookcaseClosedWide'), ('bedSingle', 'bedSingle desc', 'bedSingle'), ('bench', 'bench desc', 'bench'), ('bedDouble', 'bedDouble desc', 'bedDouble'), ('benchCushionLow', 'benchCushionLow desc', 'benchCushionLow'), ('loungeChair', 'loungeChair desc', 'loungeChair'), ('cabinetBedDrawer', 'cabinetBedDrawer desc', 'cabinetBedDrawer'), ('cabinetBedDrawerTable', 'cabinetBedDrawerTable desc', 'cabinetBedDrawerTable'), ('table', 'table desc', 'table'), ('tableCrossCloth', 'tableCrossCloth desc', 'tableCrossCloth'), ('plant', 'plant desc', 'plant'), ('plantSmall', 'plantSmall desc', 'plantSmall'), ('rugRounded', 'rugRounded desc', 'rugRounded'), ('rugRound', 'rugRound desc', 'rugRound'), ('rugSquare', 'rugSquare desc', 'rugSquare'), ('rugRectangle', 'rugRectangle desc', 'rugRectangle'), ('televisionVintage', 'televisionVintage desc', 'televisionVintage'), ('televisionModern', 'televisionModern desc', 'televisionModern'), ('kitchenCabinetCornerRound', 'kitchenCabinetCornerRound desc', 'kitchenCabinetCornerRound'), ('kitchenCabinetCornerInner', 'kitchenCabinetCornerInner desc', 'kitchenCabinetCornerInner'), ('kitchenCabinet', 'kitchenCabinet desc', 'kitchenCabinet'), ('kitchenBlender', 'kitchenBlender desc', 'kitchenBlender'), ('dryer', 'dryer desc', 'dryer'), ('chairCushion', 'chairCushion desc', 'chairCushion'), ('chair', 'chair desc', 'chair'), ('deskComputer', 'deskComputer desc', 'deskComputer'), ('desk', 'desk desc', 'desk'), ('chairModernCushion', 'chairModernCushion desc', 'chairModernCushion'), ('chairModernFrameCushion', 'chairModernFrameCushion desc', 'chairModernFrameCushion'), ('kitchenMicrowave', 'kitchenMicrowave desc', 'kitchenMicrowave'), ('coatRackStanding', 'coatRackStanding desc', 'coatRackStanding'), ('kitchenSink', 'kitchenSink desc', 'kitchenSink'), ('lampRoundFloor', 'lampRoundFloor desc', 'lampRoundFloor'), ('lampRoundTable', 'lampRoundTable desc', 'lampRoundTable'), ('lampSquareFloor', 'lampSquareFloor desc', 'lampSquareFloor'), ('lampSquareTable', 'lampSquareTable desc', 'lampSquareTable'), ('toaster', 'toaster desc', 'toaster'), ('kitchenStove', 'kitchenStove desc', 'kitchenStove'), ('laptop', 'laptop desc', 'laptop'), ('radio', 'radio desc', 'radio'), ('speaker', 'speaker desc', 'speaker'), ('speakerSmall', 'speakerSmall desc', 'speakerSmall'), ('stoolBar', 'stoolBar desc', 'stoolBar'), ('stoolBarSquare', 'stoolBarSquare desc', 'stoolBarSquare'); 
INSERT INTO `nft_item` (`furnitureId`, `name`, `desc`, `image`) VALUES (1, 'washer coupon', 'washer coupon desc', 'washer'), (2, 'toiletSquare coupon', 'toiletSquare coupon desc', 'toiletSquare'), (3, 'trashcan coupon', 'trashcan coupon desc', 'trashcan'), (4, 'bathroomCabinetDrawer coupon', 'bathroomCabinetDrawer coupon desc', 'bathroomCabinetDrawer'), (5, 'bathtub coupon', 'bathtub coupon desc', 'bathtub'), (6, 'bathroomMirror coupon', 'bathroomMirror coupon desc', 'bathroomMirror'), (7, 'bathroomCabinet coupon', 'bathroomCabinet coupon desc', 'bathroomCabinet'), (8, 'bathroomSink coupon', 'bathroomSink coupon desc', 'bathroomSink'), (9, 'showerRound coupon', 'showerRound coupon desc', 'showerRound'), (10, 'tableCoffee coupon', 'tableCoffee coupon desc', 'tableCoffee'), (11, 'loungeSofaCorner coupon', 'loungeSofaCorner coupon desc', 'loungeSofaCorner'), (12, 'bear coupon', 'bear coupon desc', 'bear'), (13, 'loungeSofaOttoman coupon', 'loungeSofaOttoman coupon desc', 'loungeSofaOttoman'), (14, 'tableCoffeeGlassSquare coupon', 'tableCoffeeGlassSquare coupon desc', 'tableCoffeeGlassSquare'), (15, 'loungeDesignSofaCorner coupon', 'loungeDesignSofaCorner coupon desc', 'loungeDesignSofaCorner'), (16, 'loungeDesignSofa coupon', 'loungeDesignSofa coupon desc', 'loungeDesignSofa'), (17, 'loungeSofa coupon', 'loungeSofa coupon desc', 'loungeSofa'), (18, 'bookcaseOpenLow coupon', 'bookcaseOpenLow coupon desc', 'bookcaseOpenLow'), (19, 'kitchenBar coupon', 'kitchenBar coupon desc', 'kitchenBar'), (20, 'bookcaseClosedWide coupon', 'bookcaseClosedWide coupon desc', 'bookcaseClosedWide'), (21, 'bedSingle coupon', 'bedSingle coupon desc', 'bedSingle'), (22, 'bench coupon', 'bench coupon desc', 'bench'), (23, 'bedDouble coupon', 'bedDouble coupon desc', 'bedDouble'), (24, 'benchCushionLow coupon', 'benchCushionLow coupon desc', 'benchCushionLow'), (25, 'loungeChair coupon', 'loungeChair coupon desc', 'loungeChair'), (26, 'cabinetBedDrawer coupon', 'cabinetBedDrawer coupon desc', 'cabinetBedDrawer'), (27, 'cabinetBedDrawerTable coupon', 'cabinetBedDrawerTable coupon desc', 'cabinetBedDrawerTable'), (28, 'table coupon', 'table coupon desc', 'table'), (29, 'tableCrossCloth coupon', 'tableCrossCloth coupon desc', 'tableCrossCloth'), (30, 'plant coupon', 'plant coupon desc', 'plant'), (31, 'plantSmall coupon', 'plantSmall coupon desc', 'plantSmall'), (32, 'rugRounded coupon', 'rugRounded coupon desc', 'rugRounded'), (33, 'rugRound coupon', 'rugRound coupon desc', 'rugRound'), (34, 'rugSquare coupon', 'rugSquare coupon desc', 'rugSquare'), (35, 'rugRectangle coupon', 'rugRectangle coupon desc', 'rugRectangle'), (36, 'televisionVintage coupon', 'televisionVintage coupon desc', 'televisionVintage'), (37, 'televisionModern coupon', 'televisionModern coupon desc', 'televisionModern'), (38, 'kitchenCabinetCornerRound coupon', 'kitchenCabinetCornerRound coupon desc', 'kitchenCabinetCornerRound'), (39, 'kitchenCabinetCornerInner coupon', 'kitchenCabinetCornerInner coupon desc', 'kitchenCabinetCornerInner'), (40, 'kitchenCabinet coupon', 'kitchenCabinet coupon desc', 'kitchenCabinet'), (41, 'kitchenBlender coupon', 'kitchenBlender coupon desc', 'kitchenBlender'), (42, 'dryer coupon', 'dryer coupon desc', 'dryer'), (43, 'chairCushion coupon', 'chairCushion coupon desc', 'chairCushion'), (44, 'chair coupon', 'chair coupon desc', 'chair'), (45, 'deskComputer coupon', 'deskComputer coupon desc', 'deskComputer'), (46, 'desk coupon', 'desk coupon desc', 'desk'), (47, 'chairModernCushion coupon', 'chairModernCushion coupon desc', 'chairModernCushion'), (48, 'chairModernFrameCushion coupon', 'chairModernFrameCushion coupon desc', 'chairModernFrameCushion'), (49, 'kitchenMicrowave coupon', 'kitchenMicrowave coupon desc', 'kitchenMicrowave'), (50, 'coatRackStanding coupon', 'coatRackStanding coupon desc', 'coatRackStanding'), (51, 'kitchenSink coupon', 'kitchenSink coupon desc', 'kitchenSink'), (52, 'lampRoundFloor coupon', 'lampRoundFloor coupon desc', 'lampRoundFloor'), (53, 'lampRoundTable coupon', 'lampRoundTable coupon desc', 'lampRoundTable'), (54, 'lampSquareFloor coupon', 'lampSquareFloor coupon desc', 'lampSquareFloor'), (55, 'lampSquareTable coupon', 'lampSquareTable coupon desc', 'lampSquareTable'), (56, 'toaster coupon', 'toaster coupon desc', 'toaster'), (57, 'kitchenStove coupon', 'kitchenStove coupon desc', 'kitchenStove'), (58, 'laptop coupon', 'laptop coupon desc', 'laptop'), (59, 'radio coupon', 'radio coupon desc', 'radio'), (60, 'speaker coupon', 'speaker coupon desc', 'speaker'), (61, 'speakerSmall coupon', 'speakerSmall coupon desc', 'speakerSmall'), (62, 'stoolBar coupon', 'stoolBar coupon desc', 'stoolBar'), (63, 'stoolBarSquare coupon', 'stoolBarSquare coupon desc', 'stoolBarSquare'); 

# user는 3개의 가구를 1개씩 가진다. 
INSERT INTO `furniture_count` (`userId`, `furnitureId`, `count`) VALUES (1, 1, 1);
INSERT INTO `furniture_count` (`userId`, `furnitureId`, `count`) VALUES (1, 2, 1);
INSERT INTO `furniture_count` (`userId`, `furnitureId`, `count`) VALUES (1, 3, 1);

# nft transfer pass
# INSERT INTO `nft_transfer` (`nftId`, `fromUserId`, `toUserId`, `date`, `price`) VALUES (1, 1, 2, '2023-12-03 15:15:15', 1);

INSERT INTO `guest_book_comment` (`originUserId`, `userId`, `text`, `createdAt`, `modifiedAt`) VALUES (1, 2, 'hello', '2023-12-03 15:15:15', '2023-12-03 15:15:15');

INSERT INTO `follow` (`targetId`, `userId`) VALUES (1, 2);
INSERT INTO `follow` (`targetId`, `userId`) VALUES (2, 1);


