const express = require('express');
const axios = require('axios');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Replace these:
const TOKEN = '7527972243:AAEwyICMlz0gLDhxNrVb5UilaZ2PLlUFIBw'; // your bot token
const TELEGRAM_CHAT_ID = 'YOUR_TELEGRAM_CHAT_ID'; // <-- you’ll get this below
const serviceAccount = require('./your-firebase-key.json'); // path to downloaded JSON

// ✅ Firebase Setup
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project-id.firebaseio.com'
});

const db = admin.database();

// ✅ Realtime Database Listener
db.ref('messages').on('child_added', (snapshot) => {
  const newData = snapshot.val();
  const message = `🆕 New Firebase Entry:\n${JSON.stringify(newData, null, 2)}`;

  axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    chat_id: TELEGRAM_CHAT_ID,
    text: message
  }).catch(err => console.error('Telegram Error:', err.message));
});

// ✅ Webhook Route (optional, in case user still messages bot)
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const msg = req.body.message;
  if (msg && msg.chat && msg.text) {
    console.log("Chat ID:", msg.chat.id); // Copy this value for TELEGRAM_CHAT_ID
    axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {

      chat_id: msg.chat.id,
      text: `You said: ${msg.text}`
    });
  }
  res.sendStatus(200);
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
