const path = require('path');
const fs = require('fs');
const { createCarFile, uploadCarFile } = require('./carUtils');
require('dotenv').config();

const folderPath = path.join(__dirname, '../assetsfolder/testcollection/images');
const outputCarPath = path.join(__dirname, 'test-output-images');
const metadataFolderPath = path.join(__dirname, '../assetsfolder/testcollection/metadata');
const outputMetadataCarPath = path.join(__dirname, 'test-output-metadata');

const getImageExtension = (fileName) => {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.mp4'];
  for (const ext of imageExtensions) {
    if (fs.existsSync(path.join(folderPath, `${fileName}${ext}`))) {
      return ext;
    }
  }
  return '.png'; // Default to .png if no other extension is found
};

const updateMetadataFiles = async (rootCID) => {
  try {
    const files = fs.readdirSync(metadataFolderPath).filter(file => file.endsWith('.json'));
    
    for (const file of files) {
      const filePath = path.join(metadataFolderPath, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const fileName = path.basename(file, '.json');
      const imageExtension = getImageExtension(fileName);
      data.image = `ipfs://${rootCID}/${fileName}${imageExtension}`;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      
      console.log(`Updated ${file} with new image URL.`);
    }
  } catch (error) {
    console.error('Error updating metadata files:', error);
  }
};

const processCarFileAndMetadata = async () => {
  try {
    const { carFilePath, rootCID } = await createCarFile(folderPath, outputCarPath);
    console.log(`Root CID for images: ${rootCID}`);
    await uploadCarFile(carFilePath);
    await updateMetadataFiles(rootCID);
    const { carFilePath: metadataCarFilePath } = await createCarFile(metadataFolderPath, outputMetadataCarPath);
    console.log(`Metadata CAR file created at: ${metadataCarFilePath}`);
    await uploadCarFile(metadataCarFilePath);
    
  } catch (error) {
    console.error('Error during the process:', error);
  }
};

module.exports = processCarFileAndMetadata;
