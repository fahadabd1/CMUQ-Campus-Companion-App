# Email Parser Event System - Complete Setup Guide

This guide provides the **EXACT STEPS** to implement email-based event parsing for the CMUQ Campus Companion App using Zapier Email Parser.

## System Overview

**Email Flow:**
```
User sends email → companioncmuq@robot.zapier.com
    ↓
Zapier Email Parser extracts event data
    ↓
Zapier Webhook sends to your backend
    ↓
Backend stores in PostgreSQL database
    ↓
Mobile app fetches and displays events
```

---

## PHASE 1: Zapier Email Parser Setup

### Step 1: Access Zapier Email Parser

1. Go to **https://parser.zapier.com/**
2. Sign in to your Zapier account
3. Your custom email is already created: **companioncmuq@robot.zapier.com**

### Step 2: Create Email Template

1. Click on your mailbox
2. Send a **test event email** to **companioncmuq@robot.zapier.com**:

```
Subject: Event: Tech Talk on AI Innovations

Event Title: Guest Speaker Series - AI Innovations
Date: December 15, 2025
Time: 3:00 PM - 5:00 PM
Location: Building 2, Room 2301
Category: Academic
Description: Join us for an exciting talk on the latest innovations in AI and machine learning. Free refreshments will be provided.
```

3. Wait 30 seconds for email to arrive
4. Click **"I've received an email"**
5. Zapier shows your email - now define the template:

**Highlight and name these fields:**
- Highlight "Guest Speaker Series - AI Innovations" → Name it: `event_title`
- Highlight "December 15, 2025" → Name it: `date`
- Highlight "3:00 PM - 5:00 PM" → Name it: `time`
- Highlight "Building 2, Room 2301" → Name it: `location`
- Highlight "Academic" → Name it: `category`
- Highlight the description text → Name it: `description`

6. Click **"Save Template"**

### Step 3: Test the Parser

1. Send another test email with different content
2. Verify all fields are extracted correctly
3. Adjust template if needed

---

## PHASE 2: Backend Setup (PostgreSQL + Node.js)

### Step 1: Install PostgreSQL

**Windows:**
```bash
# Download from https://www.postgresql.org/download/windows/
# Install and remember your password
```

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE cmuq_companion;

# Exit
\q
```

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 4: Configure Environment

```bash
# Copy example env file
cp .env.example .env
```

**Edit `.env` file:**
```env
PORT=3000
NODE_ENV=development

# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cmuq_companion
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD_HERE

# CORS
ALLOWED_ORIGINS=http://localhost:8081,exp://localhost:8081
```

### Step 5: Initialize Database

```bash
npm run init-db
```

Expected output:
```
✓ Connected to PostgreSQL database
Creating database tables...
✓ Database tables created successfully!
✓ Indexes created successfully!
Database initialization complete!
```

### Step 6: Start Backend Server

```bash
npm run dev
```

You should see:
```
╔════════════════════════════════════════════╗
║  CMUQ Campus Companion API Server         ║
╚════════════════════════════════════════════╝

✓ Server running on port 3000
✓ Environment: development

📋 Available endpoints:
   → Webhook: http://localhost:3000/webhook/events
   → API: http://localhost:3000/api/events

Press Ctrl+C to stop
```

---

## PHASE 3: Zapier Zap Configuration

### Step 1: Create New Zap

1. Go to **https://zapier.com/app/zaps**
2. Click **"Create Zap"**
3. Name it: **"CMUQ Campus Events Parser"**

### Step 2: Configure Trigger

1. **Choose App**: Search for **"Email Parser by Zapier"**
2. **Choose Event**: **"New Email"**
3. Click **"Continue"**
4. **Choose account**: Select your Email Parser account
5. **Set up trigger**:
   - **Mailbox**: Select your mailbox (companioncmuq@robot.zapier.com)
6. Click **"Continue"**
7. **Test trigger**: Send a test email and click **"Test trigger"**
8. Verify the email appears → Click **"Continue"**

### Step 3: Add Filter (Optional)

1. Click **"+"** → **"Filter"**
2. Set condition:
   - **Field**: Choose "Subject" or "Body"
   - **Condition**: "Text contains"
   - **Value**: "event"
   - **Match**: Case insensitive
3. Click **"Continue"**

### Step 4: Configure Webhook Action

Since you're testing locally, you need **ngrok** to expose your local server:

**Install ngrok:**
```bash
npm install -g ngrok

