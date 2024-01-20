console.log("content.js in public folder");

// This message listener will receive response from the background.js
chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
  // This sends response to web app
  console.log(
    "[content_script] chrome.tabs.sendMessage" +
      JSON.stringify(response) +
      " sender" +
      JSON.stringify(sender)
  );

  // 백그라운드에서 처리한 메시지를 클라에게 전송한다.
  if (response.type === "txRes") {
    sendDataToClient(response.type, response);
  } else if (response.type === "accountChanged") {
    sendDataToClient(response.type, response);
  }

  return true;
});

// 웹 사이트에서 메시지를 수신한다. (클라 내부에서 실행된다.)
window.addEventListener("message", async (event) => {
  if (event.source !== window) return;
  console.log(`[content_script] event from webpage: ${event.data.type}`);

  if (event.data.type === "getAccounts") {
    getAccounts();
  } else if (event.data.type === "sendTx") {
    sendDataToBackground("sendTx", event.data.tx);
  }
});

// 계정 정보를 가져와서 클라에 전송한다.
const getAccounts = async () => {
  let idx = (await loadData("accountIdx")) || 0;
  let accountData = (await loadData("accounts")) || [];
  let list = [];

  // visible only, address value only
  accountData.map((v) => {
    if (v.isVisible) {
      list.push(v.address);
    }
  });

  let res = {
    accountIdx: idx,
    list: list,
  };

  console.log(res);
  sendDataToClient("getAccountsRes", res);
};

// background에 데이터를 전송한다.
const sendDataToBackground = (type, data) => {
  let msg = { type: type, data: data };
  console.log("sendDataToBackground");
  console.log(msg);

  chrome.runtime.sendMessage(msg);
};

// 클라이언트에 데이터를 전송한다.
const sendDataToClient = (type, res) => {
  let msg = { type, ...res };
  console.log("sendDataToClient");
  console.log(msg);

  window.postMessage(msg, window.location.origin);
};

// content-script는 익스텐션 스토리지 영역을 같이 사용한다.
const loadData = async (key) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key]);
      });
    } catch (e) {
      console.log(e);
      resolve();
    }
  });
};

// 서비스 실행시 tab id를 등록한다. (백그라운드랑 통신하기 위함)
sendDataToBackground("registerTabId", {});
