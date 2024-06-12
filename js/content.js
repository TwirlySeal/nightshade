async function dashboard(coursesPromise) {
    let dashboardElement

    document.addEventListener("DOMContentLoaded", () => {
        document.querySelector("#right-side-wrapper").remove();
        dashboardElement = document.querySelector("#dashboard");
    });

    const courses = await (await coursesPromise).clone().json();
    let announcementsRequest = new URL(window.location.origin + '/api/v1/announcements/');
    for (const course of courses) {
        announcementsRequest.searchParams.append('context_codes[]', 'course_' + course.id);
    };

    const announcementsPromise = fetch(announcementsRequest);
    
    // Assignments and recent feedback

    const announcements = await (await announcementsPromise).json();

    announcements.forEach((announcement) => {
        const courseId = parseInt(announcement.context_code.split('_')[1]);
        const courseObject = courses.find(course => course.id === courseId);

        announcement.posted_at = new Date(announcement.posted_at).toLocaleDateString('en-US', {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

        announcement.context_code = courseObject.name;
    });

    const announcementsPanel = document.createElement("div");
    announcementsPanel.id = "announcements-panel";
    announcementsPanel.className = "dashboard-panel";
    announcementsPanel.setAttribute('x-data', `{ announcements: ${JSON.stringify(announcements)} }`);
    announcementsPanel.innerHTML = `
        <h3>Announcements</h3>
        <template x-for="announcement in announcements">
            <div class="ns-announcement">
                <div class="ns-header">
                    <a x-bind:href="announcement.html_url" x-text="announcement.title"></a>
                    <span x-text="announcement.posted_at"></span>
                </div>
                <span class="announcement-context" x-text="announcement.context_code"></span>
            </div>
        </template>
    `;

    dashboardElement.appendChild(announcementsPanel);
}

function contentLayout() {
    document.addEventListener("DOMContentLoaded", () => {
        document.querySelector("#left-side").remove();

        // Content
        const main = document.querySelector("#main");
        main.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 40px;
        `;

        document.querySelector("#not_right_side").style.maxWidth = "1200px";
        document.querySelector("#content").style.paddingBottom = "20px";

        // Right Sidebar
        const application = document.querySelector("#application");
        const rightSidebar = document.querySelector("#right-side-wrapper");

        application.appendChild(rightSidebar);

        // Modules sidebar
        pathSegments = window.location.pathname.split('/');

        if (pathSegments[3] === 'modules') {
            const modulesSidebar = document.createElement('div');
            modulesSidebar.id = "modules-sidebar"

            const modules = Array.from(document.querySelector("#context_modules").children);

            const processedModules = modules.map(childElement => {
                return {
                  name: childElement.getAttribute("aria-label"),
                  id: childElement.id
                };
            });

            modulesSidebar.setAttribute('x-data', `{ modules: ${JSON.stringify(processedModules)} }`);

            modulesSidebar.innerHTML = `
                <h4>On this page</h4>
                <template x-for="module in modules">
                    <a x-text="module.name" x-on:click="document.querySelector('#' + module.id).scrollIntoView({ behavior: 'smooth' })"></a>
                </template>
            `;

            main.appendChild(modulesSidebar);
        }
    });
}

function calendar() {
    document.addEventListener("DOMContentLoaded", () => {
        var application = document.querySelector("#application");
        application.style.cssText = `
            grid-template-columns: auto 1fr;
            gap: 0px;
        `;

        var notRightSide = document.querySelector("#not_right_side");
        notRightSide.style.cssText = `
            display: grid;
            grid-template-columns: 300px 1fr;
            height: 100%;
        `;

        rightSidebar = document.querySelector("#right-side-wrapper");
        rightSidebar.style.cssText = `
            grid-column: 1;
            background-color: transparent;
            border-right: 1px solid var(--card-border);
        `;
    });
}

async function coursesSidebar(coursesPromise) {
    // Setup alpine.js
    const alpineScript = document.createElement('script');
    alpineScript.setAttribute('defer', '');
    alpineScript.src = chrome.runtime.getURL("js/alpine.js");
    document.head.appendChild(alpineScript);

    // Setup Material Symbols
    const fontLink = document.createElement('link');
    fontLink.rel = "stylesheet";
    fontLink.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined";
    document.head.appendChild(fontLink);

    const application = document.querySelector("#application");
    application.setAttribute('x-data', '{ sidebar: true }');

    const courseNav = document.createElement("div");
    courseNav.id = "course-nav";
    courseNav.setAttribute('x-show', 'sidebar');
    courseNav.innerHTML = `
        <div id="scroll-wrapper">
            <div class="ns-sidebar-content">
                <h2>Courses</h2>
                <template x-for="course in courses"">
                    <div class="course" x-data="{ open: false }" x-init="() => { if (window.location.pathname.startsWith('/courses/' + course.id)) { open = true; $el.scrollIntoView() } }">
                        <div class="title-box">
                            <button class="toggle" @click="open = ! open">
                                <span class="material-symbols-outlined" x-text="open ? 'arrow_drop_down' : 'arrow_right'"></span>
                            </button>
                            <span class="course-name" x-text="course.name"></span>
                        </div>
                        <div class="tabs" x-show="open" x-data="{ tabs: [] }" x-init="tabs = await (await fetch(window.location.origin + '/api/v1/courses/' + course.id + '/tabs')).json()">
                            <template x-for="tab in tabs">
                                <a x-bind:href="tab.full_url" x-bind:class="{ active: window.location.pathname === '/courses/' + course.id && tab.id === 'home' || window.location.href.startsWith(tab.full_url) && tab.id !== 'home'}" x-text="tab.label"></a>
                            </template>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    `;

    const courses = await (await coursesPromise).clone().json();
    courseNav.setAttribute('x-data', `{ courses: ${JSON.stringify(courses)} }`);

    const wrapper = document.querySelector("#wrapper");
    application.insertBefore(courseNav, wrapper);
}

function navBar() {
    function replaceButton(spec) {
        let newButton = document.createElement('button');
        newButton.className = "nav-button";

        if (spec.type === 'link') {
            newButton.innerHTML = `
                <div class="icon-background"></div>
                <a href="${spec.link}">
                    <span class="material-symbols-outlined">${spec.icon}</span>
                    <span>${spec.label}</span>
                </a>
            `;
        } else {
            newButton.setAttribute("data-target", spec.label.toLowerCase());
            newButton.innerHTML = `
                <div class="icon-background"></div>
                <span class="material-symbols-outlined">${spec.icon}</span>
                <span>${spec.label}</span>
            `;
        }

        if (spec.link === '/') {
            if (window.location.pathname === '/') {
                newButton.classList.add("active");
            }
        } else {
            if (window.location.pathname.startsWith(spec.link)) {
                newButton.classList.add("active");
            }
        }
        
        spec.oldButton.parentElement.replaceChild(newButton, spec.oldButton);
    }

    function modifyButton(spec) {
        const button = spec.button;
        button.className = "nav-button";

        if (window.location.pathname.startsWith(spec.link)) {
            button.classList.add("active");
        }

        const link = button.querySelector('a');
        link.removeAttribute("class");

        const newIcon = document.createElement('span');
        newIcon.className = "material-symbols-outlined";
        newIcon.textContent = spec.icon;

        const icon = button.querySelector('svg');
        icon.parentElement.replaceChild(newIcon, icon);

        const iconBackground = document.createElement('div');
        iconBackground.className = "icon-background";
        link.insertBefore(iconBackground, link.firstChild);
    }

    replaceButton({
        label: "Dashboard",
        icon: "space_dashboard",
        link: "/",
        type: "link",
        oldButton: document.querySelector("#global_nav_dashboard_link").parentElement
    });

    replaceButton({
        label: "Courses",
        icon: "book",
        link: "/courses",
        oldButton: document.querySelector("#global_nav_courses_link").parentElement
    });

    replaceButton({
        label: "Calendar",
        icon: "calendar_month",
        link: "/calendar",
        type: "link",
        oldButton: document.querySelector("#global_nav_calendar_link").parentElement
    });

    replaceButton({
        label: "Inbox",
        icon: "inbox",
        link: "/conversations",
        type: "link",
        oldButton: document.querySelector("#global_nav_conversations_link").parentElement
    });

    modifyButton({
        button: document.querySelector("#global_nav_groups_link").parentElement,
        icon: "groups",
        link: "/groups"
    });

    modifyButton({
        button: document.querySelector("#global_nav_history_link").parentElement,
        icon: "history"
    });

    modifyButton({
        button: document.querySelector("#global_nav_help_link").parentElement,
        icon: "help"
    })

    // Courses button
    const coursesButton = document.querySelector('[data-target="courses"]');
    coursesButton.setAttribute('x-on:click', 'sidebar = ! sidebar');
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

function loading() {
    const overlay = document.createElement("div")
    overlay.style.cssText = `
        background-color: #161216;
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
    linkElement.href = chrome.runtime.getURL("css/main.css");
    document.head.appendChild(linkElement);
}

// Function not used
function elementWait(elementClass, callback) {
    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.toString().includes(elementClass)) {
                        observer.disconnect();
                        callback();
                    }
                });
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function bodyWait() {
    const observer = new MutationObserver(() => {
        if (document.body !== null) {
            observer.disconnect();
            loading();

            coursesPromise = fetch(window.location.origin + '/api/v1/courses/');
            coursesSidebar(coursesPromise);
            navBar();

            document.addEventListener("DOMContentLoaded", insertCSS);
        
            if (window.location.pathname === '/') {
                dashboard(coursesPromise);
            } else if (window.location.pathname.startsWith('/courses') || window.location.pathname.startsWith('/groups') || window.location.pathname.startsWith('/profile')) {
                contentLayout();
            } else if (window.location.pathname.startsWith("/calendar")) {
                calendar;
            }
        }
    });
    
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
}

// Check if Canvas URL
chrome.storage.local.get("canvasURL", (items) => {
    if (window.location.hostname === Object.entries(items)[0][1]) {
        bodyWait()
    }
});