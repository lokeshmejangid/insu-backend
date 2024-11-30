const ClientList = require("../models/clientListModel");
const fs = require('fs');

const generateCatId = async () => {
    const policies = await ClientList.find().sort({ createdAt: -1 }).limit(1);

    const idNum = policies.length != 0 ? Number(policies[0].code.split('-')[1]) + 1 : 1;
    const today = new Date();
    const yy = today.getFullYear();
    const mm = today.getMonth() + 1;
    let formattedCounter = idNum.toString().padStart(5, '0');
    return yy + "" + mm + "-" + formattedCounter
}

const addClientList = async (req, res) => {
    try {
        const { name, status } = req.body;
        const polociesCode = await generateCatId();

        if (req.file) {
            const image = req.file.path;
            const createClientList = await ClientList.create({ image, code: polociesCode, name, status });
            return res.status(201).json({ mesage: "New ClientList Information Added", data: createClientList });
        } else {
            // const image = req.file.path;
            const createClientList = await ClientList.create({ code: polociesCode, name, status });
            return res.status(201).json({ mesage: "New ClientList Information Added", data: createClientList });
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

const getClientList = async (req, res) => {
    try {
        const data = await ClientList.find();
        return res.status(200).json({ mesage: "Get All ClientList Information", data: data });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mesage: "Internal Server Error", errorMessage: error });
    }
}

const delClientList = async (req, res) => {
    try {
        const id = req.params.id;
        const existInformation = await ClientList.findById(id);
        if (!existInformation) return res.status(400).json({ mesage: "ClientList Information Not Exist" });
        if (existInformation.image) {
            fs.unlink(existInformation.image, (err) => {
                if (err) return res.status(500).json({ message: "Failed to delete file from server", error: err.message });
            })
        }
        const deletedInformation = await ClientList.findByIdAndDelete(id);
        return res.status(200).json({ mesage: "Delete ClientList Information", data: deletedInformation });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mesage: "Internal Server Error", errorMessage: error });
    }
}

const editClientList = async (req, res) => {
    try {
        const id = req.params.id;
        const existInformation = await ClientList.findById(id);
        if (!existInformation) {
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) return res.status(500).json({ message: "Failed to delete file from server", error: err.message });
                })
            }
            return res.status(400).json({ mesage: "ClientList Information Not Exist" });
        }
        const { name, status } = req.body;
        const image = req.file ? req.file.path : req.body.image;
        if (req.file) {
            fs.unlink(existInformation.image, (err) => {
                if (err) return res.status(500).json({ message: "Failed to delete file from server", error: err.message });
            })
        }
        else if (!image) { } else if (image !== existInformation.image) return res.status(400).json({ message: "Please Select An image From Your Device" })
        const editInformation = await ClientList.findByIdAndUpdate(id, { image, code: existInformation.code, name, status }, { new: true });
        return res.status(200).json({ mesage: "Update ClientList Information", data: editInformation });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mesage: "Internal Server Error", errorMessage: error });
    }
}

module.exports = {
    addClientList,
    getClientList,
    delClientList,
    editClientList
}