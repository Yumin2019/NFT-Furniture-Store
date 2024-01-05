//수신된 메세지를 백그라운드에서 받음.
console.log("background");

let tabId;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script: " + sender.tab.url
      : "from the extension"
  );

  if (request.type === "logger") {
    console.log(request.data);
  } else if (request.type === "createWallet") {
    chrome.tabs.create({ url: "index.html#createWallet" });
  } else if (request.type === "importWallet") {
    chrome.tabs.create({ url: "popup.html#importWallet" });
  }

  //   if (request.type === "sendTxn") {
  //     sendResponse(true);
  //     prepareSendTxnStorage(request, sender);

  //     tabId = sender.tab.id;
  //   } else if (request.type === "test") {
  //     // send data to client
  //     console.log("코드에서 보낸 메시지");
  //     // sendResponse(true);
  //     console.log(tabId);
  //     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //       chrome.tabs.sendMessage(
  //         tabId,
  //         { type: "test2", response: request.data },
  //         function (response) {
  //           console.log(response);
  //         }
  //       );
  //     });
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

  // // content-script로 메시지를 보낸다.
  // chrome.tabs.sendMessage(
  //   sender.tab.id,
  //   request.data,
  //   function (response) {}
  // );

  // else if (request.type === "getAccount") {
  //   sendResponse(true);
  //   prepareGetAccountStorage(request, sender);
  // } else if (request.type === "getTx") {
  //   sendResponse(true);
  //   prepareGetTxStorage(request, sender);
  // }
  return true;
});
// chrome.runtime.onMessageExternal.addListener(function (
//   request,
//   sender,
//   sendResponse
// ) {
//   if (request) {
//     if (request.message) {
//       if (request.message == "version") {
//         sendResponse({ version: 1.0 });
//       }
//     }
//   }
//   return true;
// });

const prepareSendTxnStorage2 = (request, sender) => {
  var data = request.data;
  var valueString = JSON.stringify(data);

  // content-script로 메시지를 보낸다.
  chrome.tabs.sendMessage(sender.tab.id, request.data, function (response) {});

  // 아직 뭔지 모르겠음.
  // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

  // });
  // console.log(chrome.storage);
  // chrome.storage.local.set({ key: data }).then(() => {
  //   console.log("Value is set");

  //   chrome.windows.create({
  //     url: "popup.html",
  //     type: "popup",
  //     height: 600,
  //     width: 375,
  //   });
  // });
};
const prepareSendTxnStorage = (request, sender) => {
  var data = request.data;
  var valueString = JSON.stringify(data);

  // content-script로 메시지를 보낸다.
  // chrome.tabs.sendMessage(sender.tab.id, request.data, function (response) {});

  // 아직 뭔지 모르겠음.
  // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

  // });
  console.log(chrome.storage);
  chrome.storage.local.set({ key: data }).then(() => {
    console.log("Value is set");

    chrome.windows.create({
      url: "popup.html",
      type: "popup",
      height: 600,
      width: 375,
    });
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
