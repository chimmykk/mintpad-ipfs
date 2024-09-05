const path = require('path');
const fs = require('fs');
const { createCarFile, uploadCarFile } = require('./carUtils');
require('dotenv').config();

const baseDir = path.join(__dirname, '../assetsfolder');

// Function to get image extension
const getImageExtension = (fileName, folderPath) => {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.mp4'];
  for (const ext of imageExtensions) {
    if (fs.existsSync(path.join(folderPath, `${fileName}${ext}`))) {
      return ext;
    }
  }
  return '.png'; // Default to .png if no other extension is found
};

// Function to update metadata files
const updateMetadataFiles = async (metadataFolderPath, rootCID) => {
  try {
    const files = fs.readdirSync(metadataFolderPath).filter(file => file.endsWith('.json'));
    
    for (const file of files) {
      const filePath = path.join(metadataFolderPath, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const fileName = path.basename(file, '.json');
      const imageExtension = getImageExtension(fileName, path.join(metadataFolderPath, '..', 'images'));
      data.image = `ipfs://${rootCID}/${fileName}${imageExtension}`;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      
      console.log(`Updated ${file} with new image URL.`);
    }
  } catch (error) {
    console.error('Error updating metadata files:', error);
  }
};

// Function to process a single folder
const processFolder = async (folderName) => {
  const folderPath = path.join(baseDir, folderName, 'images');
  const outputCarPath = path.join(__dirname, 'test-output-images');
  const metadataFolderPath = path.join(baseDir, folderName, 'metadata');
  const outputMetadataCarPath = path.join(__dirname, 'test-output-metadata');

  try {
    const { carFilePath, rootCID } = await createCarFile(folderPath, outputCarPath);
    console.log(`Root CID for images in folder ${folderName}: ${rootCID}`);
    await uploadCarFile(carFilePath);
    await updateMetadataFiles(metadataFolderPath, rootCID);
    const { carFilePath: metadataCarFilePath } = await createCarFile(metadataFolderPath, outputMetadataCarPath);
    console.log(`Metadata CAR file created at: ${metadataCarFilePath}`);
    await uploadCarFile(metadataCarFilePath);

    // Optionally delete the processed folder
    fs.rmdirSync(path.join(baseDir, folderName), { recursive: true });
    console.log(`Deleted folder ${folderName}`);
    
  } catch (error) {
    console.error(`Error processing folder ${folderName}:`, error);
  }
};

// Function to process all numbered folders
const processAllFolders = async () => {
  try {
    const folders = fs.readdirSync(baseDir).filter(file => {
      return fs.statSync(path.join(baseDir, file)).isDirectory() && !isNaN(parseInt(file, 10));
    });

    for (const folder of folders) {
      await processFolder(folder);
    }
    
  } catch (error) {
    console.error('Error processing folders:', error);
  }
};

// Export the function
module.exports = processAllFolders;
