const PoliciesList = require("../models/policiesListModel");
const fs = require('fs');

const generateCatId = async () => {
    // Get the latest policy entry sorted by creation date
    const policies = await PoliciesList.find().sort({ createdAt: -1 }).limit(1);

    // Default to '00001' if no previous policies exist
    let idNum = 1;

    if (policies.length !== 0) {
        // Extract the counter part from the last policy code
        const lastPolicyCode = policies[0].code;
        const parts = lastPolicyCode.split('-');

        if (parts.length === 2) {
            // Ensure the second part is a valid number
            const lastCounter = parseInt(parts[1], 10);
            if (!isNaN(lastCounter)) {
                idNum = lastCounter + 1;
            }
        }
    }

    // Get the current year and month
    const today = new Date();
    const yy = today.getFullYear();
    const mm = (today.getMonth() + 1).toString().padStart(2, '0'); // Ensure month is 2 digits

    // Format the policy code with 5-digit counter
    const formattedCounter = idNum.toString().padStart(5, '0');

    // Return the final policy code
    return `${yy}${mm}-${formattedCounter}`;
};



const addPoliciesList = async (req, res) => {
    try {
        const { name, cost, duration, category_id, description, status } = req.body;
        console.log(req.body);
        const polociesCode = await generateCatId();

        const createPoliciesList = await PoliciesList.create({ code: polociesCode, name, cost, duration, category_id, description, status });
        return res.status(201).json({ mesage: "New PoliciesList Information Added", data: createPoliciesList });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mesage: "Internal Server Error", errorMessage: error });
    }
}
// const addPoliciesList = async (req, res) => {
//     try {
//         console.log('Received body:', req.body);  // Log to check if body is being parsed correctly
//         const { name, cost, duration, category_id, description, status } = req.body;
//         console.log('Validated data:', { name, cost, duration, category_id, description, status });

//         // The rest of the logic...
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ mesage: "Internal Server Error", errorMessage: error });
//     }
// };

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
        if (!existInformation) return res.status(400).json({ mesage: "PoliciesList Information Not Exist" });
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