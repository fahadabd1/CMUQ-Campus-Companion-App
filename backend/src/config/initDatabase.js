const pool = require('./database');

const createTables = async () => {
  const client = await pool.connect();

  try {
    console.log('Creating database tables...');

    // Create events table
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(50) DEFAULT 'Other',
        location VARCHAR(255),
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP,
        source VARCHAR(50) DEFAULT 'email',
        raw_email_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create index on start_time for faster queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_events_start_time
      ON events(start_time);
    `);

    // Create index on category
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_events_category
      ON events(category);
    `);

    console.log('✓ Database tables created successfully!');
    console.log('✓ Indexes created successfully!');

  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

// Run if called directly
if (require.main === module) {
  createTables()
    .then(() => {
      console.log('Database initialization complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}

module.exports = createTables;
