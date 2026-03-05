# 📱 Smart Scan – Photo to PDF Pro

<div align="center">

![Smart Scan Banner](https://img.shields.io/badge/Smart%20Scan-Photo%20to%20PDF%20Pro-00c8ff?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0yMyAxOWEyIDIgMCAwIDEtMiAySDNhMiAyIDAgMCAxLTItMlY4YTIgMiAwIDAgMSAyLTJoNGwyLTNoNmwyIDNoNGEyIDIgMCAwIDEgMiAyeiIvPjxjaXJjbGUgZmlsbD0iIzAwNzBmZiIgY3g9IjEyIiBjeT0iMTMiIHI9IjQiLz48L3N2Zz4=)

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![Capacitor](https://img.shields.io/badge/Capacitor-5-119EFF?style=flat-square&logo=capacitor)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square&logo=pwa)
![Offline](https://img.shields.io/badge/Offline-100%25-00ffaa?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**A premium, fully offline Document Scanner & PDF Creator App**
Built with React + Vite · Converts to Android APK via Capacitor · PWA installable

[🚀 Live Demo](#) · [📥 Download APK](#) · [🐛 Report Bug](../../issues) · [✨ Request Feature](../../issues)

</div>

---

## ✨ Features — All 17

| # | Feature | Description |
|---|---------|-------------|
| 1️⃣ | **Camera Scan Mode** | Live document scanning with real-time viewfinder, corner guides & multi-page capture |
| 2️⃣ | **Auto Edge Detection + Crop** | AI-style document border detection with draggable corner handles & perspective fix |
| 3️⃣ | **Smart Filters** | B&W, Hi-Contrast, Color Enhance, Scan mode with live preview |
| 4️⃣ | **Auto Brightness & Sharpen** | Intelligent image enhancement with manual sliders |
| 5️⃣ | **Multi-Page PDF Creator** | Combine multiple scans into a single PDF with page numbering |
| 6️⃣ | **Drag & Drop Page Reorder** | Rearrange pages before PDF generation |
| 7️⃣ | **PDF Quality Selector** | Low / Medium / High output with estimated file size |
| 8️⃣ | **Password Protect PDF** | AES encryption with password on export |
| 9️⃣ | **Signature Add Feature** | Finger-draw signature on canvas with custom pen colors |
| 🔟 | **Watermark Add Option** | Custom text watermark (e.g. CONFIDENTIAL) with live preview |
| 1️⃣1️⃣ | **Scan History Section** | View, rename, delete, and share saved PDFs |
| 1️⃣2️⃣ | **Instant Share Button** | Direct share to WhatsApp, Email, Google Drive |
| 1️⃣3️⃣ | **Dark / Light Mode Toggle** | Smooth animated theme switch |
| 1️⃣4️⃣ | **File Size Compression** | Auto compression engine with savings display |
| 1️⃣5️⃣ | **Offline Working Mode** | 100% offline — no Firebase, no cloud |
| 1️⃣6️⃣ | **Splash Screen + Logo Animation** | Premium startup experience with progress bar |
| 1️⃣7️⃣ | **Native Android Navigation** | Bottom navigation bar — native app feel |

---

## 🎨 Design

- **Theme:** Dark Premium — `#050508` background + `#00c8ff` neon blue accents
- **Fonts:** Orbitron (headings) + Exo 2 (body) — Google Fonts
- **Style:** Glassmorphism cards, neon glow effects, scanline animations
- **Layout:** Mobile-first, 420px max-width, safe-area aware

---

## 🛠️ Tech Stack

```
React 18        → UI Framework
Vite 5          → Build Tool (lightning fast)
Capacitor 5     → Android / iOS native wrapper
vite-plugin-pwa → Progressive Web App
Vanilla CSS     → No UI library, pure custom styles
HTML5 Canvas    → Signature drawing
SVG             → Icons & crop overlay
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>= 18.x`
- npm `>= 9.x`
- Android Studio (for APK build)
- Java JDK 17+ (for Android)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/smart-scan-app.git
cd smart-scan-app
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run Development Server

```bash
npm run dev
# Open http://localhost:3000 in your browser
# Or scan the QR code on mobile for live preview
```

---

## 📦 Build Options

### 🌐 Build as PWA (Web App)

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to:
- **Vercel** → `vercel --prod`
- **Netlify** → Drag & drop `dist/` folder
- **GitHub Pages** → Push `dist/` to `gh-pages` branch

---

### 🤖 Build Android APK

```bash
# Step 1 — Build the web app
npm run build

# Step 2 — Add Android platform (first time only)
npm run cap:add:android

# Step 3 — Sync web build to Android
npm run cap:sync

# Step 4 — Open in Android Studio
npm run cap:open:android

# In Android Studio:
# Build → Generate Signed Bundle/APK → APK → Release
```

**Quick one-liner:**
```bash
npm run cap:build && npx cap open android
```

---

### 🍎 Build iOS IPA

```bash
npm run build
npx cap add ios
npx cap sync
npx cap open ios
# Build from Xcode
```

---

## 📂 Project Structure

```
smart-scan-app/
├── 📁 public/
│   ├── 📁 icons/           # App icons (72, 96, 128, 192, 512px)
│   ├── manifest.json       # PWA manifest
│   └── favicon.svg
├── 📁 src/
│   ├── main.jsx            # React entry point
│   └── SmartScanApp.jsx    # 🔥 Main app (all 17 features)
├── 📁 android/             # Generated by Capacitor (after cap add android)
├── 📁 ios/                 # Generated by Capacitor (after cap add ios)
├── index.html              # HTML entry
├── vite.config.js          # Vite + PWA config
├── capacitor.config.json   # Capacitor native config
├── package.json
└── .gitignore
```

---

## 📱 PWA Installation

On Chrome/Edge Android:
1. Open the web app URL
2. Tap the **"Add to Home Screen"** banner
3. App installs like a native app — no Play Store needed!

On iOS Safari:
1. Open the URL
2. Tap **Share → Add to Home Screen**

---

## 🔧 Configuration

### App ID (for Play Store / App Store)
Edit `capacitor.config.json`:
```json
{
  "appId": "com.yourname.smartscan",
  "appName": "Smart Scan"
}
```

### Theme Color
Edit `src/SmartScanApp.jsx` → `C` constants object:
```js
const C = {
  neon: "#00c8ff",    // Change primary neon color
  bg:   "#050508",    // Change background
  // ...
}
```

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

Built with ❤️ using React + Vite + Capacitor

⭐ **Star this repo if you found it useful!**

---

<div align="center">
  <sub>Smart Scan App · Dark Premium · All 17 Features · 100% Offline</sub>
</div>
