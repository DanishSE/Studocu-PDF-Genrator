# 🛠 STUDOCU DOM Helper - Chrome Extension

A Chrome extension designed to simplify working with content-heavy websites like Studocu. This tool provides two main features:


## 🚀 Features


### Print Feature:
1. User clicks **"Print"**
2. The extension:
   - Scrolls down to load content
   - Scrolls back to top
   - Injects `@media print` CSS to hide UI clutter
   - Removes specific known banners, ads, and overlays
3. Calls `window.print()` to open the print dialog
4. Cleans up styles after printing

---

## 🛠 Setup

1. Clone or download the repo
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer Mode**
4. Click **Load unpacked**
5. Select the extension folder

---


## 📝 Notes

- Designed for sites like **Studocu** but customizable for others
- The element ID for screenshots must be manually provided
- Print mode currently targets known Studocu layout classes — adjust in `printStyle` if needed

---

## 🔐 Permissions

- `activeTab` – to run scripts in the current tab
- `scripting` – to inject JS (html2canvas + custom cleanup)

---

## 📃 License

MIT License — free to use, modify, and distribute.
