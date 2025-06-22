const express = require('express');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Load Firebase service account from secret file
let serviceAccount;
try {
  const keyPath = path.join(__dirname, 'firebase-key.json');
  const keyFile = fs.readFileSync(keyPath, 'utf8');
  serviceAccount = JSON.parse(keyFile);
  console.log(`🔑 Loaded Firebase key from ${keyPath}`);
} catch (err) {
  console.error('❌ Failed to load firebase-key.json:', err);
  process.exit(1);
}

// Initialize Firebase
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://fishing-16540-default-rtdb.firebaseio.com'
  });
  console.log('✅ Firebase initialized successfully');
} catch (err) {
  console.error('❌ Firebase initialization error:', err);
  process.exit(1);
}

// Health-check route
app.get('/', (req, res) => {
  res.send('✅ Firebase test server alive');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
