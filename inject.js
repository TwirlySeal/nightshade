// Insert CSS stylesheet
const linkElement = document.createElement("link");
linkElement.rel = "stylesheet";
linkElement.type = "text/css";
linkElement.href = chrome.runtime.getURL("main.css");
document.head.appendChild(linkElement);

/* Theme for dashboard course search bar */
function applyStylesToHost() {
    var host = document.querySelector("#ajas-search-widget");
    if (host && host.shadowRoot) {
      console.log("Found host");
      clearInterval(checkHostInterval);
      var sheet = new CSSStyleSheet();
      sheet.replaceSync(`
          #ajas-search01 {
            background-color: rgb(60, 60, 60);
            border: 1px solid rgb(70, 70, 70);
            color: #FFFFFF;
            border-radius: 4px;
          }

          .ajas-search-widget--dashboard {
            margin: 0;
          }

          input:-webkit-autofill, input:-webkit-autofill:focus {
            transition: background-color 0s 600000s, color 0s 600000s !important;
          }
    
          `);
      console.log(sheet);
      host.shadowRoot.adoptedStyleSheets.push(sheet);
    } else {
      console.log("Waiting for host");
    }
  }
  
var checkHostInterval = setInterval(applyStylesToHost, 100);

// Adjust grid for planner view
var content = document.querySelector("#content");
if (content.querySelector("#dashboard")) {
    // Move sidebar to dashboard div
    var sidebar = document.querySelector("#right-side-wrapper")
    var dashboard = document.querySelector("#dashboard")
    dashboard.appendChild(sidebar)

    const target = document.querySelector("#right-side-wrapper");

    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            const displayStyle = target.style.display;
            if (displayStyle === 'none') {
                dashboard.style.cssText = `
                grid-template-columns: none;
                gap: 0px;
                `;
            } else {
                dashboard.removeAttribute('style');
            };
            };
        };
    });

    if (target.style.display === "none") {
        dashboard.style.cssText = `
        grid-template-columns: none;
        gap: 0px;
        `;
        document.head.appendChild(linkElement);
    }
    observer.observe(target, { attributes: true });
};

document.head.appendChild(linkElement);

// URL check
var url = new URL(window.location.href);
var path = url.pathname;

if (path.includes('/courses')) {
    document.querySelector(".ic-Layout-watermark").remove();

    // Move navbar to main
    var main = document.querySelector("#main");
    var leftSide = document.querySelector("#left-side");
    var navbar = document.querySelector(".ic-app-nav-toggle-and-crumbs");
    main.insertBefore(navbar, leftSide);

    // Move sidebar to main
    var right = document.querySelector("#not_right_side");
    iframe = right.querySelector("iframe")
    if (iframe) {
        right.style.justifyContent = "center"
    } else {
        while (right.firstChild) {
            console.log(right.firstChild)
            right.parentNode.insertBefore(right.firstChild, right);
        };
    
        right.remove();
    }

    main.style.cssText = `
        margin: 0;
        display: grid;
        grid-template-rows: 80px;
        grid-template-columns: 200px 1fr 300px;
        gap: 20px;
        padding: 20px;
    `;

    navbar.style.cssText = `
        grid-row: 1;
        grid-column: 1 / span 3;
    `;

    leftSide.style.cssText = `
        grid-column: 1;
        grid-row: 2;
        position: static;
        width: auto;
    `;

    document.querySelector("#content-wrapper").style.cssText = `
        grid-column: 2;
        grid-row: 2;
        width: 100%;
        max-width: 1200px;
        justify-self: center;
    `;

    var rightSide = document.querySelector("#right-side-wrapper")
    rightSide.style.cssText = `
        grid-column: 3;
        grid-row: 2;
        position: sticky;
        top: 100px;
    `;

    var segments = path.split('/').filter(segment => segment !== '');

    if (
        segments.length >= 3 &&
        segments[0] === 'courses' &&
        !isNaN(parseInt(segments[1])) &&
        segments[2] !== ''
    ) {
        main.style.gridTemplateColumns = "200px 1fr";
        rightSide.style.display = "none"
    }
} else if (path === '/') {
    // Dashboard
}