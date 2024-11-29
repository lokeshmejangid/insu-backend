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
        const { name, cost, duration, category, desc, status } = req.body;
        const polociesCode = await generateCatId();
        
        if (req.file) {
            const policiesDoc = req.file.path;
            const createPoliciesList = await PoliciesList.create({ policiesDoc, code: polociesCode, name, cost, duration, category, desc, status });
            return res.status(201).json({ mesage: "New PoliciesList Information Added", policiesListInformation: createPoliciesList });
        } else {
            return res.status(400).json({ message: 'Please Select An policiesDoc From Your Device' })
        }
    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) return res.status(500).json({ message: "Failed to delete file from server", error: err.message });
            })
        }
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
        fs.unlink(existInformation.policiesDoc, (err) => {
            if (err) return res.status(500).json({ message: "Failed to delete file from server", error: err.message });
        })
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
        const existInformation = await PoliciesList.findById(id);
        if (!existInformation) {
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) return res.status(500).json({ message: "Failed to delete file from server", error: err.message });
                })
            }
            return res.status(400).json({ mesage: "PoliciesList Information Not Exist" });
        }
        const { name, cost, duration, category, desc, status } = req.body;
        const policiesDoc = req.file ? req.file.path : req.body.policiesDoc;
        if (req.file) {
            fs.unlink(existInformation.policiesDoc, (err) => {
                if (err) return res.status(500).json({ message: "Failed to delete file from server", error: err.message });
            })
        } else if (policiesDoc !== existInformation.policiesDoc) return res.status(400).json({ message: "Please Select An policiesDoc From Your Device" })
        const editInformation = await PoliciesList.findByIdAndUpdate(id, { policiesDoc, code: existInformation.code, name, cost, duration, category, desc, status }, { new: true });
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