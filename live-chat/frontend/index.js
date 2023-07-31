const socket = new WebSocket('ws://34.121.177.172');
console.log("hello world")

socket.onopen = () => {
  console.log('WebSocket connection opened.');
  socket.send('Hello, WebSocket Server!');
};

socket.onmessage = (event) => {
  console.log('Received message from server:', event.data);
};

socket.onclose = () => {
  console.log('WebSocket connection closed.');
};