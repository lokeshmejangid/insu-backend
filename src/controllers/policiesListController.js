const PoliciesList = require("../models/policiesListModel");
const fs = require('fs');

const generateCatId = async () => {
    const policies = await PoliciesList.find().sort({ createdAt: -1 }).limit(1);

    const idNum = policies.length != 0 ? Number(policies[0].code.split('-')[1]) + 1 : 1;
    const today = new Date();
    const yy = today.getFullYear();
    const mm = today.getMonth() + 1;
    let formattedCounter = idNum.toString().padStart(5, '0');
    return yy + "" + mm + "-" + formattedCounter
}

const addPoliciesList = async (req, res) => {
    try {
        const { name, cost, duration, category, description, status } = req.body;
        const polociesCode = await generateCatId();

        const createPoliciesList = await PoliciesList.create({ code: polociesCode, name, cost, duration, category, description, status });
        return res.status(201).json({ mesage: "New PoliciesList Information Added", data: createPoliciesList });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mesage: "Internal Server Error", errorMessage: error });
    }
}

const getPoliciesList = async (req, res) => {
    try {
        const data = await PoliciesList.find();
        return res.status(200).json({ mesage: "Get All PoliciesList Information", data: data });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mesage: "Internal Server Error", errorMessage: error });
    }
}

const delPoliciesList = async (req, res) => {
    try {
        const id = req.params.id;
        const existInformation = await PoliciesList.findById(id);
        if (!existInformation) return res.status(400).json({ mesage: "PoliciesList Information Not Exist" });
        const deletedInformation = await PoliciesList.findByIdAndDelete(id);
        return res.status(200).json({ mesage: "Delete PoliciesList Information", data: deletedInformation });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mesage: "Internal Server Error", errorMessage: error });
    }
}

const editPoliciesList = async (req, res) => {
    try {
        const id = req.params.id;
        const existInformation = await PoliciesList.findById(id);
        const { name, cost, duration, category, description, status } = req.body;
        const editInformation = await PoliciesList.findByIdAndUpdate(id, { code: existInformation.code, name, cost, duration, category, description, status }, { new: true });
        return res.status(200).json({ mesage: "Update PoliciesList Information", data: editInformation });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mesage: "Internal Server Error", errorMessage: error });
    }
}

module.exports = {
    addPoliciesList,
    getPoliciesList,
    delPoliciesList,
    editPoliciesList
}