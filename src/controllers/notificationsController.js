const ClientList = require("../models/clientListModel");
const Insurance = require("../models/insuranceModel");
const PoliciesList = require("../models/policiesListModel");
var mongoose = require('mongoose');

const getNotifications = async (req, res) => {
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];

    const next7Days = new Date(today);
    next7Days.setDate(today.getDate() + 7);
    const formattedNext7Days = next7Days.toISOString().split("T")[0];

    console.log("Checking for insurances expiring between:", formattedToday, "and", formattedNext7Days);

    try {
        const expiringInsurances = await Insurance.find({
            expiryDate: { $gte: formattedToday, $lte: formattedNext7Days },
        }).exec();

        if (expiringInsurances.length > 0) {
            const notifications = await Promise.all(
                expiringInsurances.map(async (insurance) => {
                    const client = await ClientList.findOne({ _id: insurance.clientId }).exec();
                    if (client) {
                        return {
                            message: `Insurance for ${client.name || "Unknown"} (Vehicle: ${insurance.vehicleRegNo}) is expiring on ${insurance.expiryDate}`,
                            expiryDate: insurance.expiryDate,
                            client: {
                                name: client.name,
                                phone: client.phoneNumber,
                            },
                        };
                    }
                })
            );
            res.status(200).json(notifications.filter(Boolean));
        } else {
            res.status(200).json([]);
        }
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
};
module.exports = {
    getNotifications
}