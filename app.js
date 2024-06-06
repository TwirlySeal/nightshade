chrome.tabs.onCreated.addListener(injector);
chrome.tabs.onUpdated.addListener(injector);

injected = []

function injector(tabId, changeInfo, tab) {
  if (tab.url && tab.url.startsWith("https://canvas.")) {
    if (changeInfo.status !== 'complete') {
      if (!injected.includes(tabId)) {
        chrome.scripting.executeScript({
          target: { tabId: tabId},
          files: ["inject.js"],
          injectImmediately: true
        })
        injected.push(tabId)
        console.log("Injected")
      }
    } else if (changeInfo.status === 'complete') {
      injected = injected.filter(item => item !== tabId);
    }
  }
}