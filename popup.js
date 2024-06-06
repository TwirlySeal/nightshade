document.querySelector('#saveButton').addEventListener('click', function() {
    var urlInput = document.querySelector('#urlInput').value;

    if (!urlInput.startsWith("https://")) {
        urlInput = "https://" + urlInput;
    }

    if (!urlInput.endsWith("/")) {
        urlInput += "/";
    }

    chrome.storage.local.set({ 'canvasURL': urlInput });
});