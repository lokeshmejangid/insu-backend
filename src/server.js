require("dotenv").config();
const path = require("path");
const express = require('express');
const server = express();
const PORT = 9000;

const cors = require("cors");
const CXN = require('./config/dbConfig');
const authRouter = require("./routes/authRouter");
const categoryListRouter = require("./routes/categoryListRouter");
const policiesListRouter = require("./routes/policiesListRouter");
const clientListRouter = require("./routes/clientListRouter");
const insuranceRouter = require("./routes/insuranceRouter");
const dashboardRouter = require("./routes/dashboardRouter");
const transactionsRouter = require("./routes/transactionsRouter");

const corOptions = {
    origin: "*",
    methods: "POST, GET, PUT, DELETE",
    Credential: true
}

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



server.get("/", (req, res) => {
    return res.render("index");
});

CXN().then(() => {
    server.listen(PORT, `0.0.0.0`, () => {
        console.log("Server Started");
    });
});