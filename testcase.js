const path = require('path');
const fs = require('fs');
const { createCarFile, uploadCarFile } = require('./src/carUtils');
const processCarFileAndMetadata = require('./src/samplingdata');
require('dotenv').config();

// Test variables
const testFolderPath = path.join(__dirname, './assetsfolder/testcollection/images');
const testOutputCarPath = path.join(__dirname, 'test-output-images.car');
const testMetadataFolderPath = path.join(__dirname, './assetsfolder/testcollection/metadata');
const testOutputMetadataCarPath = path.join(__dirname, 'test-output-metadata.car');

// Test: Create CAR file from images
const testCreateCarFile = async () => {
  try {
    const { carFilePath, rootCID } = await createCarFile(testFolderPath, testOutputCarPath);
    console.log(`✔ Test CAR file created successfully: ${carFilePath}`);
    console.log(`✔ Root CID: ${rootCID}`);
    return { carFilePath, rootCID };
  } catch (error) {
    console.error('❌ Test failed during CAR file creation:', error);
  }
};

// Test: Upload CAR file to Filebase
const testUploadCarFile = async (carFilePath) => {
  try {
    await uploadCarFile(carFilePath);
    console.log(`✔ Test CAR file uploaded successfully: ${carFilePath}`);
  } catch (error) {
    console.error('❌ Test failed during CAR file upload:', error);
  }
};

// Test: Create and Upload Metadata CAR file
const testCreateAndUploadMetadataCarFile = async (metadataFolderPath) => {
  try {
    const { carFilePath } = await createCarFile(metadataFolderPath, testOutputMetadataCarPath);
    console.log(`✔ Test Metadata CAR file created successfully: ${carFilePath}`);
    await uploadCarFile(carFilePath);
    console.log(`✔ Test Metadata CAR file uploaded successfully: ${carFilePath}`);
  } catch (error) {
    console.error('❌ Test failed during Metadata CAR file creation or upload:', error);
  }
};

// Test: Full process including metadata update
const testProcessCarFileAndMetadata = async () => {
  try {
    await processCarFileAndMetadata();
    console.log('✔ Test processCarFileAndMetadata executed successfully.');
  } catch (error) {
    console.error('❌ Test failed during processCarFileAndMetadata:', error);
  }
};

// Run tests
(async () => {
  console.log('Running tests...');

  // Test 1: Create and Upload CAR file from images
  const { carFilePath, rootCID } = await testCreateCarFile();
  if (carFilePath) {
    await testUploadCarFile(carFilePath);
  }

  // Test 2: Create and Upload Metadata CAR file
  await testCreateAndUploadMetadataCarFile(testMetadataFolderPath);

  // Test 3: Full process including metadata update
  await testProcessCarFileAndMetadata();

  console.log('All tests completed.');
})();
