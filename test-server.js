// Simple test server
const express = require('express');
const app = express();

app.use(express.json());

app.get('/test', (req, res) => {
  res.json({ success: true, message: 'Test server working!' });
});

app.listen(4243, () => {
  console.log('Test server running on port 4243');
});
