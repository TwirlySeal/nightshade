// deno-lint-ignore-file no-inner-declarations
async function main() {
  const { canvasURL } = await chrome.storage.local.get("canvasURL");
  if (location.hostname !== canvasURL) return;

  bodyPromise().then(loadingOverlay);
  const courseMapPromise = sideNav();

  applyStyleSheet("css/global.css");

  const pathSegments = location.pathname.split('/').slice(1);

  switch (pathSegments[0]) {
    case "":
      await dashboard(courseMapPromise);
      break;
    case "courses":
    case "groups":
    case "profile":
      contentLayout(pathSegments);
      break;

    case "calendar":
      console.log("calendar");
      break;
  }
}
main();

/** @typedef {{
 * id: number,
 * name: string,
 * tabs: {
 *  label: string
 *  full_url: string
 * }[]
}} Course */

/**
 * @returns A Map associating course IDs to names
 */
async function sideNav() {
  /** @type {ReadableStream<Promise<Course[]>>} */
  const stream = paginatedStream(location.origin + "/api/v1/courses?include[]=term&include[]=tabs");

  const container = document.createElement('div');
  container.id = "course-nav";
  const shadowRoot = container.attachShadow({mode: "open"});
  importStyleSheet("css/sidenav-shadow.css").then(s => shadowRoot.adoptedStyleSheets.push(s));
  importStyleSheet("css/reset.css").then(s => shadowRoot.adoptedStyleSheets.push(s));

  {
    const blacklist = new Set(["global_nav_courses_link", "global_nav_groups_link", "global_nav_history_link", "global_nav_help_link"]);

    /** @arg {Element} li */
    function navItem(li, insert) {
      const anchor = li.firstElementChild;
      if (blacklist.has(anchor.id)) return;

      const { textContent } = anchor.querySelector(".menu-item__text");

      // if (e.classList.contains("globalNavExternalTool")) {}

      const link = a(textContent);
      link.href = anchor.href;
      link.className = "nav-item";
      if (li.classList.contains("ic-app-header__menu-list-item--active")) {
        link.classList.add("active");
      }

      insert(link);
    }

    elementPromise(document, ".menu-item__text").then(() => {
      const iter = Iterator.from(document.getElementById("menu").children);
      const first = navItem(iter.next().value, shadowRoot.prepend.bind(shadowRoot));

      iter.forEach(li => navItem(li, shadowRoot.append.bind(shadowRoot)));

      document.getElementById("header").remove();
    });
  }

  /** @type {Map<number, string>} */
  const idMap = new Map();
  for await (const page of stream) {
    for (const course of await page) {
      const { id, name, tabs } = course;
      shadowRoot.append(el('details',
        el('summary', name),
        ...tabs.map(({label, full_url}) =>
          Object.assign(a(label), {href: full_url})
        )
      ));
      idMap.set(id, name);
    }
  }

  document.getElementById("wrapper").before(container);
  dispatchEvent(new Event("ns-loaded"));
  return idMap;
}


function loadingOverlay() {
  document.querySelector("link[rel~='icon']").href = chrome.runtime.getURL("icons/icon32.png"); // set favicon

  const overlay = document.createElement('div');
  overlay.id = "loading-overlay";

  overlay.append( Object.assign( document.createElement('img'), {
    height: 128,
    width: 128,
    src: chrome.runtime.getURL("icons/icon390.png")
  }));
  document.body.append(overlay);

  addEventListener("ns-loaded", () => {
    overlay.remove();
  })
}

/** @typedef {{
 * title: string,
 * created_at: string,
 * html_url: string,
 * course_id?: string
}} ActivityItem */

/** @arg {Promise<Map<number, string>>} courseMapPromise */
async function dashboard(courseMapPromise) {
  applyStyleSheet("css/dashboard.css");

  /** @type {Promise<ActivityItem[]>} */
  const activityPromise = fetch(location.origin + "/api/v1/users/activity_stream?only_active_courses=true").then(r => r.json());
  const styles = importStyleSheet("css/dashboard-shadow.css");
  const reset = importStyleSheet("css/reset.css");

  const ready = elementPromise(document, "#right-side-wrapper").then(e => e.remove());

  const view = Object.assign(div(), {
    className: "dashboard-list"
  });

  const courseMap = await courseMapPromise;

  /** @arg {ActivityItem} */
  function* contents({course_id, title}) {
    if (course_id !== undefined) {
      const e = p(courseMap.get(course_id));
      e.className = "primary";
      yield e;
    }
    yield p(title);
  }

  const items = await activityPromise;

  view.append(...Iterator.from(items).map(item =>
    Object.assign(
      a(...contents(item)), {
        href: item.html_url
      }
    )
  ));

  ready.then(async () => {
    const dashboardElement = document.getElementById("dashboard");
    const root = dashboardElement.attachShadow({ mode: "open" });
    root.append(view);
    root.adoptedStyleSheets.push(
      await reset,
      await styles
    );
  });
}

