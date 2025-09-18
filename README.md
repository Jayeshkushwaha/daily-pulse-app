# Daily Pulse App

A React Native application for daily questionnaires with Firebase authentication and Firestore integration.

## Features

- 🔐 **Firebase Authentication** - Email & Password authentication
- 📱 **Modern UI** - Dark theme with beautiful design matching the provided mockups
- 📋 **Dynamic Questionnaires** - Fetch questions from API and render different input types
- 💾 **Data Persistence** - Save answers to Firebase Firestore
- 🧭 **Navigation** - Stack and Tab navigation with React Navigation
- ✅ **Form Validation** - Input validation and error handling

## Screenshots

The app includes the following screens:
- **Login Screen** - Welcome back with email/password login
- **Signup Screen** - Create account with email/password
- **Home Screen** - User profile and daily questionnaire card
- **Profile Screen** - User profile management and settings
- **Questionnaire Screen** - Dynamic form with text, single choice, and multi-choice questions

## Tech Stack

- **React Native 0.81.4**
- **TypeScript**
- **React Navigation 6**
- **Firebase Authentication**
- **Firebase Firestore**
- **React Native Vector Icons**

## Installation

1. **Clone the repository**
   ```bash
   git clone [<repository-url>](https://github.com/Jayeshkushwaha/daily-pulse-app.git)
   cd MyNewReactNativeApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Firebase Setup**
   
   **Quick Setup:**
   ```bash
   # Follow the detailed guide
   open FIREBASE_SETUP.md
   
   # After downloading config files from Firebase Console, run:
   ./setup-firebase-config.sh
   
   # Verify your setup
   node verify-firebase-setup.js
   ```
   
   **Manual Setup:**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication with Email/Password provider
   - Enable Firestore Database
   - Download `google-services.json` for Android and place it in `android/app/`
   - Download `GoogleService-Info.plist` for iOS and place it in `ios/MyNewReactNativeApp/`
   
   📖 **See `FIREBASE_SETUP.md` for detailed step-by-step instructions**

## Running the App

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

## Project Structure

```
src/
├── context/
│   └── AuthContext.tsx          # Firebase authentication context
├── navigation/
│   └── AppNavigator.tsx         # Navigation setup
└── screens/
    ├── LoginScreen.tsx          # Login screen
    ├── SignupScreen.tsx         # Signup screen
    ├── HomeScreen.tsx           # Home screen with questionnaire card
    ├── ProfileScreen.tsx        # Profile screen
    └── QuestionnaireScreen.tsx  # Dynamic questionnaire
```

## API Integration

The app fetches questions from: `https://dummyjson.com/c/a67f-05a6-4cbd-9a19`

Expected API response format:
```json
{
  "questions": [
    {
      "id": "1",
      "question": "How are you feeling today?",
      "type": "single_choice",
      "options": ["Great", "Good", "Okay", "Not great"]
    },
    {
      "id": "2",
      "question": "What activities did you do today?",
      "type": "multi_choice",
      "options": ["Exercise", "Work", "Study", "Relax"]
    },
    {
      "id": "3",
      "question": "Any additional comments?",
      "type": "text"
    }
  ]
}
```

## Firestore Data Structure

Answers are stored in Firestore with the following structure:
```
users/{userId}/answers/{date}
{
  answers: [
    {
      questionId: "1",
      answer: "Great"
    },
    {
      questionId: "2", 
      answer: ["Exercise", "Work"]
    }
  ],
  timestamp: serverTimestamp
}
```

## Firebase Configuration

Make sure to:
1. Replace the placeholder Firebase configuration files with your actual project files
2. Update the package name/bundle ID to match your Firebase project
3. Enable Authentication and Firestore in your Firebase console

## Development

### Adding New Question Types

To add new question types, modify the `renderQuestion` function in `QuestionnaireScreen.tsx` and add the corresponding UI components.

### Customizing Themes

The app uses a dark theme. Colors and styles can be modified in the respective screen files. Main colors used:
- Background: `#111827`
- Cards: `#1f2937`
- Inputs: `#374151`
- Primary: `#4ade80`
- Text: `#ffffff`

## Troubleshooting

1. **Build issues**: Clean and rebuild
   ```bash
   cd android && ./gradlew clean && cd ..
   npm run android
   ```

2. **iOS build issues**: Clean pods
   ```bash
   cd ios && rm -rf Pods && pod install && cd ..
   ```

3. **Firebase issues**: Ensure configuration files are properly placed and package names match

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
