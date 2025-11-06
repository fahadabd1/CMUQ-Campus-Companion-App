import * as SQLite from 'expo-sqlite';

// Open database
const db = SQLite.openDatabaseSync('CampusCompanion.db');

export const initDatabase = () => {
  try {
    // Create all tables in one transaction
    db.execSync(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        location TEXT,
        start_time TEXT NOT NULL,
        end_time TEXT,
        link TEXT,
        source TEXT DEFAULT 'manual',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS schedule (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_code TEXT NOT NULL,
        course_name TEXT,
        instructor TEXT,
        location TEXT,
        day_of_week INTEGER,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        color TEXT DEFAULT '#3B82F6'
      );

      CREATE TABLE IF NOT EXISTS lost_found (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
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

      CREATE TABLE IF NOT EXISTS preferences (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);

    // Migration: Add 'source' column to events table if it doesn't exist
    try {
      db.execSync(`ALTER TABLE events ADD COLUMN source TEXT DEFAULT 'manual';`);
      console.log('✓ Added source column to events table');
    } catch (error) {
      // Column already exists or other error - this is fine
      if (!error.message.includes('duplicate column')) {
        console.log('Source column already exists or migration not needed');
      }
    }

    // Migration: Add 'link' column to events table if it doesn't exist
    try {
      db.execSync(`ALTER TABLE events ADD COLUMN link TEXT;`);
      console.log('✓ Added link column to events table');
    } catch (error) {
      // Column already exists or other error - this is fine
      if (!error.message.includes('duplicate column')) {
        console.log('Link column already exists or migration not needed');
      }
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export default db;
