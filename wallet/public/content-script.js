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

  if (response.type === "test") {
    window.postMessage(
      { type: "testReturn", response },
      window.location.origin
    );
  } else if (response.type === "test2") {
    window.postMessage(
      { type: "testReturn", response },
      window.location.origin
    );
  }

  //   if (response.type == "getAccount") {
  //     window.postMessage(
  //       { type: "UNICORN_WALLET_ACCOUNT_RETURN", response: response.address },
  //       window.location.origin
  //     );
  //   } else if (response.type == "getTx") {
  //     window.postMessage(
  //       { type: "UNICORN_WALLET_TX_RETURN", response: response },
  //       window.location.origin
  //     );
  //   }
  return true;
});

// 웹 사이트에서 메시지를 수신한다. (클라 내부에서 실행된다.)
window.addEventListener("message", async (event) => {
  if (event.source !== window) return;
  console.log(`[content_script] event from webpage: ${event.data.type}`);

  // 계정 정보를 전달한다.
  if (event.data.type === "getAccounts") {
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
  } else if (event.data.type === "sendTx") {
    sendDataToBackground("sendTx", event.data.tx);
  }

  // 테스트
  if (event.data.type === "test") {
    chrome.runtime.sendMessage(
      { type: "sendTx", data: event.data },
      (response) => {
        console.log(`[content_script]  ${response} from background`);
      }
    );
  }
});

// //웹사이트로부터 메세지 수신
// window.addEventListener(
//   "message",
//   (event) => {
//     if (event.source != window) {
//       return;
//     }
//     if (event.data.type && event.data.type == "UNICORN_WALLET_SEND") {
//       chrome.runtime.sendMessage(
//         { type: "sendTxn", data: event.data },
//         function (response) {
//           console.log("from background" + response);
//         }
//       );
//     } else if (event.data.type && event.data.type == "UNICORN_WALLET_ACCOUNT") {
//       console.log("Content script received: " + event.data.type);
//       chrome.runtime.sendMessage(
//         { type: "getAccount", data: event.data },
//         function (response) {
//           console.log("from background" + response);
//         }
//       );
//     } else if (event.data.type && event.data.type == "UNICORN_WALLET_TX") {
//       console.log("Content script received: " + event.data.type);
//       chrome.runtime.sendMessage(
//         { type: "getTx", data: event.data },
//         function (response) {
//           console.log("from background" + response);
//         }
//       );
//     }
//   },
//   false
// );

const sendDataToBackground = (type, data) => {
  chrome.runtime.sendMessage({ type: type, data: data }, (response) => {
    console.log("from background " + response);
  });
};

const sendDataToClient = (type, res) => {
  window.postMessage({ type, ...res }, window.location.origin);
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
