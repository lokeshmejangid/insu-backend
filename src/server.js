require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");
const CXN = require("./config/dbConfig");
const Insurance = require("./models/insuranceModel");
const Client = require("./models/clientListModel"); // Import the Client model

const server = express();
const httpServer = http.createServer(server);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = 9000;

// Middleware
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// Routers
server.use("/api/insurance", require("./routes/insuranceRouter"));

// Socket.io logic
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Function to check for expiring insurances and notify 7 days before expiry
const checkExpiringInsurances = async () => {
  const today = new Date();
  
  // Format today's date as YYYY-MM-DD (ignoring time)
  const formattedToday = today.toISOString().split('T')[0];
  console.log("Today's Date:", formattedToday);

  try {
    // Find insurances that are expiring 7 days from today
    const next7Days = new Date(today);
    next7Days.setDate(today.getDate() + 7);
    const formattedNext7Days = next7Days.toISOString().split('T')[0]; // Get date only, no time part

    console.log("Checking for insurances expiring between:", formattedToday, "and", formattedNext7Days);

    // Find insurances expiring between today and the next 7 days
    const expiringInsurances = await Insurance.find({
      expiryDate: { $gte: formattedToday, $lte: formattedNext7Days },
    })
    .populate("clientId") // Populate the client data based on the `clientId` field
    .exec();

    console.log("Expiring Insurances Found:", expiringInsurances);

    if (expiringInsurances.length > 0) {
      // Emit notifications for each expiring insurance
      expiringInsurances.forEach((insurance) => {
        // Ensure that `clientId` has been populated
        const client = insurance.clientId;
        if (client) {
          io.emit("insurance-expiry-notification", {
            message: `Insurance for ${client.name || "Unknown"} (Vehicle: ${insurance.vehicleRegNo}) is expiring in 7 days on ${insurance.expiryDate}`,
            expiryDate: insurance.expiryDate,
            client: {
              name: client.name,
              email: client.email, // Example of including other client data
              phone: client.phone, // You can include other fields as needed
            },
          });
        }
      });
      console.log("Notifications sent for expiring insurances.");
    } else {
      console.log("No expiring insurances found.");
    }
  } catch (error) {
    console.error("Error fetching expiring insurances:", error);
  }
};

// Schedule the task to run every day at midnight
//cron.schedule("0 0 * * *", checkExpiringInsurances);
checkExpiringInsurances();
// Start the server
CXN().then(() => {
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started on port ${PORT}`);
  });
});
