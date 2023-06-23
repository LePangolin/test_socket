const express = require('express');
const app = express();
const { Serveur } = require('socket.io');

// STATIC FILES
app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/img"));
app.use("/ressources", express.static("./public/ressources"));

// ROUTER
app.use('/', require('./router/base_route'));
app.use('/controller', require('./router/route_controller'));

module.exports = app;

