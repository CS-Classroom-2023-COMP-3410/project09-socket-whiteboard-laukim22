const socket = io("http://localhost:3000");//explicitly connect!
 
// socket.on("connect", () => {
//     console.log("Connected to server!");
// });

socket.on("connect_error", (err) => {
    console.error("Connection failed:", err);
});


const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const clearButton = document.getElementById("clearBoard");
let drawing = false;
// let draw = false;
let color = "#000000";

// Set canvas size
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.6;

canvas.addEventListener("mousedown", () => drawing = true);
// canvas.addEventListener("mousedown", () => draw = true);
canvas.addEventListener("mouseup", () => drawing = false);
// canvas.addEventListener("mouseup", () => draw = false);

canvas.addEventListener("mousemove", draw);
colorPicker.addEventListener("change", (e) => color = e.target.value);
clearButton.addEventListener("click", () => socket.emit("clear"));



//TEST
socket.on("connect", () => {
    console.log("Connected to Socket.IO server on port 3000");
    socket.emit('test', { message: 'Hello, server!' });
});

///adddeeeddd
// socket.on("connect", () => {
//     console.log("Connected to Socket.IO server on port 3000");

// });


console.log("Client-side JS loaded")

// Listen for the full board state when a new client connects
socket.on("board_state", (state) => {
    // Re-render the board with the previous drawing actions
    state.forEach((drawData) => {
        ctx.fillStyle = drawData.color;
        ctx.fillRect(drawData.x, drawData.y, 5, 5);
    });
});

// Listen for new draw events from the server
socket.on("draw", ({ x, y, color }) => {
    console.log("Client log")
    console.log("Drawing:", { x, y, color });  // Log for debugging
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 5, 5);
});



// Emit the draw event when the user moves the mouse
function draw(event) {
    if (!drawing) return;
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;
    
    socket.emit("draw", { x, y, color });
    console.log("Emitted draw:", { x, y, color });  // Log before emitting
}



// Listen for clear events from the server
socket.on("clear", () => ctx.clearRect(0, 0, canvas.width, canvas.height));