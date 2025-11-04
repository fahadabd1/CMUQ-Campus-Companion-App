# Sprint 4 - Functional Prototype Implementation

## Overview
This document describes the Sprint 4 implementation of the Campus Companion App, a React Native/Expo application with full database functionality, schedule management, lost & found features, and campus navigation.

## Project Structure
```
campus-companion-app/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx           # Home screen tab
│   │   ├── explore.tsx         # Schedule screen tab
│   │   ├── lostfound.tsx       # Lost & Found screen tab
│   │   └── settings.tsx        # Settings screen tab
│   ├── _layout.tsx             # Root layout with database initialization
│   └── map.tsx                 # Campus map screen
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js       # Home screen implementation
│   │   ├── ScheduleScreen.js   # Schedule with ICS import
│   │   ├── LostFoundScreen.js  # Lost & Found management
│   │   ├── MapScreen.js        # Campus map
│   │   └── SettingsScreen.js   # Settings and preferences
│   ├── database/
│   │   └── database.js         # SQLite database setup
│   └── utils/
│       └── icsParser.js        # ICS file parser for schedule import
└── package.json
```

## Features Implemented

### 1. Database Setup (SQLite)
- **Location**: `src/database/database.js`
- **Tables**:
  - `events`: Campus events with categories, locations, and times
  - `schedule`: Class schedule with recurring events support
  - `lost_found`: Lost and found items with images and expiration
  - `preferences`: User preferences storage
- **Technology**: Expo SQLite (expo-sqlite ~15.0.3)

### 2. Home Screen
- **Location**: `src/screens/HomeScreen.js`
- **Features**:
  - Display today's events
  - Show upcoming events
  - Quick access to campus map
  - Pull-to-refresh functionality
  - Event categorization (Academic, Student Life, Sports, Other)
  - Color-coded category badges

### 3. Schedule Screen
- **Location**: `src/screens/ScheduleScreen.js`
- **Features**:
  - Weekly schedule view
  - Day selector for quick navigation
  - ICS file import support (imports calendar files)
  - Add manual class entries
  - Display class location, instructor, and time
  - Color-coded class cards

### 4. ICS Import System
- **Location**: `src/utils/icsParser.js`
- **Features**:
  - Parse ICS calendar files
  - Extract recurring events
  - Convert to schedule entries
  - Support for course codes, locations, and instructors
- **Technology**: ical.js library

### 5. Lost & Found Screen
- **Location**: `src/screens/LostFoundScreen.js`
- **Features**:
  - Report lost items
  - Report found items
  - Photo attachment support (camera or gallery)
  - Filter by type (all/lost/found)
  - 30-day automatic expiration
  - Contact information
  - Location details

### 6. Campus Map
- **Location**: `src/screens/MapScreen.js`
- **Features**:
  - Building directory organized by category
  - Map legend
  - Academic buildings, student facilities, administrative buildings
  - Placeholder for future interactive map integration

### 7. Settings Screen
- **Location**: `src/screens/SettingsScreen.js`
- **Features**:
  - Push notification preferences
  - Dark mode toggle (UI ready)
  - Data export functionality
  - Clear all data option
  - About section with version info
  - Help & support links

## Dependencies Added

### Required Packages
```json
{
  "expo-sqlite": "~15.0.0",           // SQLite database
  "expo-document-picker": "~12.0.2",   // ICS file selection
  "expo-file-system": "~18.0.4",       // File operations
  "expo-image-picker": "~16.0.2",      // Camera and gallery access
  "ical.js": "^1.5.0"                  // ICS file parsing
}
```

**Note**: These versions are compatible with Expo SDK 54. The exact installed versions may be slightly higher due to patch updates.

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Run on Platform
```bash
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

## Database Schema

### Events Table
```sql
CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK(category IN ('Academic', 'Student Life', 'Sports', 'Other')),
  location TEXT,
  start_time TEXT NOT NULL,
  end_time TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Schedule Table
```sql
CREATE TABLE schedule (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_code TEXT NOT NULL,
  course_name TEXT,
  instructor TEXT,
  location TEXT,
  day_of_week INTEGER CHECK(day_of_week BETWEEN 0 AND 6),
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6'
);
```

### Lost & Found Table
```sql
CREATE TABLE lost_found (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT CHECK(type IN ('lost', 'found')) NOT NULL,
  item_name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  location_lost TEXT,
  image_path TEXT,
  contact_info TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT
);
```

### Preferences Table
```sql
CREATE TABLE preferences (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

## Navigation Structure

### Bottom Tabs
1. **Home** (🏠) - Dashboard with events and quick actions
2. **Schedule** (📅) - Class schedule and ICS import
3. **Lost & Found** (🔍) - Report and browse items
4. **Others** (⚙️) - Settings and preferences

### Stack Navigation
- **Map Screen** - Accessible from home screen map card
- **Modal** - General purpose modal (existing)

## Key Technical Decisions

1. **Expo SQLite**: Using Expo's native SQLite wrapper for cross-platform database support
2. **File System**: Expo File System for reading ICS files
3. **Image Picker**: Expo Image Picker for camera and gallery access
4. **Navigation**: Expo Router for file-based navigation
5. **Styling**: React Native StyleSheet with consistent design system

## Color Scheme
- Primary Blue: `#3B82F6`
- Success Green: `#10B981`
- Warning Orange: `#F59E0B`
- Danger Red: `#EF4444`
- Gray Scale: `#F3F4F6`, `#E5E7EB`, `#6B7280`, `#1F2937`

## Future Enhancements
1. Interactive campus map with pinch-to-zoom
2. Push notifications for events
3. Dark mode full implementation
4. Event creation and editing
5. Schedule conflict detection
6. Lost & Found item matching
7. Social features and messaging
8. Real-time updates

## Testing Recommendations
1. Test ICS import with various calendar formats
2. Verify database persistence across app restarts
3. Test image upload and storage
4. Validate schedule day-of-week calculations
5. Test pull-to-refresh on slow networks
6. Verify data clearing functionality

## Notes
- Database is initialized automatically on app start
- All screens are implemented with full functionality
- Uses Expo's managed workflow for easy deployment
- Compatible with iOS, Android, and Web platforms
- TypeScript support for type safety (can be enhanced)

## Support
For issues or questions, please refer to:
- Expo Documentation: https://docs.expo.dev/
- React Navigation: https://reactnavigation.org/
- SQLite Documentation: https://docs.expo.dev/versions/latest/sdk/sqlite/
