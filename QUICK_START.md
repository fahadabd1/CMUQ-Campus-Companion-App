# Quick Start Guide - Email Events Integration

Your Zapier Email Parser is set up! Here's what to do next:

## Step 1: Start Backend Server

```bash
# Navigate to backend directory
cd backend

# Install dependencies (first time only)
npm install

# Copy environment file (first time only)
cp .env.example .env

# Edit .env and add your PostgreSQL password
# Then initialize database (first time only)
npm run init-db

# Start the server
npm run dev
```

You should see:
```
✓ Server running on port 3000
✓ Connected to PostgreSQL database
```

---

## Step 2: Test the Webhook Endpoint

In a **new terminal** (keep server running):

```bash
cd backend
node test-webhook.js
```

Expected output:
```
✅ SUCCESS! Event created:
   ID: 1
   Title: Test Event - AI Workshop
   Date: 2025-12-10T14:00:00.000Z
   Location: Building 2, Room 2301
   Category: Academic

✓ Webhook is working correctly!
```

If you see this, your backend is ready! ✅

---

## Step 3: Expose Backend with ngrok

Since you're testing locally, you need ngrok to make your server accessible to Zapier:

```bash
# Install ngrok globally (first time only)
npm install -g ngrok

# Expose port 3000 (run in a new terminal)
ngrok http 3000
```

Copy the **https URL** (e.g., `https://abc123.ngrok-free.app`)

---

## Step 4: Configure Zapier Zap

### 4.1 Create New Zap

1. Go to https://zapier.com/app/zaps
2. Click **"Create Zap"**
3. Name: "CMUQ Campus Events"

### 4.2 Set Up Trigger

1. **App**: "Email Parser by Zapier"
2. **Event**: "New Email"
3. **Mailbox**: Select your mailbox (companioncmuq@robot.zapier.com)
4. **Test**: Send a test email, click "Test trigger"
5. Click **"Continue"**

### 4.3 Add Webhook Action

1. Click **"+"** → Search "Webhooks by Zapier"
2. **Event**: "POST"
3. **URL**: Paste your ngrok URL + `/webhook/events`

   Example: `https://abc123.ngrok-free.app/webhook/events`

4. **Payload Type**: `json`

5. **Data** - Click "+" to add these fields:

   | Key | Value |
   |-----|-------|
   | `eventname` | [Select "Event" from Email Parser] |
   | `eventdate` | [Select "Date" from Email Parser] |
   | `eventime` | [Select "Time" from Email Parser] |
   | `eventlocation` | [Select "Location" from Email Parser] |
   | `eventcategory` | [Select "Category" from Email Parser] |
   | `eventdescription` | [Select "Description" from Email Parser] |

6. Click **"Continue"**
7. Click **"Test"** - Should show success!
8. **Turn on Zap** (top right)

---

## Step 5: Test with Real Email

Send this email to **companioncmuq@robot.zapier.com**:

```
Subject: Campus Event Notification

Event: Student Club Fair
Date: December 15, 2025
Time: 12:00 PM - 4:00 PM
Location: Student Center Main Hall
Category: Student Life
Description: Annual club fair featuring 50+ student organizations. Come discover new clubs and meet current members!
```

### Check Backend

Your backend terminal should show:
```
📧 Received webhook from Zapier: {
  eventname: 'Student Club Fair',
  eventdate: 'December 15, 2025',
  ...
}
✓ Event created: 2 - Student Club Fair
```

### Verify in Database

```bash
psql -U postgres -d cmuq_companion
```

```sql
SELECT id, title, category, start_time FROM events;
```

You should see your event!

---

## Step 6: Update Mobile App

### 6.1 Find Your IP Address

**Windows:**
```bash
ipconfig
# Look for "IPv4 Address" (e.g., 192.168.1.100)
```

**Mac/Linux:**
```bash
ifconfig | grep "inet "
# Look for your local IP (e.g., 192.168.1.100)
```

### 6.2 Update API Configuration

Edit `src/services/api.js`:

```javascript
const API_BASE_URL = __DEV__
  ? 'http://YOUR_IP_HERE:3000/api'  // Replace with your IP!
  : 'https://your-production-api.com/api';
```

Example:
```javascript
const API_BASE_URL = __DEV__
  ? 'http://192.168.1.100:3000/api'
  : 'https://your-production-api.com/api';
```

### 6.3 Start Mobile App

```bash
# In project root directory
npm start
```

Press:
- `i` for iOS simulator
- `a` for Android emulator
- Scan QR code for physical device

### 6.4 Test in App

1. Open the app
2. **Pull down to refresh** on Home screen
3. Your event should appear! 🎉

---

## Troubleshooting

### Backend Not Starting?

**Error: "ECONNREFUSED"**
```bash
# PostgreSQL not running
# Windows: Start PostgreSQL service
# Mac: brew services start postgresql
# Linux: sudo service postgresql start
```

**Error: "Database does not exist"**
```bash
cd backend
npm run init-db
```

### Mobile App Can't Connect?

1. **Check IP address** - Make sure it's correct
2. **Same WiFi** - Phone and computer must be on same network
3. **Firewall** - Allow port 3000 through firewall

### Zapier Webhook Failing?

1. **ngrok running?** - Check terminal with ngrok
2. **Correct URL?** - Must be https from ngrok, not localhost
3. **Field names match?** - Check Zapier Data mapping
4. **Check Zap History** - Look for error messages

### Events Not Showing in App?

1. **Backend received it?** - Check terminal for "📧 Received webhook"
2. **Saved to database?** - Run `SELECT * FROM events;`
3. **API working?** - Visit `http://YOUR_IP:3000/api/events/today` in browser
4. **Mobile app updated?** - Check `src/services/api.js` has correct IP

---

## Email Format Requirements

For events to parse correctly, emails should contain:

```
Event: [Event Name]
Date: [Month Day, Year]
Time: [Start Time] - [End Time]
Location: [Building/Room]
Category: [Academic | Student Life | Sports | Other]
Description: [Full description]
```

**Valid Categories:**
- Academic
- Student Life
- Sports
- Other

---

## Next Steps

### For Testing:
- Keep ngrok running whenever testing
- Backend must be running for Zapier to send data
- Check backend terminal logs for errors

### For Production:
1. Deploy backend to Railway/Render (see backend/README.md)
2. Update Zapier webhook URL to production URL
3. Update mobile app API URL for production
4. Distribute email address to event organizers

---

## Useful Commands

```bash
# Backend
cd backend
npm run dev              # Start server
node test-webhook.js     # Test webhook
npm run init-db          # Reset database

# Database
psql -U postgres -d cmuq_companion
SELECT * FROM events ORDER BY start_time DESC LIMIT 10;
DELETE FROM events WHERE id = 1;  # Delete specific event

# Mobile App
npm start                # Start Expo
npm run android         # Run on Android
npm run ios             # Run on iOS
```

---

## Architecture Overview

```
Email → Zapier Parser → Webhook → Backend API → PostgreSQL → Mobile App
```

**Your Setup:**
- Email: `companioncmuq@robot.zapier.com`
- Webhook: `https://[ngrok-url].ngrok-free.app/webhook/events`
- Backend: `http://localhost:3000`
- Database: PostgreSQL on localhost
- Mobile API: `http://[your-ip]:3000/api`

---

**You're all set! 🚀**

Questions? Check:
- [EMAIL_PARSER_SETUP_GUIDE.md](./EMAIL_PARSER_SETUP_GUIDE.md) - Detailed setup
- [backend/README.md](./backend/README.md) - Backend documentation
