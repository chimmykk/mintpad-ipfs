// server.js
const express = require('express');
const processCarFileAndMetadata = require('./src/samplingdata');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.get('/uploadtoipfs', async (req, res) => {
  try {
    await processCarFileAndMetadata();
    res.status(200).json({ message: 'Process completed successfully.' });
  } catch (error) {
    console.error('Error in main process:', error);
    res.status(500).json({ error: 'Error in main process.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
