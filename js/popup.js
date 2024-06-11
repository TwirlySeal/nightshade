document.addEventListener('alpine:init', () => {
    Alpine.data('setting', () => ({
        setting: '',

        save() {
            alert("Saved!")
            if (!this.setting.startsWith("https://")) {
                this.setting = "https://" + this.setting;
            }

            if (!this.setting.endsWith("/")) {
                this.setting += "/";
            }

            chrome.storage.local.set({ 'canvasURL': this.setting });
        },

        change(event) {
            this.setting = event.target.value;
        }
    }))
})