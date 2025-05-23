// server.js
const express = require('express');
const { PeerServer } = require('peer');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8000;

// Configure CORS middleware to allow requests from your Static Site's origin
const corsOptions = {
    origin: 'https://vodafone-app-frontend.onrender.com', // Your Static Site URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// Removed this line: app.use(express.static(path.join(__dirname)));
// Your Static Site (vodafone-app-frontend.onrender.com) is already serving your HTML/CSS/JS.
// The Web Service only needs to focus on the PeerJS signaling.

// 1. Start the Express web server FIRST and capture its instance
const server = app.listen(port, () => {
    console.log(`Express web server (for PeerJS) listening on port ${port}`);
});

// 2. Create the PeerJS server, ATTACHING IT to the Express server instance
const peerServer = PeerServer({
    server: server,
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

