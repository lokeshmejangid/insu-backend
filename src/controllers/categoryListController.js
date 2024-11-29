const CategoryList = require("../models/categoryListModel");

const generateCatId = async () => {
    const policies = await CategoryList.find().sort({ createdAt: -1 }).limit(1);
    const idNum = Number(policies[0].code.split('-')[1]);
    console.log(idNum);
    
    const today = new Date();
    const yy = today.getFullYear();
    const mm = today.getMonth() + 1;
    let formattedCounter = idNum.toString().padStart(5, '0');
    console.log(yy + "" + mm + "-" + formattedCounter);
    return yy + "" + mm + "-" + formattedCounter
}


const addCategoryList = async (req, res) => {
    try {
        const { name, desc, status } = req.body;
        const createCategoryList = await CategoryList.create({ name, desc, status });
        return res.status(201).json({ mesage: "New CategoryList Information Added", categoryListInformation: createCategoryList });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mesage: "Internal Server Error", errorMessage: error });
    }
}

const getCategoryList = async (req, res) => {
    try {
        const categoryListInformation = await CategoryList.find();
        return res.status(200).json({ mesage: "Get All CategoryList Information", categoryListInformation: categoryListInformation });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mesage: "Internal Server Error", errorMessage: error });
    }
}

const delCategoryList = async (req, res) => {
    try {
        const id = req.params.id;
        const existInformation = await CategoryList.findById(id);
        if (!existInformation) return res.status(400).json({ mesage: "CategoryList Information Not Exist" });
        const deletedInformation = await CategoryList.findByIdAndDelete(id);
        return res.status(200).json({ mesage: "Delete CategoryList Information", categoryListInformation: deletedInformation });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mesage: "Internal Server Error", errorMessage: error });
    }
}

const editCategoryList = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, desc, status } = req.body;
        const existInformation = await CategoryList.findById(id);
        if (!existInformation) return res.status(400).json({ mesage: "CategoryList Information Not Exist" });
        const editInformation = await CategoryList.findByIdAndUpdate(id, { name, desc, status }, { new: true });
        return res.status(200).json({ mesage: "Update CategoryList Information", categoryListInformation: editInformation });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mesage: "Internal Server Error", errorMessage: error });
    }
}

module.exports = {
    addCategoryList,
    getCategoryList,
    delCategoryList,
    editCategoryList
}