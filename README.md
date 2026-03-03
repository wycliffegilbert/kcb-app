# 🏦 KCB Bank Mobile App
### Built with React Native + Expo

A fully-featured mobile banking app with dummy data for demonstration.

---

## 📱 Features
- **Home** – Balance hero card, quick actions, recent transactions, promo banner
- **Transactions** – Tabs: All | Income | Expenses | Transfer | Summary
  - Monthly summary totals (income vs expenses)
  - 6-month bar chart of spending
  - Spending by category with progress bars
- **Savings** – Savings account balance, savings goals with progress, add funds
- **Accounts** – Checking, Savings, Investment — each with individual 👁️ eye toggles
- **Profile + Settings** – Personal details, security toggles, preferences, logout

---

## 🚀 Get Your APK in 3 Ways

### Option 1: EAS Build (Cloud) — RECOMMENDED ✅
**Free APK in ~5 minutes, no Android SDK needed.**

```bash
# 1. Install dependencies
npm install

# 2. Install EAS CLI
npm install -g eas-cli

# 3. Login to Expo (free account at expo.dev)
eas login

# 4. Configure project (first time only)
eas build:configure

# 5. Build APK
eas build -p android --profile preview
```

- When done, EAS gives you a **download link** for the APK
- Share that link with anyone to install
- No Play Store needed — just enable "Install from unknown sources" on Android

---

### Option 2: Expo Go (Instant Preview, no build needed)
```bash
npm install
npx expo start
```
- Install **Expo Go** from Play Store on any Android phone
- Scan the QR code shown in terminal
- App runs instantly

---

### Option 3: Local Build (requires Android Studio + SDK)
```bash
npm install
npx expo run:android
```

---

## 📦 Project Structure
```
KCBBank/
├── App.js                    # Entry point
├── app.json                  # Expo config
├── eas.json                  # EAS build profiles
├── package.json              # Dependencies
└── src/
    ├── data/
    │   ├── dummyData.js      # All dummy banking data
    │   └── theme.js          # Colors, spacing, shadows
    ├── navigation/
    │   └── TabNavigator.js   # Bottom tab navigation
    └── screens/
        ├── HomeScreen.js     # Dashboard
        ├── TransactionsScreen.js  # Transactions + chart
        ├── SavingsScreen.js  # Savings goals
        ├── AccountsScreen.js # All 3 accounts
        └── ProfileScreen.js  # Profile + settings
```

---

## 🔧 Prerequisites
- Node.js 18+
- npm or yarn
- Expo account (free) at https://expo.dev

---

## 🎨 Design
- **Brand color**: KCB Green `#006B3F`
- **Gold accent**: `#D4AF37`
- Clean, professional light theme
- KES currency (Kenyan Shilling)
- Dummy user: James Kamau

---

## 📲 Sharing the APK
After EAS build completes:
1. Download the `.apk` file from the EAS dashboard
2. Share via WhatsApp, email, Google Drive, etc.
3. Recipients: go to Settings → Security → "Install from unknown sources" → Install

---

*KCB Bank Demo App — All data is fictional for demonstration purposes only.*
