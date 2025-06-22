const express = require('express');
const axios = require('axios');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Telegram Bot Setup
const TOKEN = '7527972243:AAEwyICMlz0gLDhxNrVb5UilaZ2PLlUFIBw';
const TELEGRAM_CHAT_ID = '7342429597';

// Try to load firebase-key.json from project root or /etc/secrets
let serviceAccount;
const localPath = path.join(__dirname, 'firebase-key.json');
const secretPath = '/etc/secrets/firebase-key.json';
try {
  const filePath = fs.existsSync(localPath) ? localPath : secretPath;
  const keyFile = fs.readFileSync(filePath, 'utf8');
  serviceAccount = JSON.parse(keyFile);
  console.log(`🔑 Loaded Firebase key from ${filePath}`);
} catch (err) {
  console.error('❌ Failed to load firebase-key.json from either location:', err);
  process.exit(1);
}

// Middleware
app.use(bodyParser.json());

// Firebase Setup
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://fishing-16540-default-rtdb.firebaseio.com'
});
const db = admin.database();
console.log('✅ Firebase initialized');

// Realtime Database Listener
db.ref('messages').on('child_added', (snapshot) => {
  const newData = snapshot.val();
  console.log('📩 New message from Firebase:', newData);

  const message = `🆕 New Firebase Entry:\n${JSON.stringify(newData, null, 2)}`;
  axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    chat_id: TELEGRAM_CHAT_ID,
    text: message
  })
  .then(() => console.log('✅ Sent message to Telegram'))
  .catch(err => console.error('❌ Telegram Error:', err.message));
});

// Webhook Route (Optional)
app.post('/webhook', (req, res) => {
  const msg = req.body.message;
  if (msg && msg.chat && msg.chat.id) {
    const chatId = msg.chat.id;
    console.log('📲 Webhook triggered by:', msg.text);
    axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: `✅ Your Telegram Chat ID is: ${chatId}`
    })
    .catch(err => console.error('❌ Telegram Error:', err.message));
  }
  res.sendStatus(200);
});

// Health check route
app.get('/', (req, res) => {
  res.send('✅ Bot is alive and connected to Firebase!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
