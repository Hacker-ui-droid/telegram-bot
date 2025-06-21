const express = require('express');
const axios = require('axios');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Replace these:
const TOKEN = '7527972243:AAEwyICMlz0gLDhxNrVb5UilaZ2PLlUFIBw'; // your bot token
const TELEGRAM_CHAT_ID = '7342429597'; // your Telegram user ID
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

// ✅ Firebase Setup
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://fishing-16540-default-rtdb.firebaseio.com'
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

// ✅ Webhook Route (optional)
app.use(bodyParser.json());
app.post('/webhook', (req, res) => {
  const msg = req.body.message;

  if (msg && msg.chat && msg.chat.id) {
    const chatId = msg.chat.id;

    axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: `✅ Your Telegram Chat ID is: ${chatId}`
    }).catch(err => console.error('Telegram Error:', err.message));
  }

  res.sendStatus(200);
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
