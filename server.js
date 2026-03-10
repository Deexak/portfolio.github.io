const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (HTML, CSS, JS, Images) from the current directory
app.use(express.static(path.join(__dirname, '')));

// Route for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Simple API endpoint to verify backend connection
app.get('/api/status', (req, res) => {
    res.json({
        status: 'success',
        message: 'Node.js Express server is up and serving your portfolio!',
        timestamp: new Date().toISOString()
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📡 API Status endpoint available at http://localhost:${PORT}/api/status`);
    console.log(`\nPress Ctrl+C to stop the server.`);
});
