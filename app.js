function scriptInjector(details) {
  chrome.scripting.executeScript({
    target: { tabId: details.tabId },
    files: ["inject.js"],
    injectImmediately: true
  })
}

chrome.webNavigation.onCommitted.addListener(scriptInjector, { url: [{ hostPrefix: 'canvas' }] });