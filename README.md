# Campus Companion App

## Quick Start Guide - How to use

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (optional, included in project)
- iOS Simulator (for Mac) or Android Emulator

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Run on Platform**
   - Press `a` for Android
   - Press `i` for iOS (Mac only)
   - Press `w` for Web
   - Scan QR code with Expo Go app on your phone

## Availabe features in the app

### 1. Home Screen
-  View today's events
-  Check upcoming events
-  Tap map card to navigate to campus map
-  Pull down to refresh


### 2. Schedule Screen
-  Navigate through days using day selector
-  Tap "Import .ics" to import calendar file
-  Tap "+" to add a manual class entry
-  View class details (time, location)

**To test ICS import:**
1. Get an .ics file from your calendar app (Google Calendar, Outlook, etc.)
2. On mobile: Save the .ics file to your device
3. Tap "Import .ics" button
4. Select the .ics file
5. Schedule will populate automatically

### 3. Lost & Found Screen
-  Switch between All/Lost/Found tabs
-  Tap "Report Item" to add new entry
-  Choose Lost or Found item type
-  Fill in item details
-  Tap "Add Photo" to take photo or choose from gallery
- Submit to add it to the list of items


### 4. Map Screen
-  View building directory
-  Search for rooms
-  Rooms are highlighted if found, else notify

### 5. Settings Screen
-  Toggle notifications
-  Toggle dark mode
-  Clear all data (with confirmation)
-  How to use the app
