const defNetworkCnt = 4;
const defNetworks = [
  {
    name: "Ethereum Mainnet",
    src: "/image/eth_logo.png",
    rpcUrl:
      "https://eth-mainnet.g.alchemy.com/v2/yZVCAfqWyhjsvCfmmV_gpiypONY0MwYv",
    chainId: 1,
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
  },
  {
    name: "Linea Mainnet",
    src: "/image/linea_logo.png",
    rpcUrl: "https://1rpc.io/linea",
    chainId: 59144,
    currency: "ETH",
    explorerUrl: "https://lineascan.build",
  },
  {
    name: "Polygon Mainnet",
    src: "/image/polygon_logo.png",
    rpcUrl:
      "https://polygon-mainnet.g.alchemy.com/v2/5uXiwGkwZjWmK4tLeBiLBsSvC4c5663w",
    chainId: 137,
    currency: "MATIC",
    explorerUrl: "https://polygonscan.com",
  },
  {
    name: "Polygon Mumbai",
    src: "",
    rpcUrl:
      "https://polygon-mumbai.g.alchemy.com/v2/K1bKo7VgILODfuOm3BD6D0GcZO42i7os",
    chainId: 80001,
    currency: "MATIC",
    explorerUrl: "https://mumbai.polygonscan.com",
  },
];

export { defNetworkCnt, defNetworks };
