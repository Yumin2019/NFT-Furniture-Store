/*global chrome*/
import * as bip39 from "bip39";
import { hdkey } from "ethereumjs-wallet";
import { Web3 as web3 } from "web3";

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const infoToast = (toast, text) => {
  toast({
    title: text,
    status: "info",
    isClosable: true,
  });
};

const errorToast = (toast, text) => {
  toast({
    title: text,
    status: "error",
    isClosable: true,
  });
};

const successToast = (toast, text) => {
  toast({
    title: text,
    status: "success",
    isClosable: true,
  });
};

const getQueryParam = () => {
  return window.location.pathname.split("/")[2];
};

const dateToString = (str) => {
  return new Date(str).toLocaleString();
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
};

const isExtension = () => {
  return process.env.REACT_APP_IS_EXTENSION === true;
};

const dialogMaxWidth = "500px";

const printLog = (msg) => {
  if (isExtension()) {
    sendWorkerEvent("logger", msg);
  } else {
    console.log(msg);
  }
};

const sendWorkerEvent = (type, data, callback) => {
  if (isExtension()) {
    try {
      chrome.runtime.sendMessage({ type: type, data: data }, callback);
    } catch (e) {
      printLog(e);
    }
  } else {
    printLog(`sendWorkerEvent(${type}, ${data}, ${callback})`);
  }
};

const showTabOr = (hash, pageCallback) => {
  if (isExtension()) {
    try {
      chrome.tabs.create({ url: `index.html#${hash}` });
    } catch (e) {
      printLog(e);
    }
  } else {
    console.log(`showTab(${hash})`);
    pageCallback();
  }
};

// ex: key: password value: 1234 => password: {password: 1234} (Page) chrome extension => password: 1234
// array를 저장하는 경우에는 자체 규격을 사용하는 것이 아닌 json으로 처리하는 것이 나은데, 처리가 복잡해지는 것 같아 항상 json으로 저장한다.
const saveData = (key, value) => {
  printLog(`setItem key: ${key}`);
  printLog(value);
  let json = {};
  json[key] = value;

  try {
    if (isExtension()) {
      chrome.storage.local.set(json).then(() => {
        printLog({ data: json, msg: "saved" });
      });
    } else {
      let str = JSON.stringify(json);
      localStorage.setItem(key, str);
    }
  } catch (e) {
    printLog(e);
  }
};

const removeData = (key) => {
  printLog(`removeItem key: ${key}`);
  try {
    if (isExtension()) {
      chrome.storage.local.remove(key).then(() => {
        printLog(`key: ${key} removed`);
      });
    } else {
      localStorage.removeItem(key);
    }
  } catch (e) {
    printLog(e);
  }
};

const loadData = async (key) => {
  return new Promise((resolve, reject) => {
    try {
      if (isExtension()) {
        chrome.storage.local.get([key], (result) => {
          resolve(result[key]);
        });
      } else {
        let str = localStorage.getItem(key);
        let json = JSON.parse(str);
        resolve(json[key]);
      }
    } catch (e) {
      printLog(e);
      resolve();
    }
  });
};

const createEtherAccount = async (mnemonic) => {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const rootKey = hdkey.fromMasterSeed(seed);
  const hardenedKey = rootKey.derivePath("m/44'/60'/0'/0");

  let accounts = [];
  for (let i = 0; i < 10; i++) {
    const wallet = hardenedKey.deriveChild(i).getWallet();
    let name = `Account ${i + 1}`;
    let address = `0x${wallet.getAddress().toString("hex")}`;
    let privateKey = `0x${wallet.getPrivateKey().toString("hex")}`;
    accounts.push({ name, address, privateKey, isVisible: i === 0 });
  }

  printLog(accounts);
  return accounts;
};

const createMnemonic = () => {
  return bip39.generateMnemonic();
};

const validateMnemonic = (mnemonic) => {
  return bip39.validateMnemonic(mnemonic);
};

const validateEtherAddress = (address) => {
  return web3.utils.isAddress(address);
};

const validateUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};

const openInNewTab = (url) => {
  window.open(url, "_blank");
};

const truncate = (str, maxlength) => {
  return str.length > maxlength ? str.slice(0, maxlength - 1) + "…" : str;
};

const excludeHttp = (url) => {
  if (url.includes("https://")) {
    return url.substring("https://".length);
  } else if (url.includes("http://")) {
    return url.substring("http://".length);
  }
  return url;
};

export {
  validateEmail,
  getQueryParam,
  dateToString,
  getRandomInt,
  infoToast,
  errorToast,
  successToast,
  dialogMaxWidth,
  sendWorkerEvent,
  printLog,
  isExtension,
  showTabOr,
  saveData,
  removeData,
  loadData,
  createEtherAccount,
  createMnemonic,
  validateMnemonic,
  validateEtherAddress,
  validateUrl,
  truncate,
  excludeHttp,
  openInNewTab,
};
