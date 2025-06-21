const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const TOKEN = 'YOUR_BOT_TOKEN'; // replace with your real token
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

app.post('/webhook', async (req, res) => {
    const message = req.body.message;
    if (message?.text) {
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: message.chat.id,
            text: `You said: ${message.text}`
        });
    }
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot running on port ${PORT}`));
