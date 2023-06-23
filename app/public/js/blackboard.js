const socket = io();
let connected = false;

document.addEventListener("DOMContentLoaded", () => {
    init();
});


function init(){
    let canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let ctx = canvas.getContext("2d");
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    let mouse = {x: 0, y: 0};
    let drawing = false;
    // black color
    let color = "#000000";
    let size = 5;
    canvas.addEventListener("click", (e) => {
        draw(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    });
    function draw(x, y){
        let data = {x, y, color, size};

        socket.emit("draw", data);
        drawOnCanvas(data);
    }
    function drawOnCanvas(data){
        ctx.beginPath();
        ctx.strokeStyle = data.color;
        ctx.lineWidth = data.size;
        ctx.lineCap = "round";
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(data.x, data.y);
        ctx.stroke();
        ctx.closePath();
        mouse.x = data.x;
        mouse.y = data.y;
    }

    socket.on("draw", (data) => {
        drawOnCanvas(data);
    });

    socket.on("connected", () => {
        if(!connected){
            socket.emit("getDraw");
        }
    });

    socket.on("getDraw", (data) => {
        if(!connected){
            connected = true;
            data.lines.forEach(element => {
                drawOnCanvas(element);
            });
        }
    });
}