const PoliciesList = require("../models/policiesListModel");

const generateCatId = async () => {
    const policies = await PoliciesList.find().sort({ createdAt: -1 }).limit(1);
    const idNum = Number(policies[0].code.split('-')[1]);
    console.log(idNum);
    
    const today = new Date();
    const yy = today.getFullYear();
    const mm = today.getMonth() + 1;
    let formattedCounter = idNum.toString().padStart(5, '0');
    console.log(yy + "" + mm + "-" + formattedCounter);
    return yy + "" + mm + "-" + formattedCounter
}

generateCatId();

const addPoliciesList = async (req, res) => {
    try {
        const { name, cost, duration, category, desc, status } = req.body;
        const policiesCode = (generateCatId()).toString();
        const createPoliciesList = await PoliciesList.create({ code: policiesCode, name, cost, duration, category, desc, status });
        return res.status(201).json({ mesage: "New PoliciesList Information Added", policiesListInformation: createPoliciesList });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mesage: "Internal Server Error", errorMessage: error });
    }
}

const getPoliciesList = async (req, res) => {
    try {
        const policiesListInformation = await PoliciesList.find();
        return res.status(200).json({ mesage: "Get All PoliciesList Information", policiesListInformation: policiesListInformation });
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
        return res.status(200).json({ mesage: "Delete PoliciesList Information", policiesListInformation: deletedInformation });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mesage: "Internal Server Error", errorMessage: error });
    }
}

const editPoliciesList = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, cost, duration, category, desc, status } = req.body;
        const existInformation = await PoliciesList.findById(id);
        if (!existInformation) return res.status(400).json({ mesage: "PoliciesList Information Not Exist" });
        const editInformation = await PoliciesList.findByIdAndUpdate(id, { name, cost, duration, category, desc, status }, { new: true });
        return res.status(200).json({ mesage: "Update PoliciesList Information", policiesListInformation: editInformation });
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