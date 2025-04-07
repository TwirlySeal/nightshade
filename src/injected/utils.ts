/** Create a DocumentFragment from a HTML string */
export function htmlFragment(html: string): DocumentFragment {
  const templ = document.createElement('template');
  templ.innerHTML = html;
  return templ.content;
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

/** Get a Promise for a document event */
export function eventPromise(event: string): Promise<undefined> {
  return new Promise(resolve => {
    document.addEventListener(event, () => {
      resolve(undefined);
    }, { once: true });
  });
}

/** Get a Promise for the body element */
export function bodyPromise(): Promise<undefined> {
  return mutationObserverPromise(document.documentElement, (_, resolve) => {
    if (document.body !== null) resolve(undefined);
  });
}

/** Get a Promise for an element that matches a provided CSS selector */
export function elementPromise(parentElement: HTMLElement, selector: string): Promise<HTMLElement> {
  return mutationObserverPromise(parentElement, (mutations, resolve) => {
    for (const mut of mutations) {
      if (mut.type !== 'childList') continue;

      for (const node of mut.addedNodes) {
        if (node?.matches(selector)) {
          resolve(node);
          return;
        }
      }
    }
  });
}

/** Get a Promise for a MutationObserver */
function mutationObserverPromise<T>(
  target: Node,
  mutationHandler: (
    mut: MutationRecord[],
    resolve: (value: T) => void
  ) => void
): Promise<T> {
  return new Promise(resolve => {
    const resolveObserver: MutationCallback = (mut, o) => mutationHandler(mut, (value: T) => {
      o.disconnect();
      resolve(value);
    });

    const o = new MutationObserver(resolveObserver);

    o.observe(target, { childList: true, subtree: true });
  });
}
