const linkElement = document.createElement("link");
linkElement.rel = "stylesheet";
linkElement.type = "text/css";
linkElement.href = chrome.runtime.getURL("main.css");
document.head.appendChild(linkElement);

var sidebar = document.querySelector("#right-side-wrapper")
var dashboard = document.querySelector("#dashboard")

dashboard.appendChild(sidebar)