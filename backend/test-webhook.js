/**
 * Test script to verify webhook endpoint is working
 * Run this AFTER starting your backend server
 *
 * Usage: node test-webhook.js
 */

const http = require('http');

// Test data matching your Zapier template format
const testEvent = {
  eventname: "Test Event - AI Workshop",
  eventdate: "December 10, 2025",
  eventime: "2:00 PM - 4:00 PM",
  eventlocation: "Building 2, Room 2301",
  eventcategory: "Academic",
  eventdescription: "This is a test event to verify the webhook integration is working correctly."
};

function testWebhook() {
  console.log('🧪 Testing webhook endpoint...');
  console.log('📤 Sending test data:', testEvent);
  console.log('');

  const postData = JSON.stringify(testEvent);

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/webhook/events',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(data);

        if (res.statusCode === 201) {
          console.log('✅ SUCCESS! Event created:');
          console.log('   ID:', response.event.id);
          console.log('   Title:', response.event.title);
          console.log('   Date:', response.event.date);
          console.log('   Location:', response.event.location);
          console.log('   Category:', response.event.category);
          console.log('');
          console.log('✓ Webhook is working correctly!');
          console.log('✓ You can now configure Zapier to use this endpoint');
        } else {
          console.error('❌ ERROR:', response.error);
          if (response.details) {
            console.error('   Details:', response.details);
          }
        }
      } catch (error) {
        console.error('❌ Failed to parse response:', error.message);
        console.error('Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Connection failed:', error.message);
    console.error('');
    console.error('Make sure:');
    console.error('  1. Backend server is running (npm run dev)');
    console.error('  2. PostgreSQL is running');
    console.error('  3. Database is initialized (npm run init-db)');
  });

  req.write(postData);
  req.end();
}

testWebhook();
