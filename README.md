# 👶 We're Having A Baby - Baby Name Matcher

A collaborative baby name discovery app built with **Angular**, **Firebase**, and **Tailwind CSS**.

Swipe your way to the perfect name! Match with your partner and discover names you both love.

## ✨ Features

- **Swipe Interface**: Intuitive tinder-like swiping to like or dislike names.
- **Collaborative Sessions**: Create or join a session with your partner to match names together.
- **Match Alerts**: Instant notification when you both swipe right on the same name.
- **Real-time Synchronization**: Powered by Firebase for instant updates across devices.
- **Personalized Lists**: View your liked names and see where you've matched.
- **Responsive Design**: Works beautifully on mobile and desktop thanks to Tailwind CSS.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Angular CLI](https://angular.dev/tools/cli)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/msawayda/We-re-Having-A-Baby.git
   cd We-re-Having-A-Baby
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Firebase Setup:**
   - Create a project in the [Firebase Console](https://console.firebase.google.com/).
   - Add a Web App to your project.
   - Copy your Firebase configuration.
   - Create/update `src/environments/environment.ts` and `src/environments/environment.prod.ts` with your config:
     ```typescript
     export const environment = {
       production: false,
       firebase: {
         apiKey: "YOUR_API_KEY",
         authDomain: "YOUR_AUTH_DOMAIN",
         projectId: "YOUR_PROJECT_ID",
         storageBucket: "YOUR_STORAGE_BUCKET",
         messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
         appId: "YOUR_APP_ID"
       }
     };
     ```

## 🛠 Development

### Run Development Server
Run `npm start` (or `ng serve`) for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build
Run `npm run build` (or `ng build`) to build the project. The build artifacts will be stored in the `dist/` directory.

### Running Tests
Run `npm test` (or `ng test`) to execute the unit tests via [Karma](https://karma-runner.github.io).

## 🧰 Tech Stack

- **Frontend**: [Angular 18](https://angular.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend/Database**: [Firebase](https://firebase.google.com/) (Firestore & Auth)
- **Animations**: [Angular Animations](https://angular.dev/guide/animations) & [HammerJS](https://hammerjs.github.io/) for gestures.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
