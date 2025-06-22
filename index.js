const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Health check route only
app.get('/', (req, res) => res.send('✅ Basic server is alive!'));

// Start Server (no Firebase!)
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (Firebase disabled)`);
});
