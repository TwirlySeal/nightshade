/* Course search bar */
function applyStylesToHost() {
  var host = document.querySelector("#ajas-search-widget");
  if (host && host.shadowRoot) {
    console.log("Found host");
    clearInterval(checkHostInterval);
    var sheet = new CSSStyleSheet();
    sheet.replaceSync(`
      #ajas-search01 {
        background-color: #242424 !important;
        border: 1px solid #666666 !important;
        color: #FFFFFF !important;
        border-radius: 4px !important;
      }
      
      `);
    console.log(sheet);
    host.shadowRoot.adoptedStyleSheets.push(sheet);
  } else {
    console.log("Waiting for host");
  }
}

var checkHostInterval = setInterval(applyStylesToHost, 100);
