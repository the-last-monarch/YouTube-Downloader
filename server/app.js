const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.post('/download', (req, res) => {
    const videoURL = req.body.url;
    const outputPath = path.join(__dirname, '../downloads');

    // Create 'downloads' folder if it doesn't exist
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
    }

    const filename = `video-${Date.now()}.mp4`;

    // Correctly specify the path to yt-dlp.exe (in root folder)
    const ytDlpPath = path.join(__dirname, '../yt-dlp.exe');
    const command = `"${ytDlpPath}" -o "${outputPath}\\${filename}" "${videoURL}"`;

    // Execute the download command
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error downloading video: ${error.message}`);
            return res.status(500).send('Error downloading video.');
        }

        // Verify if the file exists before sending the download response
        const filePath = path.join(outputPath, filename);
        
        // Check if the file exists before trying to send it
        if (!fs.existsSync(filePath)) {
            console.error('Downloaded file not found.');
            return res.status(500).send('File not found after download.');
        }

        // Once download is complete, send the file to the client
        res.download(filePath, filename, (err) => {
            if (err) {
                console.error('Download failed:', err);
                return res.status(500).send('Download failed.');
            }

            // Clean up: delete the file after sending it
            fs.unlinkSync(filePath);
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
