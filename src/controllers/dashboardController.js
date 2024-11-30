const ClientList = require("../models/clientListModel");
const Insurance = require("../models/insuranceModel");
const PoliciesList = require("../models/policiesListModel");

const getDashboard = async (req, res) => {
    try {
        let newData = {};

        let activePolicies = await PoliciesList.find({ status: true });
        let inactivePolicies = await PoliciesList.find({status: false});
        let clients = await ClientList.find();
        let insuredVehicle = await Insurance.find();

        newData = {
            activePoliciesCount: activePolicies.length,
            inactivePoliciesCount: inactivePolicies.length,
            clientsCount: clients.length,
            insuredVehicleCount: insuredVehicle.length
        }
        

        return res.status(200).json({ message: "Get All Insurance Information", data: newData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", errorMessage: error });
    }
};


module.exports = {
    getDashboard
}