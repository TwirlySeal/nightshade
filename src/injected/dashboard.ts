import { formatDateTime, eventPromise } from "./utils.ts";
import { Course, Announcement } from "./data.ts";

// todo: handle pagination
function fetchAnnouncements(courses: Course[]): Promise<Response> {
  const announcementsRequest = new URL(window.location.origin + "/api/v1/announcements/");
  for (const course of courses) {
    announcementsRequest.searchParams.append(
      "context_codes[]",
      "course_" + course.id,
    );
  }
  return fetch(announcementsRequest);
}

async function resolveCourses(responses: Response[]): Promise<Course[]> {
  const promises = responses.map(resp => resp.json() as Promise<Course[]>);

  const courses: Course[] = [];
  for await (const courseArray of promises) {
    courses.push(...courseArray);
  }

  return courses;
}

function applyCSS(...filePaths: string[]) {
  for (const path of filePaths) {
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.type = "text/css";
    linkElement.href = browser.runtime.getURL(path);
    document.documentElement.appendChild(linkElement);
  }
}

export async function dashboard(coursesPromise: Promise<Response[]>) {
  const domContentLoaded = eventPromise("DOMContentLoaded");
  applyCSS(
    "build/css/global.css",
    "build/css/dashboard.css"
  );
  const courses = await resolveCourses(await coursesPromise);
  console.log(courses);
  const ap = fetchAnnouncements(courses);

  await domContentLoaded;
  console.log("DOMContentLoaded");

  document.querySelector("#right-side-wrapper")!.remove();

  const announcementsPanel = document.createElement("div");
  announcementsPanel.id = "announcements-panel";
  announcementsPanel.className = "dashboard-panel";

  announcementsPanel.innerHTML = `
    <h3>Announcements</h3>
    <template>
      <div class="ns-announcement">
        <div class="ns-header">
          <a class="ns-title"></a>
          <span class="ns-timedate"></span>
        </div>
        <span class="announcement-context"></span>
      </div>
    </template>
  `;
  const template = announcementsPanel.children[1] as HTMLTemplateElement;

  const cIndex = new Map<number, string>();
  for (const course of courses) {
    cIndex.set(course.id, course.name);
  }

  const announcements = await (await ap).json() as Announcement[];
  console.log(announcements);
  for (const a of announcements) {
    const courseId = parseInt(a.context_code.match(/\d+$/)![0]);

    const clone = template.content.cloneNode(true) as DocumentFragment;
    const title = clone.querySelector(".ns-title") as HTMLAnchorElement;
    title.href = a.html_url;
    title.text = a.title;

    clone.querySelector(".ns-timedate")!.textContent = formatDateTime(a.posted_at);
    clone.querySelector(".announcement-context")!.textContent = cIndex.get(courseId)!;

    announcementsPanel.appendChild(clone);
  }

  document.querySelector("#dashboard")!.appendChild(announcementsPanel);

  // todo: assignments and grades panels
}
