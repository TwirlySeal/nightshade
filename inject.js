if (typeof cssFiles === 'undefined') {
    var cssFiles = [
        "css/dashboard.css",
        "css/courses/home.css",
        "css/courses/announcements.css",
        "css/courses/modules.css",
        "css/courses/notifications.css",
        "css/calendar.css",
      ];
}

cssFiles.forEach((cssFile) => {
  const linkElement = document.createElement("link");
  linkElement.rel = "stylesheet";
  linkElement.type = "text/css";
  linkElement.href = chrome.runtime.getURL(cssFile);

  document.head.appendChild(linkElement);
});

/* Dashboard course search bar */
function applyStylesToHost() {
  var host = document.querySelector("#ajas-search-widget");
  if (host && host.shadowRoot) {
    console.log("Found host");
    clearInterval(checkHostInterval);
    var sheet = new CSSStyleSheet();
    sheet.replaceSync(`
        #ajas-search01 {
          background-color: #242424;
          border: 1px solid #666666;
          color: #FFFFFF;
          border-radius: 4px;
        }
  
        `);
    console.log(sheet);
    host.shadowRoot.adoptedStyleSheets.push(sheet);
  } else {
    console.log("Waiting for host");
  }
}

var checkHostInterval = setInterval(applyStylesToHost, 100);

/* Calendar add event dialog close button */
var element = document.querySelector(
  ".ui-dialog .ui-dialog-titlebar-close span"
);
if (element) {
  element.style.backgroundImage =
    "url(" + chrome.runtime.getURL("assets/icon-x-black-163c6230a4.svg") + ")";
}
