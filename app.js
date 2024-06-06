var listenerActive = false

function scriptInjector(details) {
  chrome.scripting.executeScript({
    target: { tabId: details.tabId },
    files: ["inject.js"],
    injectImmediately: true
  });
}

function startListener(canvasHost) {
  console.log("lisnr init")
  chrome.webNavigation.onCommitted.addListener(scriptInjector, { url: [{ hostEquals: canvasHost }] }
  );
  listenerActive = true
}

function restartListener() {
  if (listenerActive === true) {
    console.log("lisnr restart")
    chrome.webNavigation.onCommitted.removeListener(scriptInjector);
    listenerActive = false
  }
}

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get("canvasURL", (items) => {
    startListener(new URL(Object.entries(items)[0][1]).hostname)
  });
});

chrome.storage.onChanged.addListener(function(changes) {
  if (Object.keys(changes)[0] === "canvasURL") {
    restartListener()
    startListener(new URL(Object.entries(changes)[0][1]["newValue"]).hostname)
  }
});

restartListener()
chrome.storage.local.get("canvasURL", (items) => {
  startListener(new URL(Object.entries(items)[0][1]).hostname)
});