// server.js
const express = require('express');
const { PeerServer } = require('peer');
const path = require('path');
const cors = require('cors'); // <--- ADD THIS LINE

const app = express();
const port = process.env.PORT || 8000;

// Configure CORS middleware to allow requests from your Static Site's origin
const corsOptions = {
    origin: 'https://vodafone-app-frontend.onrender.com', // <--- IMPORTANT: REPLACE WITH YOUR EXACT STATIC SITE URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you send cookies/auth headers
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions)); // <--- USE CORS MIDDLEWARE

// Serve static files from the current directory (where server.js is located)
// Note: This 'express.static' is for the server itself, not the frontend.
// The frontend is served by the Static Site service.
app.use(express.static(path.join(__dirname)));

// 1. Start the Express web server FIRST and capture its instance
const server = app.listen(port, () => {
    console.log(`Express web server (for PeerJS and static files) listening on port ${port}`);
});

// 2. Create the PeerJS server, ATTACHING IT to the Express server instance
const peerServer = PeerServer({
    server: server, // <--- Attach PeerJS to the Express server
    path: '/myapp', // This path still needs to match your client-side config
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

console.log(`\nPeerJS signaling server is now integrated with Express.`);
console.log(`CORS is configured for origin: ${corsOptions.origin}`);
console.log(`Accessible via Render's public URL (e.g., https://your-server.onrender.com/myapp)`);

