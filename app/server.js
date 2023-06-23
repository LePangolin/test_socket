const express = require('express');
const app = require("./app");
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);
const fs = require('fs');

const { generateCode } = require('./helper/codeHelper');

let idsCar = [];
let verif = false;
let lastPos = 0;
let lastId = 0;



io.on('connection', async (socket) => {
    io.emit("connected");
    socket.on('disconnect', () => {
        io.emit("disconnected");
    });
    socket.on("message", (data) => {
        let jsonMessage = JSON.parse(fs.readFileSync("./json/messages.json"));
        jsonMessage.msg.push(data);
        fs.writeFileSync("./json/messages.json", JSON.stringify(jsonMessage));
        io.emit("message", data);
    });

    socket.on("getMessages", () => {
        let jsonMessage = JSON.parse(fs.readFileSync("./json/messages.json"));
        io.emit("getMessages", jsonMessage);
    });

    socket.on("addCube", (data) => {
        let jsonCube = JSON.parse(fs.readFileSync("./json/messages.json"));
        jsonCube.cube.push(data);
        fs.writeFileSync("./json/messages.json", JSON.stringify(jsonCube));
        io.emit("addCube", data);
    });

    socket.on("getCubes", () => {
        let jsonCube = JSON.parse(fs.readFileSync("./json/messages.json"));
        io.emit("getCubes", jsonCube);
    });

    socket.on("draw", (data) => {
        if(data.x == null || data.y == null || data.x == undefined || data.y == undefined || data.x == "" || data.y == "" || data.color == "" || data.color == null || data.color == undefined || data.size == "" || data.size == null || data.size == undefined){
            return;
        }
        let jsonDraw = JSON.parse(fs.readFileSync("./json/messages.json"));
        jsonDraw.lines.push(data);
        fs.writeFileSync("./json/messages.json", JSON.stringify(jsonDraw));
        io.emit("draw", data);
    });

    socket.on("getDraw", () => {
        let jsonDraw = JSON.parse(fs.readFileSync("./json/messages.json"));
        io.emit("getDraw", jsonDraw);
    });

    socket.on("newCar", () => {
        let jsonCar = JSON.parse(fs.readFileSync("./json/messages.json"));
        const code = generateCode();
        if(jsonCar.cars.length == 0){
            io.emit("getCars", {
                cars : []
            });
            jsonCar.cars.push({
                id : 0,
                code : code,
                x: 0,
                z: 0
            });
            fs.writeFileSync("./json/messages.json", JSON.stringify(jsonCar));
            io.emit("addCar", {
                id : 0,
                code : code,
                x: 0,
                z: 0
            })
        }
        else{
            lastPos += 2;
            lastId++;
            io.emit("getCars", {
                cars : jsonCar.cars,
            });
            jsonCar.cars.push({
                id : lastId,
                code : code,
                x : lastPos,
                z: 0
            });
            fs.writeFileSync("./json/messages.json", JSON.stringify(jsonCar));
            io.emit("addCar", {
                id : lastId,
                code : code,
                x : lastPos,
                z: 0
            });
        }

    });

    socket.on("moveCar", (data) => {
        let jsonCar = JSON.parse(fs.readFileSync("./json/messages.json"));
        jsonCar.cars[data.id].x = data.x;
        jsonCar.cars[data.id].z = data.z;
        fs.writeFileSync("./json/messages.json", JSON.stringify(jsonCar));
        io.emit("moveCar", data);
    });

    socket.on("disconnectCar", (data) => {
        idsCar.push(data.id);
        if(!verif){
            console.log("verif");
            verif = true;
            setTimeout(() => {
                console.log(idsCar);
                let idsCarDisconnect = [];
                let jsonCar = JSON.parse(fs.readFileSync("./json/messages.json"));
                let found = false;
                idsCar.forEach(element => {
                    jsonCar.cars.forEach((element2) => {
                        if(element == element2.id){
                            console.log("found");
                            found = true;
                        }
                    });
                    if(!found){
                        console.log("not found");
                        idsCarDisconnect.push(element);
                        jsonCar.cars.splice(jsonCar.cars.indexOf(
                            jsonCar.cars.find((element2) => {
                                return element2.id == element;
                            })
                        ), 1);
                    }
                });
                io.emit("disconnectCar", idsCarDisconnect);
                fs.writeFileSync("./json/messages.json", JSON.stringify(jsonCar));
                idsCar = [];
                verif = false;
            }, 1000);
        }
    });
});

server.listen(process.env.PORT , () => {
    console.log('Server is running on port ' + process.env.PORT);
});


