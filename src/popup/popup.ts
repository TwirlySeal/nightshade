const button = document.querySelector("#saveButton")!;
const input = document.querySelector("#urlInput") as HTMLInputElement;

button.addEventListener("click", save);

input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    save();
  }
});

function save() {
  let urlInput = input.value;

  if (!urlInput.startsWith("https://")) {
    urlInput = "https://" + urlInput;
  }

  if (!urlInput.endsWith("/")) {
    urlInput += "/";
  }

  const hostname = new URL(urlInput).hostname;

  browser.storage.local.set({ "canvasURL": hostname });
  alert("Saved!");
}
