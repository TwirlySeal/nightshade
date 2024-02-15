const cssFiles = [
  'css/dashboard.css',
  'css/courses/home.css',
  'css/courses/announcements.css',
  'css/courses/modules.css',
  'css/courses/notifications.css'
];

cssFiles.forEach(cssFile => {
  const linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.type = 'text/css';
  linkElement.href = chrome.runtime.getURL(cssFile);

  document.head.appendChild(linkElement);
});

/* Course search bar */
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
