# Getting Started - Campus Companion App

## Quick Start Guide

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

## Testing the Features

### 1. Home Screen
- ✅ View today's events
- ✅ Check upcoming events
- ✅ Tap map card to navigate to campus map
- ✅ Pull down to refresh

### 2. Schedule Screen
- ✅ Navigate through days using day selector
- ✅ Tap "Import .ics" to import calendar file
- ✅ Tap "+" to add a manual class entry
- ✅ View class details (time, location, instructor)

**To test ICS import:**
1. Get an .ics file from your calendar app (Google Calendar, Outlook, etc.)
2. On mobile: Save the .ics file to your device
3. Tap "Import .ics" button
4. Select the .ics file
5. Schedule will populate automatically

### 3. Lost & Found Screen
- ✅ Switch between All/Lost/Found tabs
- ✅ Tap "Report Item" to add new entry
- ✅ Choose Lost or Found item type
- ✅ Fill in item details
- ✅ Tap "Add Photo" to take photo or choose from gallery
- ✅ Submit to database

**Camera Permissions:**
- Android: Grant camera and storage permissions when prompted
- iOS: Grant camera and photo library access when prompted

### 4. Map Screen
- ✅ View building directory
- ✅ Browse by category
- ✅ Check map legend
- ✅ Tap back button to return home

### 5. Settings Screen
- ✅ Toggle notifications (UI ready)
- ✅ Toggle dark mode (UI ready)
- ✅ Clear all data (with confirmation)
- ✅ View app version and info

## Database Features

### Automatic Initialization
The database is created automatically on first app launch with these tables:
- **events**: Campus events
- **schedule**: Class schedule
- **lost_found**: Lost and found items
- **preferences**: User settings

### Data Persistence
All data is stored locally using SQLite and persists across app restarts.

### Testing Database
1. Add some schedule entries
2. Add lost & found items
3. Close and reopen the app
4. Verify data is still present

## Project Structure

```
campus-companion-app/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Bottom tab screens
│   │   ├── index.tsx      # Home
│   │   ├── explore.tsx    # Schedule
│   │   ├── lostfound.tsx  # Lost & Found
│   │   └── settings.tsx   # Settings
│   ├── _layout.tsx        # Root layout
│   └── map.tsx            # Map screen
├── src/                   # Source code
│   ├── database/          # Database setup
│   ├── utils/             # Utilities (ICS parser)
│   └── screens/           # Screen components
├── assets/                # Images, fonts
└── package.json           # Dependencies
```

## Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
npm run lint       # Run ESLint
```

## Troubleshooting

### Database Issues
**Problem**: Database not initializing
**Solution**: Check console for errors, try clearing app data

### ICS Import Not Working
**Problem**: File picker not opening
**Solution**: Check file permissions, ensure .ics file is accessible

### Camera Not Working
**Problem**: Camera permission denied
**Solution**:
- Android: Settings > Apps > Campus Companion > Permissions
- iOS: Settings > Privacy > Camera > Campus Companion

### Images Not Displaying
**Problem**: Uploaded images not showing
**Solution**: Check storage permissions, verify image path is valid

### App Crashes on Launch
**Problem**: App crashes immediately
**Solution**:
1. Clear Metro bundler cache: `npm start -- --clear`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check console for specific error messages

## Development Tips

### Hot Reload
- Save files to see changes instantly
- Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android) for dev menu

### Debugging
1. Open Chrome DevTools: `Cmd+D` > "Debug Remote JS"
2. Use `console.log()` for debugging
3. Check Expo logs in terminal

### Adding Features
1. Database changes: Edit `src/database/database.js`
2. New screens: Add to `src/screens/` and create route in `app/`
3. Utilities: Add to `src/utils/`

## Sample Data

### Adding Test Events
```javascript
// In HomeScreen or via database
db.runSync(
  `INSERT INTO events (title, category, location, start_time)
   VALUES (?, ?, ?, ?)`,
  ['Test Event', 'Academic', 'Room 101', new Date().toISOString()]
);
```

### Adding Test Schedule
```javascript
// Monday class at 9 AM
db.runSync(
  `INSERT INTO schedule (course_code, course_name, location, day_of_week, start_time, end_time)
   VALUES (?, ?, ?, ?, ?, ?)`,
  ['CS101', 'Intro to CS', 'Room 201', 1, '09:00', '10:00']
);
```

## Permissions Required

### iOS
- Camera
- Photo Library
- File Access

### Android
- Camera
- Storage (Read/Write)
- File Access

### Web
- File picker (browser-based)
- No camera access

## Performance

### Optimization Tips
- Images are automatically compressed to 0.8 quality
- Database queries use indexes for better performance
- Pull-to-refresh debounced to prevent excessive calls

### Known Limitations
- Web version has limited camera/file access
- Large ICS files may take time to import
- Image storage is local only (no cloud sync)

## Next Steps

1. ✅ Install dependencies
2. ✅ Start development server
3. ✅ Test all features
4. 📝 Customize for your campus
5. 📝 Add real event data
6. 📝 Configure push notifications
7. 📝 Deploy to app stores

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [SQLite in Expo](https://docs.expo.dev/versions/latest/sdk/sqlite/)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review implementation docs
3. Check Expo documentation
4. Search GitHub issues

---

**Happy Coding! 🎓**
