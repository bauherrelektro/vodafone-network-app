// server.js
const express = require('express');
const { ExpressPeerServer } = require('peer'); // <--- CHANGED: Import ExpressPeerServer
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

// 1. Start the Express web server FIRST and capture its instance
const server = app.listen(port, () => {
    console.log(`Express web server (for PeerJS) listening on port ${port}`);
});

// 2. Create the PeerJS server using ExpressPeerServer and ATTACH IT to the Express server instance
const peerServer = ExpressPeerServer(server, { // <--- CHANGED: Use ExpressPeerServer
    path: '/', // <--- IMPORTANT: Set path to '/' here, as it's the root for PeerJS's internal routes
});

// 3. Mount the PeerJS server onto the Express app at the desired path
app.use('/myapp', peerServer); // <--- ADDED: Explicitly mount PeerJS at /myapp

peerServer.on('connection', (client) => {
    console.log(`PeerJS client connected: ${client.id}`);
});

peerServer.on('disconnect', (client) => {
    console.log(`PeerJS client disconnected: ${client.id}`);
});

peerServer.on('error', (error) => {
    console.error('PeerJS Server Error:', error);
});

console.log(`\nPeerJS signaling server is now integrated with Express using ExpressPeerServer.`);
console.log(`CORS is configured for origin: ${corsOptions.origin}`);
console.log(`Accessible via Render's public URL (e.g., https://your-server.onrender.com/myapp)`);

