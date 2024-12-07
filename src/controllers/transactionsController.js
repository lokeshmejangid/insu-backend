const ClientList = require("../models/clientListModel");
const Insurance = require("../models/insuranceModel");
const PoliciesList = require("../models/policiesListModel");
var mongoose = require('mongoose');

const getTransactions = async (req, res) => {
    try {
        const data = await Insurance.find();
        let newData = [];

        if (data) {
            for (const value of data) {
                let newDoc = { ...value._doc };
                var client_id = new mongoose.Types.ObjectId(value.clientId);
                const client = await ClientList.findById(client_id);
                var policy_id = new mongoose.Types.ObjectId(value.insurancePolicyId);
                const policy = await PoliciesList.findById(policy_id);
                if (client) {
                    newDoc.client = { ...client._doc };
                }
                if (policy) {
                    newDoc.policy = { ...policy._doc };
                }
                newData.push(newDoc);
            }
        }


        return res.status(200).json({ message: "All Transations", data: newData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", errorMessage: error });
    }
};


module.exports = {
    getTransactions
}