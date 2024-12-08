const ClientList = require("../models/clientListModel");
const Insurance = require("../models/insuranceModel");
const PoliciesList = require("../models/policiesListModel");

const getDashboard = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        let dashboardData = {};

        // Count active and inactive policies
        let activePolicies = await PoliciesList.find({ status: true });
        let inactivePolicies = await PoliciesList.find({ status: false });
        let clients = await ClientList.find();
        let insuredVehicle = await Insurance.find();

        // Prepare stats
        dashboardData = {
            activePoliciesCount: activePolicies.length,
            inactivePoliciesCount: inactivePolicies.length,
            clientsCount: clients.length,
            insuredVehicleCount: insuredVehicle.length,
        };

        // Generate bar chart data for monthly active/inactive policies
        const policies = await PoliciesList.find({
            createdAt: { $gte: new Date(`${currentYear}-01-01`), $lte: new Date(`${currentYear}-12-31`) }, // Filter policies created this year
        });

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyBarData = months.map((month) => ({ name: month, Active: 0, Inactive: 0 }));

        policies.forEach((policy) => {
            const month = new Date(policy.createdAt).getMonth(); // Get month index (0 for Jan, 11 for Dec)
            if (policy.status) {
                monthlyBarData[month].Active += 1; // Increment active policies
            } else {
                monthlyBarData[month].Inactive += 1; // Increment inactive policies
            }
        });

        // Attach bar chart data to the response
        dashboardData.barChartData = monthlyBarData;

        // Generate line chart data for monthly client and policy growth
        const clientsData = await ClientList.find({
            createdAt: { $gte: new Date(`${currentYear}-01-01`), $lte: new Date(`${currentYear}-12-31`) },
        });

        const monthlyLineData = months.map((month) => ({ month, Clients: 0, Policies: 0 }));

        // Count clients added per month
        clientsData.forEach((client) => {
            const month = new Date(client.createdAt).getMonth();
            monthlyLineData[month].Clients += 1;
        });

        // Count policies added per month
        policies.forEach((policy) => {
            const month = new Date(policy.createdAt).getMonth();
            monthlyLineData[month].Policies += 1;
        });

        // Attach line chart data to the response
        dashboardData.lineChartData = monthlyLineData;

        return res.status(200).json({
            message: "Dashboard Stats",
            data: dashboardData,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            errorMessage: error,
        });
    }
};

module.exports = {
    getDashboard,
};
