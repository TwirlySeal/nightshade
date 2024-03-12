function scriptInjector(details) {
  chrome.scripting.executeScript({
    target: { tabId: details.tabId},
    files: ["inject.js"],
    injectImmediately: true
  })
}

chrome.webNavigation.onDOMContentLoaded.addListener(scriptInjector, { url: [{ hostPrefix: 'canvas' }] });