// server.js
const express = require('express');
const { PeerServer } = require('peer');
const path = require('path');
// const https = require('https'); // Removed for Render
// const fs = require('fs');     // Removed for Render

const app = express();
const port = process.env.PORT || 8000; // Use process.env.PORT for Render, fallback to 8000
const peerPort = process.env.PEER_PORT || 9000; // Use process.env.PEER_PORT, fallback to 9000

// Serve static files (your HTML, CSS, JS) from the current directory
app.use(express.static(path.join(__dirname)));

// Create the PeerJS server (no SSL config here, Render handles HTTPS/WSS)
const peerServer = PeerServer({
    port: peerPort, // This will be the internal port
    path: '/myapp',
    // ssl property removed
});

peerServer.on('connection', (client) => {
    console.log(`PeerJS client connected: ${client.id}`);
});

peerServer.on('disconnect', (client) => {
    console.log(`PeerJS client disconnected: ${client.id}`);
});

peerServer.on('error', (error) => {
    console.error('PeerJS Server Error:', error);
});

// Start the Express web server
// Use app.listen instead of httpsServer.listen
app.listen(port, () => {
    console.log(`Web server running internally on port ${port}`);
    console.log(`PeerJS signaling server running internally on port ${peerPort}/myapp`);
    console.log(`\nOnce deployed on Render, these will be accessible via HTTPS/WSS provided by Render.`);
    console.log(`You will update your client-side code (mobile and desktop HTML) to use Render's URLs.`);
});