# In a new terminal (keep your backend running)
ngrok http 3000
```

Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)

**Configure Zapier Webhook:**

1. Click **"+"** → Search for **"Webhooks by Zapier"**
2. **Choose Event**: **"POST"**
3. Click **"Continue"**
4. **Set up action**:

   **URL**: `https://YOUR-NGROK-URL.ngrok.io/webhook/events`

   **Payload Type**: `json`

   **Data**: Click **"+"** to add each field:
   ```
   event_title     → [Select "Event Title" from Email Parser]
   date            → [Select "Date" from Email Parser]
   time            → [Select "Time" from Email Parser]
   location        → [Select "Location" from Email Parser]
   category        → [Select "Category" from Email Parser]
   description     → [Select "Description" from Email Parser]
   ```

5. Click **"Continue"**
6. **Test action** → Verify success
7. **Turn on Zap**

---

## PHASE 4: Mobile App Configuration

### Step 1: Find Your Computer's IP Address

**Windows:**
```bash
ipconfig
# Look for "IPv4 Address" under your active network
# Example: 192.168.1.100
```

**Mac/Linux:**
```bash
ifconfig
# Look for "inet" under en0 or wlan0
# Example: 192.168.1.100
```

### Step 2: Update API Base URL

Edit `src/services/api.js`:

```javascript
const API_BASE_URL = __DEV__
  ? 'http://YOUR_IP_ADDRESS:3000/api'  // Replace with your actual IP
  : 'https://your-production-api.com/api';
```

Example:
```javascript
const API_BASE_URL = __DEV__
  ? 'http://192.168.1.100:3000/api'
  : 'https://your-production-api.com/api';
```

### Step 3: Start Mobile App

```bash
npm start
```

Press `i` for iOS or `a` for Android

---

## TESTING THE COMPLETE FLOW

### Test 1: Send Event Email

Send this email to **companioncmuq@robot.zapier.com**:

```
Subject: Event: Student Club Fair

Event Title: Annual Student Club Fair
Date: December 20, 2025
Time: 12:00 PM - 4:00 PM
Location: Student Center
Category: Student Life
Description: Discover clubs and organizations on campus. Meet current members and sign up for clubs that interest you.
```

### Test 2: Verify Backend Received Event

Check your backend terminal - you should see:
```
📧 Received webhook from Zapier: { event_title: 'Annual Student Club Fair', ... }
✓ Event created: 1
```

### Test 3: Check Database

```bash
psql -U postgres -d cmuq_companion
```

```sql
SELECT * FROM events;
```

You should see your event!

### Test 4: Check Mobile App

1. Pull to refresh on the Home screen
2. Your event should appear under "Today" or "Recent Events"
3. Verify the category badge color matches

---

## DEPLOYMENT (OPTIONAL - FOR PRODUCTION)

### Option 1: Railway (Recommended - Free Tier)

1. Go to **https://railway.app/**
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Railway auto-detects and deploys
6. Add PostgreSQL:
   - Click **"+"** → **"Database"** → **"PostgreSQL"**
7. Add environment variables in Railway dashboard:
   ```
   NODE_ENV=production
   PORT=3000
   ```
8. Railway provides a URL like `https://your-app.railway.app`
9. Update Zapier webhook URL to Railway URL
10. Update mobile app API URL for production

### Option 2: Render (Free Tier)

1. Go to **https://render.com/**
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. **Build Command**: `cd backend && npm install`
5. **Start Command**: `cd backend && npm start`
6. Add PostgreSQL: Click **"New +"** → **"PostgreSQL"**
7. Add environment variables
8. Deploy!

