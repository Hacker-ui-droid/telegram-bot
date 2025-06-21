const express = require('express');
const axios = require('axios');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Telegram Bot Setup
const TOKEN = '7527972243:AAEwyICMlz0gLDhxNrVb5UilaZ2PLlUFIBw'; // your bot token
const TELEGRAM_CHAT_ID = '7342429597'; // your Telegram user ID

// ✅ Load Firebase credentials from Render environment
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

// ✅ Middleware
app.use(bodyParser.json());

// ✅ Firebase Setup
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://fishing-16540-default-rtdb.firebaseio.com'
});

const db = admin.database();
console.log("✅ Firebase initialized");

// ✅ Realtime Database Listener
db.ref('messages').on('child_added', (snapshot) => {
  const newData = snapshot.val();
  const message = `🆕 New Firebase Entry:\n${JSON.stringify(newData, null, 2)}`;
  console.log("📩 New message detected from Firebase:");
  console.log(newData);

  axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    chat_id: TELEGRAM_CHAT_ID,
    text: message
  }).then(() => {
    console.log("✅ Sent message to Telegram");
  }).catch(err => {
    console.error('❌ Telegram Error:', err.message);
  });
});

// ✅ Webhook Route (Optional)
app.post('/webhook', (req, res) => {
  const msg = req.body.message;

  if (msg && msg.chat && msg.chat.id) {
    const chatId = msg.chat.id;
    console.log("📲 Webhook triggered by:", msg.text);

    axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: `✅ Your Telegram Chat ID is: ${chatId}`
    }).catch(err => console.error('❌ Telegram Error:', err.message));
  }

  res.sendStatus(200);
});

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('✅ Bot is alive and connected to Firebase!');
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
