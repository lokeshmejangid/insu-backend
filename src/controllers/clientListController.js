const ClientList = require("../models/clientListModel");
const PoliciesList = require("../models/policiesListModel")
const fs = require('fs');
const mongoose = require('mongoose');

const addClientList = async (req, res) => {
    try {
        const { name, phoneNumber, policy_id, status } = req.body;
        
        const createClientList = await ClientList.create({ name, phoneNumber, policy_id, status });
        return res.status(201).json({ message: "Client Added", data: createClientList });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", errorMessage: error });
    }
}

const getClientList = async (req, res) => {
    try {
        const data = await ClientList.find();
        let newData = [];

        if (data) {
            for (const value of data) {
                let newDoc = { ...value._doc };
                var policy_id = new mongoose.Types.ObjectId(value.policy_id);
                const policy = await PoliciesList.findById(policy_id);
                if (policy) {
                    newDoc.policy = { ...policy._doc };
                }
                newData.push(newDoc);
            }
        }
        return res.status(200).json({ message: "All Clients", data: newData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", errorMessage: error });
    }
}

const delClientList = async (req, res) => {
    try {
        const id = req.params.id;
        const existInformation = await ClientList.findById(id);
        if (!existInformation) return res.status(400).json({ message: "Client Not Exist" });
        const deletedInformation = await ClientList.findByIdAndDelete(id);
        return res.status(200).json({ message: "Deleted Client", data: deletedInformation });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", errorMessage: error });
    }
}

const editClientList = async (req, res) => {
    try {
        const id = req.params.id;
        const existInformation = await ClientList.findById(id);
        if (!existInformation) {
            return res.status(400).json({ message: "Client Not Exist" });
        }
        const { name, phoneNumber, policy_id, status } = req.body;
        const editInformation = await ClientList.findByIdAndUpdate(id, {name, phoneNumber, policy_id, status }, { new: true });
        return res.status(200).json({ message: "Updated Client", data: editInformation });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", errorMessage: error });
    }
}

module.exports = {
    addClientList,
    getClientList,
    delClientList,
    editClientList
}