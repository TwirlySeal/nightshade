import { dashboard } from "./dashboard.ts";

/**
    The content script runs immediately such that the body element is initially equal to
    null and attempted DOM manipulations at this time result in unpredictable behaviour.

    Routes can use the bodyWait() function for logic that involves the DOM to avoid this.
    Logic that does not involve the DOM such as API requests should be placed before
    bodyWait() for optimal loading times.

    Canvas also inserts content dynamically during page loading, meaning elements
    manipulated by routes may not be immediately present which can cause errors. Routes
    can wait for a specific element to appear using elementWait() or listen to events
    such as DOMContentLoaded, load, or readystatechange.

    [DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event)

    [load](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event)

    [readystatechange](https://developer.mozilla.org/en-US/docs/Web/API/Document/readystatechange_event)

    - Each route should call a single function to centralise its control flow
    - Extract common logic such as CSS injection or API requests into separate functions to be reused across multiple routes
*/
async function main() {
  const urlSetting = (await browser.storage.local.get("canvasURL")).canvasURL;
  if (window.location.hostname != urlSetting) {
    return;
  }

  const coursesPromise = fetchCourses();
  const pathSegments = window.location.pathname.split("/");
  switch (pathSegments[1]) {
    case "":
      return dashboard(coursesPromise);

    case "courses":
    case "groups":
    case "profile":
      return console.log("content layout");

    case "calendar":
      return console.log("calendar");
  }
}

main();

async function fetchCourses(): Promise<Response[]> {
  let url = window.location.origin + "/api/v1/courses?include[]=term&include[]=tabs";
  const regex = /<([^>]+)>; rel="next/i;
  const courses: Response[] = [];

  while (true) {
    const resp = await fetch(url);
    courses.push(resp);

    const link = resp.headers.get('link');
    if (link == null) break;

    const nextPage = regex.exec(link);
    if (nextPage == null) break;

    url = nextPage[1];
  }

  return courses;
}
