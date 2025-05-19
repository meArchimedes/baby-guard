# 👶 BabyGuard

**BabyGuard** is a mobile safety app designed to prevent accidental harm by reminding caregivers not to leave babies in cars. It runs in the background, detects when driving starts via Bluetooth, and triggers alerts after a drive if the user doesn’t confirm the baby was removed from the car.

---

## 🚀 Features

- Detects start/stop of driving using Bluetooth connection
- Asks if a baby is in the car at the beginning of a drive
- Triggers an alarm after the drive ends if baby removal isn't confirmed
- Swipe-to-dismiss countdown screen
- Clean, modern interface using a consistent color theme: `#2730d5`, `#eefb18`, and light blue

---

## 🧱 Tech Stack

| Layer         | Technology                |
|---------------|---------------------------|
| Frontend      | [Expo](https://expo.dev/), React Native (TypeScript) |
| Backend       | TBD (Will be simple and lightweight — Firebase or .NET API planned) |
| State Mgmt    | React Context API (or Redux, TBD) |
| Version Control | Git + GitHub |
| Task Management | Jira (invite-only) |

---

## 📦 Folder Structure
baby-guard/
├── app/ # App screens
├── assets/ # Images, fonts
├── components/ # Reusable UI components
├── constants/ # Colors, layouts
├── hooks/ # Custom React hooks
├── scripts/ # Utility scripts
├── .expo/ # Expo config
├── .vscode/ # Editor settings
├── package.json
├── app.json
├── tsconfig.json
└── README.md

## 📱 Getting Started (Local Dev)

> You can run this without a smartphone using browser/dev tools.

1. Clone the repo:
```bash
git clone https://github.com/YOUR_USERNAME/baby-guard.git
cd baby-guard

install dependencies
npm install

Start the project (offline + browser mode)
npx expo start --offline --web












In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).


