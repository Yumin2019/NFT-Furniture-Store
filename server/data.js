const pathfinding = require("pathfinding");

// 가구 기본 정보
const furnitures = {
  washer: {
    name: "washer",
    size: [2, 2],
  },
  toiletSquare: {
    name: "toiletSquare",
    size: [2, 2],
  },
  trashcan: {
    name: "trashcan",
    size: [1, 1],
  },
  bathroomCabinetDrawer: {
    name: "bathroomCabinetDrawer",
    size: [2, 2],
  },
  bathtub: {
    name: "bathtub",
    size: [4, 2],
  },
  bathroomMirror: {
    name: "bathroomMirror",
    size: [2, 1],
    wall: true,
  },
  bathroomCabinet: {
    name: "bathroomCabinet",
    size: [2, 1],
    wall: true,
  },
  bathroomSink: {
    name: "bathroomSink",
    size: [2, 2],
  },
  showerRound: {
    name: "showerRound",
    size: [2, 2],
  },
  tableCoffee: {
    name: "tableCoffee",
    size: [4, 2],
  },
  loungeSofaCorner: {
    name: "loungeSofaCorner",
    size: [5, 5],
  },
  bear: {
    name: "bear",
    size: [2, 1],
    wall: true,
  },
  loungeSofaOttoman: {
    name: "loungeSofaOttoman",
    size: [2, 2],
  },
  tableCoffeeGlassSquare: {
    name: "tableCoffeeGlassSquare",
    size: [2, 2],
  },
  loungeDesignSofaCorner: {
    name: "loungeDesignSofaCorner",
    size: [5, 5],
  },
  loungeDesignSofa: {
    name: "loungeDesignSofa",
    size: [5, 2],
  },
  loungeSofa: {
    name: "loungeSofa",
    size: [5, 2],
  },
  bookcaseOpenLow: {
    name: "bookcaseOpenLow",
    size: [2, 1],
  },
  kitchenBar: {
    name: "kitchenBar",
    size: [2, 1],
  },
  bookcaseClosedWide: {
    name: "bookcaseClosedWide",
    size: [3, 1],
  },
  bedSingle: {
    name: "bedSingle",
    size: [3, 5],
  },
  bench: {
    name: "bench",
    size: [2, 1],
  },
  bedDouble: {
    name: "bedDouble",
    size: [5, 5],
  },
  benchCushionLow: {
    name: "benchCushionLow",
    size: [2, 1],
  },
  loungeChair: {
    name: "loungeChair",
    size: [2, 2],
  },
  cabinetBedDrawer: {
    name: "cabinetBedDrawer",
    size: [1, 1],
  },
  cabinetBedDrawerTable: {
    name: "cabinetBedDrawerTable",
    size: [1, 1],
  },
  table: {
    name: "table",
    size: [4, 2],
  },
  tableCrossCloth: {
    name: "tableCrossCloth",
    size: [4, 2],
  },
  plant: {
    name: "plant",
    size: [1, 1],
  },
  plantSmall: {
    name: "plantSmall",
    size: [1, 1],
  },
  rugRounded: {
    name: "rugRounded",
    size: [6, 4],
    walkable: true,
  },
  rugRound: {
    name: "rugRound",
    size: [4, 4],
    walkable: true,
  },
  rugSquare: {
    name: "rugSquare",
    size: [4, 4],
    walkable: true,
  },
  rugRectangle: {
    name: "rugRectangle",
    size: [8, 4],
    walkable: true,
  },
  televisionVintage: {
    name: "televisionVintage",
    size: [4, 2],
  },
  televisionModern: {
    name: "televisionModern",
    size: [4, 2],
  },
  kitchenCabinetCornerRound: {
    name: "kitchenCabinetCornerRound",
    size: [2, 2],
  },
  kitchenCabinetCornerInner: {
    name: "kitchenCabinetCornerInner",
    size: [2, 2],
  },
  kitchenCabinet: {
    name: "kitchenCabinet",
    size: [2, 2],
  },
  kitchenBlender: {
    name: "kitchenBlender",
    size: [1, 1],
  },
  dryer: {
    name: "dryer",
    size: [2, 2],
  },
  chairCushion: {
    name: "chairCushion",
    size: [1, 1],
  },
  chair: {
    name: "chair",
    size: [1, 1],
  },
  deskComputer: {
    name: "deskComputer",
    size: [3, 2],
  },
  desk: {
    name: "desk",
    size: [3, 2],
  },
  chairModernCushion: {
    name: "chairModernCushion",
    size: [1, 1],
  },
  chairModernFrameCushion: {
    name: "chairModernFrameCushion",
    size: [1, 1],
  },
  kitchenMicrowave: {
    name: "kitchenMicrowave",
    size: [1, 1],
  },
  coatRackStanding: {
    name: "coatRackStanding",
    size: [1, 1],
  },
  kitchenSink: {
    name: "kitchenSink",
    size: [2, 2],
  },
  lampRoundFloor: {
    name: "lampRoundFloor",
    size: [1, 1],
  },
  lampRoundTable: {
    name: "lampRoundTable",
    size: [1, 1],
  },
  lampSquareFloor: {
    name: "lampSquareFloor",
    size: [1, 1],
  },
  lampSquareTable: {
    name: "lampSquareTable",
    size: [1, 1],
  },
  toaster: {
    name: "toaster",
    size: [1, 1],
  },
  kitchenStove: {
    name: "kitchenStove",
    size: [2, 2],
  },
  laptop: {
    name: "laptop",
    size: [1, 1],
  },
  radio: {
    name: "radio",
    size: [1, 1],
  },
  speaker: {
    name: "speaker",
    size: [1, 1],
  },
  speakerSmall: {
    name: "speakerSmall",
    size: [1, 1],
  },
  stoolBar: {
    name: "stoolBar",
    size: [1, 1],
  },
  stoolBarSquare: {
    name: "stoolBarSquare",
    size: [1, 1],
  },
};

