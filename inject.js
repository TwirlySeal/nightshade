// Insert CSS stylesheet
function insertCSS() {
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.type = "text/css";
    linkElement.href = chrome.runtime.getURL("main.css");
    document.head.appendChild(linkElement);
}

/* Theme for dashboard course search bar */
function searchStyles() {
    const host = document.querySelector("#ajas-search-widget");
    if (host && host.shadowRoot) {
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
      host.shadowRoot.adoptedStyleSheets.push(sheet);
    }
}
  
var checkHostInterval = setInterval(searchStyles, 100);

function dashboard() {
    // Move sidebar to dashboard div
    var content = document.querySelector("#content");
    var sidebar = document.querySelector("#right-side-wrapper")
    var dashboard = document.querySelector("#dashboard")
    dashboard.appendChild(sidebar)

    // Adjust grid for planner view
    var target = document.querySelector("#right-side-wrapper");
    var observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            var displayStyle = target.style.display;
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
        insertCSS()
    }
    observer.observe(target, { attributes: true });
}

function contentLayout() {
    // Remove watermark
    var watermark = document.querySelector(".ic-Layout-watermark")
    if (watermark) {
        watermark.remove();
    }

    // Move navbar to main
    var main = document.querySelector("#main");
    var leftSide = document.querySelector("#left-side");
    var navbar = document.querySelector(".ic-app-nav-toggle-and-crumbs");
    main.insertBefore(navbar, leftSide);

    // Move sidebar to main
    var right = document.querySelector("#not_right_side");
    if (right) {
        var iframe = right.querySelector("iframe")
        if (iframe) {
            right.style.justifyContent = "center"
        } else {
            while (right.firstChild) {
                right.parentNode.insertBefore(right.firstChild, right);
            };
        
            right.remove();
        }
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
        segments[2] !== '' ||
        segments.length >= 3 &&
        segments[0] === 'groups' &&
        !isNaN(parseInt(segments[1])) &&
        segments[2] !== '' ||
        segments[0] === 'profile'
    ) {
        main.style.gridTemplateColumns = "200px 1fr";
        rightSide.style.display = "none"

        if (segments.length >= 4 && segments[2] === 'discussion_topics') {
            // Discussion page
        }
    }
}

function calendar() {
    var calendar_container = document.querySelector("#not_right_side")
    calendar_container.style.cssText = `
        display: grid;
        grid-template-columns: 300px 1fr;
        grid-template-rows: 80px 1fr;
        padding: 20px;
        gap: 20px;
        max-height: 100vh;
    `

    var sidebar = document.querySelector("#right-side-wrapper")
    sidebar.style.cssText = `
        grid-column: 1;
        grid-row: 2;
        overflow: scroll;
        height: 100%;
    `

    var calendar_header = document.querySelector("#calendar_header")
    calendar_container.appendChild(calendar_header)
    calendar_header.style.cssText = `
        grid-column: 1 / span 2;
        grid-row: 1;
    `

    /* Calendar add event dialog close button */
    var element = document.querySelector(
        ".ui-dialog .ui-dialog-titlebar-close span"
    );
    if (element) {
        element.style.backgroundImage =
        "url(" + chrome.runtime.getURL("assets/icon-x-black-163c6230a4.svg") + ")";
    }
}

// URL check
var url = new URL(window.location.href);
var path = url.pathname;

if (path === '/') {
    dashboard()
} else if (path.includes('/courses') || path.includes('/groups') || path.includes('/profile')) {
    contentLayout()
} else if (path.startsWith("/calendar")) {
    calendar()
}
insertCSS()