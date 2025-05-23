// server.js
const express = require('express');
const { PeerServer } = require('peer');
const path = require('path');

const app = express();
const port = process.env.PORT || 8000; // Render expects your app to listen on process.env.PORT (e.g., 10000)

// Serve static files from the current directory (where server.js is located)
app.use(express.static(path.join(__dirname)));

// 1. Start the Express web server FIRST and capture its instance
const server = app.listen(port, () => {
    console.log(`Express web server (for static files) listening on port ${port}`);
});

// 2. Now, create the PeerJS server, ATTACHING IT to the Express server instance
// This means PeerJS will use the SAME port (${port}) that Express is listening on
const peerServer = PeerServer({
    server: server, // <--- IMPORTANT: Attach PeerJS to the Express server
    path: '/myapp', // This path still needs to match your client-side config
    // No 'port' option needed here because it's using the 'server' instance's port
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
console.log(`Accessible via Render's public URL (e.g., https://your-server.onrender.com/myapp)`);
console.log(`Make sure your client-side HTML files use 'host: "vodafone-peerjs-server.onrender.com"', 'path: "/myapp"', and 'secure: true'.`);