// let query = "INSERT INTO `furniture` (`name`, `desc`, `image`) VALUES ";
// let query2 =
//   "INSERT INTO `nft_item` (`furnitureId`, `name`, `desc`, `image`) VALUES ";

// Object.values(furnitures).map((v, index) => {
//   query += `('${v.name}', '${v.name} desc', '${v.name}'), `;
//   query2 += `(${index + 1}, '${v.name} coupon', '${v.name} coupon desc', '${
//     v.name
//   }'), `;
// });

// console.log(query);
// console.log(query2);

// 초기 맵 정보와 초기 grid 정보
const getDefaultMap = () => {
  return {
    size: [10, 10],
    gridDivision: 2,
    items: [],
  };
};

const getDefaultGrid = () => {
  // size * gridDivision
  return new pathfinding.Grid(10 * 2, 10 * 2);
};

const defItems = [
  {
    ...furnitures.showerRound,
    gridPosition: [0, 0],
  },
  {
    ...furnitures.toiletSquare,
    gridPosition: [0, 3],
    rotation: 1,
  },
  {
    ...furnitures.washer,
    gridPosition: [5, 0],
  },
  {
    ...furnitures.bathroomSink,
    gridPosition: [7, 0],
  },
  {
    ...furnitures.trashcan,
    gridPosition: [0, 5],
    rotation: 1,
  },
  {
    ...furnitures.bathroomCabinetDrawer,
    gridPosition: [3, 0],
  },
  {
    ...furnitures.bathtub,
    gridPosition: [4, 4],
  },
  {
    ...furnitures.bathtub,
    gridPosition: [0, 8],
    rotation: 3,
  },
  {
    ...furnitures.bathroomCabinet,
    gridPosition: [3, 0],
  },
  {
    ...furnitures.bathroomMirror,
    gridPosition: [0, 8],
    rotation: 1,
  },
  {
    ...furnitures.bathroomMirror,
    gridPosition: [, 10],
    rotation: 1,
  },
  {
    ...furnitures.tableCoffee,
    gridPosition: [10, 8],
  },
  {
    ...furnitures.rugRectangle,
    gridPosition: [8, 7],
  },
  {
    ...furnitures.loungeSofaCorner,
    gridPosition: [6, 10],
  },
  {
    ...furnitures.bear,
    gridPosition: [0, 3],
    rotation: 1,
  },
  {
    ...furnitures.plant,
    gridPosition: [11, 13],
  },
  {
    ...furnitures.cabinetBedDrawerTable,
    gridPosition: [13, 19],
  },
  {
    ...furnitures.cabinetBedDrawer,
    gridPosition: [19, 19],
  },
  {
    ...furnitures.bedDouble,
    gridPosition: [14, 15],
  },
  {
    ...furnitures.bookcaseClosedWide,
    gridPosition: [12, 0],
    rotation: 2,
  },
  {
    ...furnitures.speaker,
    gridPosition: [11, 0],
  },
  {
    ...furnitures.speakerSmall,
    gridPosition: [15, 0],
  },
  {
    ...furnitures.loungeChair,
    gridPosition: [10, 4],
  },
  {
    ...furnitures.loungeSofaOttoman,
    gridPosition: [14, 4],
  },
  {
    ...furnitures.loungeDesignSofa,
    gridPosition: [18, 0],
    rotation: 1,
  },
  {
    ...furnitures.kitchenCabinetCornerRound,
    gridPosition: [2, 18],
    rotation: 2,
  },
  {
    ...furnitures.kitchenCabinetCornerInner,
    gridPosition: [0, 18],
    rotation: 2,
  },
  {
    ...furnitures.kitchenStove,
    gridPosition: [0, 16],
    rotation: 1,
  },
  {
    ...furnitures.dryer,
    gridPosition: [0, 14],
    rotation: 1,
  },
  {
    ...furnitures.lampRoundFloor,
    gridPosition: [0, 12],
  },
];

module.exports = {
  furnitures,
  getDefaultGrid,
  getDefaultMap,
};
