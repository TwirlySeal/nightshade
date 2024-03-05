chrome.tabs.onCreated.addListener(injector);
chrome.tabs.onUpdated.addListener(injector);

function injector(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    if (tab.url && tab.url.startsWith("https://canvas.")) {
      chrome.scripting.executeScript({
        target: { tabId: tabId},
        files: ["inject.js"],
    })
    }
  }
}