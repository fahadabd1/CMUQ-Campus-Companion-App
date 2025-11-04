# CMUQ Campus Companion - Backend API

Backend server for the CMUQ Campus Companion mobile app with Zapier Email Parser integration.

## Features

- ✉️ Receives event emails via Zapier Email Parser webhook
- 🗄️ PostgreSQL database for event storage
- 🔌 RESTful API for mobile app
- 🔒 CORS and security middleware
- 📝 Comprehensive logging

## Prerequisites

1. **Node.js** (v16 or higher)
2. **PostgreSQL** (v12 or higher)
3. **Zapier Account** (for Email Parser)

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure PostgreSQL Database

**Install PostgreSQL:**
- Windows: Download from https://www.postgresql.org/download/windows/
- Mac: `brew install postgresql`
- Linux: `sudo apt-get install postgresql`

**Create Database:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE cmuq_companion;

# Exit PostgreSQL
\q
```

### 3. Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env file with your settings
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
DB_PASSWORD=YOUR_POSTGRES_PASSWORD

# CORS (add your mobile app URLs)
ALLOWED_ORIGINS=http://localhost:8081,exp://localhost:8081
```

### 4. Initialize Database Tables

```bash
npm run init-db
```

You should see:
```
✓ Connected to PostgreSQL database
Creating database tables...
✓ Database tables created successfully!
✓ Indexes created successfully!
Database initialization complete!
```

### 5. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will start on http://localhost:3000

## API Endpoints

### Mobile App Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events/today` | Get today's events |
| GET | `/api/events/upcoming` | Get upcoming events (limit=50) |
| GET | `/api/events/range?start_date=2025-11-01&end_date=2025-11-30` | Get events by date range |
| GET | `/api/events/category/:category` | Get events by category (Academic, Student Life, Sports, Other) |
| GET | `/api/events/:id` | Get event by ID |

### Webhook Endpoints (for Zapier)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/webhook/events` | Receive parsed email from Zapier |
| GET | `/webhook/health` | Health check |

## Zapier Configuration

### Step 1: Create Zap

1. Go to https://zapier.com/app/zaps
2. Click **"Create Zap"**
3. Name it: "CMUQ Events Email Parser"

### Step 2: Configure Trigger

1. **App**: Search for "Email Parser by Zapier"
2. **Event**: "New Email"
3. **Account**: Connect your Zapier Email Parser mailbox
4. **Mailbox**: Select your mailbox (companioncmuq@robot.zapier.com)
5. Click **"Continue"**
6. **Test**: Send a test email and verify it's received

### Step 3: Add Filter (Optional but Recommended)

1. Click **"+"** to add a step
2. Select **"Filter"**
3. **Condition**: "Subject" → "Text Contains" → "event" (case insensitive)
4. This ensures only event-related emails trigger the webhook

### Step 4: Configure Action (Webhook to Your Server)

1. Click **"+"** to add an action
2. **App**: Search for "Webhooks by Zapier"
3. **Event**: "POST"
4. **URL**: `http://YOUR_SERVER_IP:3000/webhook/events`
   - For local testing: Use ngrok (see below)
   - For production: Use your deployed server URL

5. **Payload Type**: "JSON"
6. **Data**: Map the fields from Email Parser:
   ```json
   {
     "event_title": [Event Title from email],
     "date": [Date from email],
     "time": [Time from email],
     "location": [Location from email],
     "category": [Category from email],
     "description": [Description from email]
   }
   ```
7. **Headers** (optional):
   - `Content-Type`: `application/json`

8. Click **"Continue"** and **"Test"**
9. **Turn on Zap**

### Using ngrok for Local Testing

If you want to test locally before deploying:

```bash
# Install ngrok
npm install -g ngrok

# Start your backend server
npm run dev

# In another terminal, expose port 3000
ngrok http 3000
```

Copy the ngrok URL (e.g., `https://abc123.ngrok.io`) and use it in Zapier:
- Webhook URL: `https://abc123.ngrok.io/webhook/events`

## Testing

### Test Webhook Endpoint

```bash
curl -X POST http://localhost:3000/webhook/events \
  -H "Content-Type: application/json" \
  -d '{
    "event_title": "Test Event",
    "date": "November 20, 2025",
    "time": "2:00 PM - 4:00 PM",
    "location": "Student Center",
    "category": "Academic",
    "description": "This is a test event"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Event created successfully",
  "event": {
    "id": 1,
    "title": "Test Event",
    ...
  }
}
```

### Test API Endpoints

```bash
# Get today's events
curl http://localhost:3000/api/events/today

# Get upcoming events
curl http://localhost:3000/api/events/upcoming

# Get events by category
curl http://localhost:3000/api/events/category/Academic
```

## Deployment

### Option 1: Railway (Recommended - Free Tier)

1. Go to https://railway.app/
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Add PostgreSQL:
   - Click **"+"** → **"Database"** → **"PostgreSQL"**
6. Add environment variables in Railway dashboard
7. Railway will auto-deploy on every git push

### Option 2: Render (Free Tier)

1. Go to https://render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
5. Add PostgreSQL:
   - Click **"New +"** → **"PostgreSQL"**
6. Add environment variables
7. Click **"Create Web Service"**

### Option 3: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create cmuq-companion-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Initialize database
heroku run npm run init-db
```

## Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
- Ensure PostgreSQL is running: `sudo service postgresql start` (Linux) or check Services (Windows)
- Verify credentials in `.env` file
- Check PostgreSQL is listening on port 5432

### Zapier Webhook Not Working

**Check:**
1. Server is running and accessible
2. Firewall allows incoming connections on port 3000
3. Zapier webhook URL is correct
4. Email contains the word "event" (if using filter)
5. Check Zapier Zap History for errors

### CORS Error from Mobile App

**Solution:**
Add your mobile app URL to `ALLOWED_ORIGINS` in `.env`:
```env
ALLOWED_ORIGINS=http://localhost:8081,exp://localhost:8081,https://your-expo-app.com
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # PostgreSQL connection
│   │   └── initDatabase.js      # Database initialization
│   ├── controllers/
│   │   ├── eventsController.js  # Events API logic
│   │   └── webhookController.js # Zapier webhook handler
│   ├── models/
│   │   └── Event.js            # Event model
│   ├── routes/
│   │   ├── eventsRoutes.js     # API routes
│   │   └── webhookRoutes.js    # Webhook routes
│   └── server.js               # Main server file
├── .env                        # Environment variables
├── .env.example               # Example env file
├── package.json               # Dependencies
└── README.md                  # This file
```

## Support

For issues or questions, contact the development team.

## License

MIT
