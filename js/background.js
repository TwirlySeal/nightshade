var listenerActive = false;

function injectContentScript(details) {
    console.log("Inject function ran")
    chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ["js/content.js"],
        injectImmediately: true,
    });
}

function startListener(canvasHost) {
    console.log("lisnr init");
    chrome.webNavigation.onCommitted.addListener(injectContentScript, {
        url: [{ hostEquals: canvasHost }],
    });
    listenerActive = true;
}

function removeListener() {
    if (listenerActive === true) {
        console.log("lisnr restart");
        chrome.webNavigation.onCommitted.removeListener(injectContentScript);
        listenerActive = false;
    }
}

removeListener();

chrome.storage.local.get("canvasURL", (items) => {
  startListener(Object.entries(items)[0][1]);
});

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.get("canvasURL", (items) => {
        startListener(Object.entries(items)[0][1]);
    });
});

chrome.storage.onChanged.addListener(function (changes) {
    if (Object.keys(changes)[0] === "canvasURL") {
        removeListener();
        startListener(Object.entries(changes)[0][1]["newValue"]);
    }
});

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        chrome.tabs.create({
            url: "popup.html"
        });
    }
});