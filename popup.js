document.querySelector('#saveButton').addEventListener('click', function() {
    var urlInput = document.querySelector('#urlInput').value;

    if (!urlInput.startsWith("https://")) {
        urlInput = "https://" + urlInput
    }

    if (!urlInput.endsWith("/")) {
        urlInput += "/";
    }

    console.log(urlInput)

    chrome.storage.local.set({ 'canvasURL': urlInput })

    chrome.storage.local.get("canvasURL", (items) => {
        console.log(Object.entries(items)[0][1]);
    });
});