/** Get a Promise for a document event */
export function eventPromise(event: string): Promise<undefined> {
  return new Promise((resolve) => {
    document.addEventListener(event, () => {
      resolve(undefined);
    }, { once: true });
  });
}

/** Convert a datetime string in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ) to a readable format */
export function formatDateTime(datetime: string): string {
  return new Date(datetime).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
