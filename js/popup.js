const button = document.querySelector('#saveButton');
const input = document.querySelector('#urlInput');
const canvasUrlList = document.querySelector('#canvasUrlList');

button.addEventListener('click', save);

input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      save();
    }
});

// create dynamic canvasURL list display from chrome.storage.local
chrome.storage.local.get("canvasURL", (items) => {
    const list = document.querySelector('#canvasUrlList');
    for (const l of items.canvasURL) {
        const container = document.createElement('div');
        container.style = "display: flex; align-items: center; gap: 4px;"
        const newText = document.createElement('span');
        newText.textContent = l.url 
        const newToggle = document.createElement('input');
        newToggle.style = "width: 16px; margin-right: 24px;"
        newToggle.type = "checkbox"
        newToggle.checked = l.active;
        newToggle.addEventListener('click', function() {
            chrome.storage.local.get("canvasURL", (items) => {
                const index = items.canvasURL.findIndex(v => v.url === l.url)
                const newList = [...items.canvasURL]
                newList.splice(index,1,{url:l.url, active: !l.active})
                chrome.storage.local.set({ 'canvasURL': newList });
                alert("Toggled!");
            });
        })
        const removeButton = document.createElement('button');
        removeButton.textContent = "remove"
        removeButton.addEventListener('click', function() {
            chrome.storage.local.get("canvasURL", (items) => {
                chrome.storage.local.set({ 'canvasURL': items.canvasURL.filter(v => v.url !== l.url) });
                alert("Removed!");
            });
        })

        container.appendChild(newText);
        container.appendChild(newToggle);
        container.appendChild(removeButton);
        list.appendChild(container);
    }
});

function save() {
    let urlInput = input.value;

    if (!urlInput.startsWith("https://")) {
        urlInput = "https://" + urlInput;
    }

    if (!urlInput.endsWith("/")) {
        urlInput += "/";
    }

    const hostname = new URL(urlInput).hostname;

    chrome.storage.local.get("canvasURL", (items) => {
        chrome.storage.local.set({ 'canvasURL': [...items.canvasURL, { url:hostname, active: true}] });
        alert("Saved!");
    });

}