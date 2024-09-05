const { packToFs } = require('ipfs-car/pack/fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

const s3 = new S3Client({
  endpoint: 'https://s3.filebase.com',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'A0868E2870B1D4049F99', 
    secretAccessKey: 'iJSfqWT3w2SgAQ3EFbN0DZsotm4zhLG81vOX3Wif',
  },
});

const bucketName = 'koireng';

const createCarFile = async (folderPath, outputCarPath) => {
  try {
    const { root } = await packToFs({
      input: folderPath,
      output: outputCarPath,
      wrapWithDirectory: false,  
    });

    console.log('CAR file created successfully.');
    console.log(`Root CID: ${root}`);
    return { carFilePath: outputCarPath, rootCID: root };
  } catch (error) {
    console.error(`Error creating CAR file: ${error.message}`);
    throw error;
  }
};

const uploadCarFile = async (carFilePath) => {
  try {
    const fileStream = fs.createReadStream(carFilePath);
    const params = {
      Bucket: bucketName,
      Key: path.basename(carFilePath),
      Body: fileStream,
      Metadata: {
        'import': 'car'
      }
    };

    const command = new PutObjectCommand(params);
    const response = await s3.send(command);

    console.log(`ETag for the uploaded CAR file: ${response.ETag}`);

  } catch (error) {
    console.error('Error uploading CAR file:', error);
  } finally {
    fs.unlinkSync(carFilePath);
  }
};

module.exports = {
  createCarFile,
  uploadCarFile,
};
