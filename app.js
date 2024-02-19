chrome.tabs.onCreated.addListener(injector);
chrome.tabs.onUpdated.addListener(injector);

function injector(tabId, changeInfo, tab) {
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    if (tab.url && tab.url.includes("canvas")) {
      console.log(tab.url)
      chrome.scripting.executeScript({
        target: { tabId: tabId, allFrames: true },
        files: ["inject.js"],
      })
    }
  });
}