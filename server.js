const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto'); // For generating unique folder names

const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Function to get the next available folder number
const getNextFolderNumber = () => {
  const baseDir = path.join(__dirname, 'assetsfolder');
  let maxNumber = 0;

  // Read all folders in the assetsfolder directory
  const folders = fs.readdirSync(baseDir).filter(file => {
    return fs.statSync(path.join(baseDir, file)).isDirectory();
  });

  // Find the maximum folder number
  folders.forEach(folder => {
    const number = parseInt(folder, 10);
    if (!isNaN(number) && number > maxNumber) {
      maxNumber = number;
    }
  });

  // Return the next number
  return maxNumber + 1;
};

// Middleware to handle folder uploads
const handleFolderUpload = (req, res, next) => {
  const folderNumber = getNextFolderNumber(); // Get the next folder number
  req.uploadedFolder = folderNumber.toString(); // Store the folder number for later use
  next();
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use the folder number from the request object
    const baseDir = path.join(__dirname, 'assetsfolder', req.uploadedFolder);
    const subfolder = file.mimetype.startsWith('image/') ? 'images' : 'metadata';
    const folderPath = path.join(baseDir, subfolder);

    // Create the folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// Upload endpoint with folder handling middleware
app.post('/upload', handleFolderUpload, upload.any(), (req, res) => {
  res.send(`Files uploaded successfully to folder ${req.uploadedFolder}`);
});

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'upload.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
