function loading() {
    const overlay = document.createElement("div")
    overlay.style.cssText = `
        background-color: #1c1c1c;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 100;
        position: fixed;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    `
    overlay.id = "loading-overlay"
    document.body.appendChild(overlay)

    const icon = document.createElement("img")
    icon.height = "128"
    icon.width = "128"
    icon.src = chrome.runtime.getURL("icons/icon390.png")
    overlay.appendChild(icon)

    document.addEventListener("readystatechange", function() {
        if (document.readyState === "complete") {
            overlay.remove()
            searchBar()
            document.removeEventListener("readystatechange", this);
        }
    });
}

function insertCSS() {
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.type = "text/css";
    linkElement.href = chrome.runtime.getURL("main.css");
    document.head.appendChild(linkElement);
}

function elementWait(id, callback) {
    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.id === id) {
                        observer.disconnect();
                        callback();
                    }
                });
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function searchBar() {
    const host = document.querySelector('#ajas-search-widget');
    if (host) {
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

function dashboard() {
    // Move right sidebar to application
    application = document.querySelector("#application");
    rightSidebar = document.querySelector("#right-side-wrapper");
    application.appendChild(rightSidebar);

    // Toggle sidebar column for planner view
    wrapper = document.querySelector("#wrapper");

    if (rightSidebar.style.display === "none") {
        application.style.gridTemplateColumns = "auto 1fr"
        document.querySelector("#wrapper").style.paddingRight = "20px";
    }

    const observer2 = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                var displayStyle = rightSidebar.style.display;
                if (displayStyle === 'none') {
                    application.style.gridTemplateColumns = "auto 1fr";
                    wrapper.style.paddingRight = "20px";
                } else {
                    application.removeAttribute('style');

                };
            };
        };
    });
    
    observer2.observe(rightSidebar, { attributes: true });
}

function contentLayout() {
    // Grid
    wrapper = document.querySelector("#wrapper");
    wrapper.style.cssText = `
        display: grid;
        grid-template-rows: 80px 1fr;
        grid-template-columns: 200px 1fr;
    `

    // Content
    main = document.querySelector("#main");
    main.style.cssText = `
        overflow: auto;
        display: flex;
        justify-content: center;
    `;

    document.querySelector("#not_right_side").style.maxWidth = "1200px";
    document.querySelector("#content").style.paddingBottom = "20px";

    // Left Sidebar
    leftSidebar = document.querySelector("#left-side");
    wrapper.insertBefore(leftSidebar, main);

    // Right Sidebar
    application = document.querySelector("#application");
    rightSidebar = document.querySelector("#right-side-wrapper");

    if (window.getComputedStyle(rightSidebar).getPropertyValue('display') === "block") {
        application.appendChild(rightSidebar);
    } else {
        application.style.gridTemplateColumns = "auto 1fr"
        wrapper.style.paddingRight = "20px"
    }
}

function calendar() {
    // c
}

// Apply themes to pages
function themer() {
    insertCSS()
    
    const url = new URL(window.location.href);
    const path = url.pathname;

    if (path === '/') {
        dashboard()
    } else if (path.startsWith('/courses') || path.startsWith('/groups') || path.startsWith('/profile')) {
        contentLayout()
    } else if (path.startsWith("/calendar")) {
        calendar()
    }
}

// Wait for body element
function bodyWait() {
    const observer = new MutationObserver(() => {
        if (document.body !== null) {
            observer.disconnect();
            loading()
            document.addEventListener("DOMContentLoaded", themer)
        }
    });
    
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
}

// Check if Canvas URL
var currentUrl = window.location.hostname
chrome.storage.local.get("canvasURL", (items) => {
    if (currentUrl === new URL(Object.entries(items)[0][1]).hostname) {
        bodyWait()
    }
});