require('dotenv').config();

const processCarFileAndMetadata = require('./samplingdata');

processCarFileAndMetadata()
  .then(() => {
    console.log('Process completed successfully.');
  })
  .catch((error) => {
    console.error('Error in main process:', error);
  });
