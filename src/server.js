require("dotenv").config();
const path = require("path");
const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");
const cors = require("cors");
const CXN = require('./config/dbConfig');
const Insurance = require("./models/insuranceModel");
const Client = require("./models/clientListModel"); // Assuming you have a client model
const authRouter = require("./routes/authRouter");
const categoryListRouter = require("./routes/categoryListRouter");
const policiesListRouter = require("./routes/policiesListRouter");
const clientListRouter = require("./routes/clientListRouter");
const insuranceRouter = require("./routes/insuranceRouter");
const dashboardRouter = require("./routes/dashboardRouter");
const transactionsRouter = require("./routes/transactionsRouter");
const notificationRouter = require("./routes/notificationaRouter");

const corOptions = {
    origin: "*", // Allow localhost (dev) and deployed frontend
    methods: ["POST", "GET", "PUT", "DELETE"], // HTTP methods allowed
    allowedHeaders: ["Content-Type"], // Headers allowed
    credentials: true, // Send cookies with requests
};

const server = express();
const PORT = 9000;

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

server.use(cors(corOptions));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use('/api/auth', authRouter);
server.use('/api/category', categoryListRouter);
server.use('/api/policies', policiesListRouter);
server.use('/api/client', clientListRouter);
server.use('/api/insurance', insuranceRouter);
server.use('/api/dashboard', dashboardRouter);
server.use('/api/transactions', transactionsRouter);
server.use('/api/notifications', notificationRouter);

server.get("/", (req, res) => {
    return res.render("index");
});

// Initialize HTTP server for socket.io
const httpServer = http.createServer(server);

// Connect to MongoDB and start server
CXN().then(() => {
    httpServer.listen(PORT, `0.0.0.0`, () => {
        console.log(`Server started on port ${PORT}`);
    });
});
