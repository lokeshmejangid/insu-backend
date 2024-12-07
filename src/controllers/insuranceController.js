const ClientList = require("../models/clientListModel");
const Insurance = require("../models/insuranceModel");
var mongoose = require('mongoose');
const PoliciesList = require("../models/policiesListModel");
const fs = require('fs');

const addInsurance = async (req, res) => {
    try {
        const { clientId, vehicleRegNo, insurancePolicyId, registrationDate, expiryDate, vehicleChassisNo, vehicleModal, status } = req.body;
        
        const document = req.file ? req.file.path : null; // Make document optional
        const createInsurance = await Insurance.create({
            clientId, 
            vehicleRegNo, 
            insurancePolicyId, 
            registrationDate, 
            expiryDate, 
            vehicleChassisNo, 
            vehicleModal, 
            status, 
            document
        });
        
        return res.status(201).json({ message: "Insurance Added", data: createInsurance });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", errorMessage: error });
    }
};

const getInsurance = async (req, res) => {
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


        return res.status(200).json({ message: "All Insurances", data: newData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", errorMessage: error });
    }
};


const delInsurance = async (req, res) => {
    try {
        const id = req.params.id;
        const existInformation = await Insurance.findById(id);

        if (!existInformation) {
            return res.status(400).json({ mesage: "Insurance Not Exist" });
        }

        // Check if document exists and is a valid file path
        if (existInformation.document) {
            fs.unlink(existInformation.document, (err) => {
                if (err) return res.status(500).json({ message: "Failed to delete file from server", error: err.message });
            });
        }

        const deletedInformation = await Insurance.findByIdAndDelete(id);
        return res.status(200).json({ mesage: "Deleted Insurance", data: deletedInformation });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mesage: "Internal Server Error", errorMessage: error });
    }
};

const editInsurance = async (req, res) => {
    try {
        const id = req.params.id;
        const existInformation = await Insurance.findById(id);

        if (!existInformation) {
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) return res.status(500).json({ message: "Failed to delete file from server", error: err.message });
                });
            }
            return res.status(400).json({ message: "Insurance Not Exist" });
        }

        const { clientId, vehicleRegNo, insurancePolicyId, registrationDate, expiryDate, vehicleChassisNo, vehicleModal, status } = req.body;

        // Ensure the status is a string
        const insuranceStatus = status === 'true'; // Converts "true" or "false" string to boolean
        
        // If a new document is uploaded, handle it
        let document = req.file ? req.file.path : existInformation.document; // If no new file, keep the old one

        // If a file exists, delete the old document
        if (req.file) {
            fs.unlink(existInformation.document, (err) => {
                if (err) return res.status(500).json({ message: "Failed to delete file from server", error: err.message });
            });
        }

        const editInformation = await Insurance.findByIdAndUpdate(id, {
            refCode: existInformation.code,
            clientId, 
            vehicleRegNo, 
            insurancePolicyId, 
            registrationDate, 
            expiryDate, 
            vehicleChassisNo, 
            vehicleModal, 
            status: insuranceStatus, 
            document
        }, { new: true });

        return res.status(200).json({ message: "Updated Insurance", data: editInformation });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", errorMessage: error });
    }
};


module.exports = {
    addInsurance,
    getInsurance,
    delInsurance,
    editInsurance
}