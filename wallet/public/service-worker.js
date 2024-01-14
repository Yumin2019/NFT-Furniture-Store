console.log("background");
chrome.action.setBadgeBackgroundColor({ color: "#5fffcc" });

let tabId;
let windowId = -1;

// 익스텐션과 컨텐츠 스크립트에서 온 메시지를 처리한다.
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
  } else if (request.type === "txRes") {
    // 익스텐션에서 보낸 데이터 전달
    sendDataToContent(tabId, request);
  } else if (request.type === "closeWindow" && !sender.tab) {
    // 익스텐션을 킨 경우에 기존 팝업을 없앤다.
    let existsWindow = await isWindow();
    if (existsWindow) {
      chrome.windows.remove(windowId);
      windowId = -1;
      console.log("removed");
    }
  } else if (request.type === "sendTx") {
    // 컨텐츠 스크립트에서 받은 메시지를 처리한다.
    tabId = sender.tab.id;
    saveSendTx(request, sender);
  }

  return true;
});

const saveSendTx = async (request, sender) => {
  let tx = request.data;
  console.log(tx);

  // transaction 정보를 저장하고 팝업을 띄운다.
  let transactions = (await loadData("transactions")) || [];
  let list = [tx, ...transactions];
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
    });

    console.log(window);
    windowId = window.id;
    console.log("created window");
  } else {
    chrome.windows.update(windowId, {});
    console.log("updated window");
  }
};

// windowId 값에 따른 윈도우 존재 여부
const isWindow = async () => {
  let getAll = await chrome.windows.getAll();
  console.log(getAll);

  for (let i = 0; i < getAll.length; ++i) {
    if (getAll[i].id === windowId) return true;
  }

  return false;
};

// content-script로 메시지를 보낸다.
const sendDataToContent = (tabId, request) => {
  console.log("sendDataToContent");
  console.log(request);
  chrome.tabs.sendMessage(tabId, { type: request.type, data: request.data });
};

// background 전용 local storage 접근용 함수
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
