/*global chrome*/
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

const showTab = (hash, pageCallback) => {
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

// ex: {password: "1234"}
const saveData = (key, value) => {
  if (isExtension()) {
    try {
      let json = {};
      json[key] = value;
      chrome.storage.local.set(json).then(() => {
        sendWorkerEvent("logger", { data: json, msg: "saved" });
      });
    } catch (e) {
      printLog(e);
    }
  } else {
    try {
      console.log(`setItem key: ${key} value: ${value}`);
      localStorage.setItem(key, value);
    } catch (e) {
      printLog(e);
    }
  }
};

const removeData = (key) => {
  if (isExtension()) {
    try {
      chrome.storage.local.remove(key).then(() => {
        printLog(`key: ${key} removed`);
      });
    } catch (e) {
      printLog(e);
    }
  } else {
    try {
      console.log(`removeItem key: ${key}`);
      localStorage.removeItem(key);
    } catch (e) {
      printLog(e);
    }
  }
};

const loadData = async (key) => {
  return new Promise((resolve, reject) => {
    if (isExtension()) {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key]);
      });
    } else {
      resolve(localStorage.getItem(key));
    }
  });
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
  showTab,
  saveData,
  removeData,
  loadData,
};
