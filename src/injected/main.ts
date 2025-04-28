import { dashboard } from "./dashboard.ts";

async function main() {
  const urlSetting = (await browser.storage.local.get("canvasURL")).canvasURL;
  if (window.location.hostname != urlSetting) return;

  const coursesPromise = fetchCourses();

  const contentLayout = () => console.log("content layout");
  const routes = {
    "": () => dashboard(coursesPromise),

    "courses": contentLayout,
    "groups": contentLayout,
    "profile": contentLayout,

    "calendar": () => console.log("calendar")
  }

  const firstPathSegment = /\/([^/]*)/.exec(location.pathname)![1] as keyof typeof routes;
  return routes[firstPathSegment]();
}

main();

async function fetchCourses(): Promise<Response[]> {
  let url = location.origin + "/api/v1/courses?include[]=term&include[]=tabs";
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
