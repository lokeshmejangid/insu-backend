const ClientList = require("../models/clientListModel");
const Insurance = require("../models/insuranceModel");
var mongoose = require('mongoose');
const PoliciesList = require("../models/policiesListModel");


const generateRefCode = async () => {
    const insurance = await Insurance.find().sort({ createdAt: -1 }).limit(1);

    const idNum = insurance.length != 0 ? Number(insurance[0].refCode.split('-')[1]) + 1 : 1;
    const today = new Date();
    const yy = today.getFullYear();
    const mm = today.getMonth() + 1;
    let formattedCounter = idNum.toString().padStart(5, '0');
    return yy + "" + mm + "-" + formattedCounter
}

const addInsurance = async (req, res) => {
    try {
        const { clientId, vehicleRegNo, insurancePolicyId, registrationDate, expiryDate, vehicleChassisNo, vehicleModal, status } = req.body;
        const polociesCode = await generateRefCode();

        const createInsurance = await Insurance.create({ refCode: polociesCode, clientId, vehicleRegNo, insurancePolicyId, registrationDate, expiryDate, vehicleChassisNo, vehicleModal, status });
        return res.status(201).json({ mesage: "New Insurance Information Added", data: createInsurance });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mesage: "Internal Server Error", errorMessage: error });
    }
}

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


        return res.status(200).json({ message: "Get All Insurance Information", data: newData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", errorMessage: error });
    }
};


const delInsurance = async (req, res) => {
    try {
        const id = req.params.id;
        const existInformation = await Insurance.findById(id);
        if (!existInformation) return res.status(400).json({ mesage: "Insurance Information Not Exist" });
        const deletedInformation = await Insurance.findByIdAndDelete(id);
        return res.status(200).json({ mesage: "Delete Insurance Information", data: deletedInformation });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mesage: "Internal Server Error", errorMessage: error });
    }
}

const editInsurance = async (req, res) => {
    try {
        const id = req.params.id;
        const existInformation = await Insurance.findById(id);
        if (!existInformation) return res.status(400).json({ mesage: "Insurance Information Not Exist" });
        const { clientId, vehicleRegNo, insurancePolicyId, registrationDate, expiryDate, vehicleChassisNo, vehicleModal, status } = req.body;
        const editInformation = await Insurance.findByIdAndUpdate(id, { refCode: existInformation.code, clientId, vehicleRegNo, insurancePolicyId, registrationDate, expiryDate, vehicleChassisNo, vehicleModal, status }, { new: true });
        return res.status(200).json({ mesage: "Update Insurance Information", data: editInformation });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mesage: "Internal Server Error", errorMessage: error });
    }
}

module.exports = {
    addInsurance,
    getInsurance,
    delInsurance,
    editInsurance
}