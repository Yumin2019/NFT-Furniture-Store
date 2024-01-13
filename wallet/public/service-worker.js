console.log("background");
chrome.action.setBadgeBackgroundColor({ color: "#5fffcc" });

let tabId;
chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  console.log(
    sender.tab
      ? "from a content script: " + sender.tab.url
      : "from the extension"
  );

  if (request.type === "logger") {
    console.log(request.data);
  } else if (request.type === "closeWindow" && !sender.tab) {
    // 익스텐션을 킨 경우에 기존 팝업을 없앤다.
    let existsWindow = await isWindow();
    if (existsWindow) {
      chrome.windows.remove(windowId);
      windowId = -1;
      console.log("removed");
    }
  } else if (request.type === "sendTx") {
    tabId = sender.tab.id;
    sendResponse(true);
    saveSendTx(request, sender);
  }

  // else if (request.type === "test") {
  //   // send data to client
  //   console.log("코드에서 보낸 메시지");
  //   // sendResponse(true);
  //   console.log(tabId);
  //   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //     chrome.tabs.sendMessage(
  //       tabId,
  //       { type: "test2", response: request.data },
  //       function (response) {
  //         console.log(response);
  //       }
  //     );
  //   });
  // }

  // chrome.tabs.sendMessage(
  //   sender.tab.id,
  //   request.data,
  //   function (response) {}
  // );

  // sendResponse(true);
  // prepareSendTxnStorage2(request, sender);

  // content-script로 메시지를 보낸다.
  // chrome.tabs.sendMessage(sender.tab.id, request.data, function (response) {});

  // code to content and then
  // var data = request.data;
  // var valueString = JSON.stringify(data);

  // else if (request.type === "getAccount") {
  //   sendResponse(true);
  //   prepareGetAccountStorage(request, sender);
  // } else if (request.type === "getTx") {
  //   sendResponse(true);
  //   prepareGetTxStorage(request, sender);
  // }
  return true;
});

let windowId = -1;
const saveSendTx = async (request, sender) => {
  let tx = request.data;
  console.log(tx);

  // transaction 정보를 저장하고 팝업을 띄운다.
  let transactions = (await loadData("transactions")) || [];
  let list = [tx]; //  ...transactions
  await saveData("transactions", list);

  // 익스텐션 뱃지 텍스트 처리
  chrome.action.setBadgeText({ text: list.length.toString() });

  let existsWindow = await isWindow();
  if (!existsWindow) {
    let window = await chrome.windows.create({
      url: "index.html",
      type: "popup",
      width: 375,
      height: 575,
      focused: true,
    });

    console.log(window);
    windowId = window.id;
    console.log("created window");
  } else {
    chrome.windows.update(windowId, {});
    console.log("updated window");
  }
};

const isWindow = async () => {
  let getAll = await chrome.windows.getAll();
  console.log(getAll);

  for (let i = 0; i < getAll.length; ++i) {
    if (getAll[i].id === windowId) return true;
  }

  return false;
};

// content-script로 메시지를 보낸다.
// chrome.tabs.sendMessage(sender.tab.id, request.data, function (response) {});

const saveData = async (key, value) => {
  console.log(`setItem key: ${key}`);
  console.log(value);
  let json = {};
  json[key] = value;

  try {
    await chrome.storage.local.set(json);
    console.log({ data: json, msg: "saved" });
  } catch (e) {
    console.log(e);
  }
};

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

// const prepareGetAccountStorage = (request, sender) => {
//   var data = request.data;
//   var domainName = data.domain;
//   var valueString = JSON.stringify({
//     domain: domainName,
//     tabId: sender.tab.id,
//   });
//   chrome.storage.local.set({ getAccount: valueString }, function () {
//     chrome.windows.create({
//       url: "index.html",
//       type: "popup",
//       height: 600,
//       width: 375,
//     });
//   });
// };
// const prepareGetTxStorage = (request, sender) => {
//   var data = request.data;
//   var domainName = data.domain;
//   var address = data.address;
//   var valueString = JSON.stringify({
//     domain: domainName,
//     tabId: sender.tab.id,
//     address: address,
//   });
//   chrome.storage.local.set({ getTx: valueString }, function () {
//     chrome.windows.create({
//       url: "index.html",
//       type: "popup",
//       height: 600,
//       width: 375,
//     });
//   });
// };
