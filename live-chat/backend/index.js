const express = require('express');
const WebSocket = require('ws');

const app = express();
const port = 3000;

// Create an HTTP server using Express
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Create a WebSocket server instance
const wss = new WebSocket.Server({ server, cors: true });

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established.');

  // Handle messages from the client
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    // You can do something with the message here if needed.
  });

  // Handle WebSocket connection close
  ws.on('close', () => {
    console.log('WebSocket connection closed.');
  });
});
