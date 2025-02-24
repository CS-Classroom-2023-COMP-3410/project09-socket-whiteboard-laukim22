const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",  // Allow all origins for simplicity
        methods: ["GET", "POST"]
    }
});

//NECESSARY-- to access css styling
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Store board state
let boardState = [];


io.on("connection", (socket) => {
    console.log("A user connected");

    // TEST
    socket.on('test', (data) => {
        console.log('Test message received:', data);
    });

    // Send current board state to the new user
    socket.emit("board_state", boardState);

    // Listen for drawing actions
    socket.on("draw", ({ x, y, color }) => {
        console.log("Inside the draw event listener"); //check this
        console.log("Server received draw:", { x, y, color });
        boardState.push({ x, y, color });
        io.emit("draw", { x, y, color });
        console.log("Server emitted draw:", { x, y, color });
    });
    
    
    // Listen for board clear event
    socket.on("clear", () => {
        boardState = [];
        io.emit("clear");  // Clear the board for all clients
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});