---

## TROUBLESHOOTING

### Issue: Backend "ECONNREFUSED" Error

**Cause**: PostgreSQL not running

**Fix:**
```bash
# Windows
# Check Services and start PostgreSQL

# Mac
brew services start postgresql

# Linux
sudo service postgresql start
```

### Issue: Mobile App Can't Connect to Backend

**Causes & Fixes:**

1. **Wrong IP address**
   - Use `ipconfig`/`ifconfig` to verify IP
   - Update `src/services/api.js`

2. **Firewall blocking port 3000**
   - Windows: Add firewall rule for port 3000
   - Mac: System Preferences → Security → Firewall → Options

3. **Different WiFi networks**
   - Ensure phone and computer are on same WiFi

### Issue: Zapier Webhook Failing

**Check:**

1. ngrok still running?
   ```bash
   ngrok http 3000
   ```

2. Backend still running?
   ```bash
   cd backend
   npm run dev
   ```

3. Correct webhook URL in Zapier?
   - Use ngrok URL, not localhost

4. Check Zapier Zap History for errors

### Issue: Events Not Appearing in App

**Diagnosis:**

1. Check if backend received webhook:
   - Look for "📧 Received webhook" in terminal

2. Check database:
   ```sql
   SELECT COUNT(*) FROM events;
   ```

3. Check API endpoint:
   ```bash
   curl http://localhost:3000/api/events/today
   ```

4. Check mobile app console for errors

---

## EMAIL FORMAT GUIDELINES

For best results, emails should follow this format:

```
Subject: Event: [Event Name]

Event Title: [Full event name]
Date: [Month Day, Year]
Time: [Start Time] - [End Time]
Location: [Building/Room]
Category: [Academic | Student Life | Sports | Other]
Description: [Full description here]
```

**Supported Date Formats:**
- December 15, 2025
- Dec 15, 2025
- 12/15/2025
- 2025-12-15

**Supported Time Formats:**
- 3:00 PM - 5:00 PM
- 15:00 - 17:00
- 3PM to 5PM

---

## ARCHITECTURE SUMMARY

```
┌─────────────────────────────────────────────────────────┐
│                    Email Source                          │
│         companioncmuq@robot.zapier.com                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Zapier Email Parser                         │
│   • Extracts structured data from email                 │
│   • Validates against template                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                Zapier Webhook                            │
│   • POST to /webhook/events                             │
│   • JSON payload with event data                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│             Backend Server (Node.js)                     │
│   • Receives webhook                                     │
│   • Parses date/time                                     │
│   • Validates data                                       │
│   • Stores in PostgreSQL                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│           PostgreSQL Database                            │
│   • events table                                         │
│   • Indexed by date and category                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                REST API Endpoints                        │
│   • GET /api/events/today                               │
│   • GET /api/events/upcoming                            │
│   • GET /api/events/category/:category                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         React Native Mobile App (Expo)                   │
│   • Fetches events from API                             │
│   • Syncs to local SQLite                               │
│   • Displays on Home screen                             │
│   • Offline fallback support                            │
└─────────────────────────────────────────────────────────┘
```

---

## NEXT STEPS

After setup is complete:

1. **Test with various email formats**
2. **Deploy backend to production**
3. **Update Zapier webhook to production URL**
4. **Distribute email address to event organizers**
5. **Monitor Zapier Zap History for issues**
6. **Consider adding email notification to admins**

---

## SUPPORT & CONTACT

For issues:
1. Check troubleshooting section above
2. Review backend logs
3. Check Zapier Zap History
4. Verify database connectivity

**Backend Logs:**
```bash
cd backend
npm run dev
```

**Database Check:**
```bash
psql -U postgres -d cmuq_companion
\dt  # List tables
SELECT * FROM events LIMIT 5;
```

---

**Setup Complete! 🎉**

You now have a fully functional email-based event parsing system integrated with your CMUQ Campus Companion App.