/** @arg {string[]} pathSegments */
function contentLayout(pathSegments) {
  applyStyleSheet("css/content-layout.css");

  switch (pathSegments[2]) {
    case undefined:
      applyStyleSheet("css/content-layout/home.css");
      break;
    case "modules":
      applyStyleSheet("css/content-layout/ig-list.css");
      break;
    case "pages":
      applyStyleSheet("css/content-layout/page.css");
      break;
    case "assignments":
      applyStyleSheet("css/content-layout/assignments.css");
      applyStyleSheet("css/content-layout/ig-list.css");
      break;
    case "grades":
      applyStyleSheet("css/content-layout/grades.css");
      break;
    case "announcements":
      applyStyleSheet("css/content-layout/announcements.css");
      break;
    case "discussion_topics":
      if (pathSegments[3] === undefined) {
        applyStyleSheet("css/content-layout/discussions.css");
      } else {
        applyStyleSheet("css/content-layout/discussion.css");
      }
      break;
  }
}


/**
 * @arg {string} endpoint
 * @returns {ReadableStream<Promise>}
 */
function paginatedStream(endpoint) {
  return new ReadableStream({
    async start(controller) {
      const regex = /<([^>]+)>; rel="next/i;

      while (true) {
        const resp = await fetch(endpoint);
        controller.enqueue(resp.json())

        const link = resp.headers.get('link');
        if (link == null) break;

        const nextPage = regex.exec(link);
        if (nextPage == null) break;

        endpoint = nextPage[1];
      }

      controller.close();
    }
  });
}

/**
 * @arg {string} filepath
 * @returns {Promise<CSSStyleSheet>}
 */
async function importStyleSheet(filepath) {
  return (await import(
    chrome.runtime.getURL(filepath),
    { with: {type: "css"} }
  )).default;
}

/**
 * Apply a stylesheet globally
 * @arg {string} filepath
 */
async function applyStyleSheet(filepath) {
  document.adoptedStyleSheets.push(
    await importStyleSheet(filepath)
  );
}

/** Get a Promise for the body element
 * @returns {Promise<void>}
 */
function bodyPromise() {
  return mutationObserverPromise(document.documentElement, (_, resolve) => {
    if (document.body !== null) resolve();
  });
}

/** Get a Promise for an element that matches a provided CSS selector
 * @arg {Node} parentElement
 * @arg {string} selector
 * @returns {Promise<HTMLElement>}
 */
function elementPromise(parentElement, selector) {
  return mutationObserverPromise(parentElement, (mutations, resolve) => {
    for (const mut of mutations) {
      if (mut.type !== 'childList') continue;

      for (const node of mut.addedNodes) {
        if (typeof node.matches === 'function' && node.matches(selector)) {
          resolve(node);
          return;
        }
      }
    }
  });
}

/** Get a Promise for a MutationObserver
 * @template T
 * @arg {Node} target
 * @arg {(mut: MutationRecord[], resolve: (value: T) => void) => void} mutationHandler
 * @returns {Promise<T>}
 */
function mutationObserverPromise(target, mutationHandler) {
  return new Promise(resolve => {
    /** @type {MutationCallback} */
    const resolveObserver = (mut, o) => mutationHandler(mut, /** @arg {T} value */ (value) => {
      o.disconnect();
      resolve(value);
    });

    const o = new MutationObserver(resolveObserver);

    o.observe(target, { childList: true, subtree: true });
  });
}

/** @typedef {Node | string} Appendable */

/**
 * @arg {string} tagName
 * @arg {Appendable[]} children
 */
function el(tagName, ...children) {
  const element = document.createElement(tagName);
  element.append(...children);
  return element;
}

/**
 * @arg {Appendable[]} children
 * @returns {HTMLParagraphElement}
 */
function p(...children) {
  return el('p', ...children);
}

/**
 * @arg {Appendable[]} children
 * @returns {HTMLDivElement}
 */
function div(...children) {
  return el('div', ...children);
}

/**
 * @arg {Appendable[]} children
 * @returns {HTMLAnchorElement}
 */
function a(...children) {
  return el('a', ...children);
}
