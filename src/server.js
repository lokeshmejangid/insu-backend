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

const corOptions = {
    origin: "*",
    methods: "POST, GET, PUT, DELETE",
    credentials: true
}

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

server.get("/", (req, res) => {
    return res.render("index");
});

// Initialize HTTP server for socket.io
const httpServer = http.createServer(server);
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000", "https://insu-backend-9dr5.onrender.com"], // Allow both localhost and production URLs
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true, // Allow credentials if needed
    },
});

// Socket.io logic
io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// Function to check for expiring insurances
const checkExpiringInsurances = async () => {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];

    const next7Days = new Date(today);
    next7Days.setDate(today.getDate() + 7);
    const formattedNext7Days = next7Days.toISOString().split('T')[0];

    console.log("Today's Date:", formattedToday);
    console.log("Checking for insurances expiring between:", formattedToday, "and", formattedNext7Days);

    try {
        // Query for insurances expiring in the next 7 days
        const expiringInsurances = await Insurance.find({
            expiryDate: { $gte: formattedToday, $lte: formattedNext7Days },
        }).exec();

        console.log("Expiring Insurances Found:", expiringInsurances);

        if (expiringInsurances.length > 0) {
            for (const insurance of expiringInsurances) {
                const clientId = insurance.clientId; // `clientId` is a string
                if (clientId) {
                    // Fetch the client data using the clientId string
                    const client = await Client.findOne({ _id: clientId }).exec();

                    if (client) {
                        const notification = {
                            message: `Insurance for ${client.name || "Unknown"} (Vehicle: ${insurance.vehicleRegNo}) is expiring in 7 days on ${insurance.expiryDate}`,
                            expiryDate: insurance.expiryDate,
                            client: {
                                name: client.name,
                                phone: client.phoneNumber,
                            },
                        };

                        console.log("Emitting notification:", notification); // Debug log
                        io.emit("insurance-expiry-notification", notification);
                    } else {
                        console.log(`Client not found for clientId: ${clientId}`);
                    }
                } else {
                    console.log(`No clientId found for insurance: ${insurance._id}`);
                }
            }
            console.log("Notifications sent for expiring insurances.");
        } else {
            console.log("No expiring insurances found.");
        }
    } catch (error) {
        console.error("Error fetching expiring insurances:", error);
    }
};

// Schedule the task to run every day at midnight (UTC)
//cron.schedule("0 0 * * *", checkExpiringInsurances);
checkExpiringInsurances();
// Connect to MongoDB and start server
CXN().then(() => {
    httpServer.listen(PORT, `0.0.0.0`, () => {
        console.log(`Server started on port ${PORT}`);
    });
});
