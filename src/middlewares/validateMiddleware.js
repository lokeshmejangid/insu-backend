const fs = require("fs")
const validate = (schema, imageOptional = false) => async (req, res, next) => {
    try {
        // Log the incoming body before validation
        console.log('Request body before validation:', req.body);

        const dataToValidate = {
            ...req.body,
            image: req.file ? req.file.path : req.body.image,
            policiesDoc: req.file ? req.file.path : req.body.policiesDoc,
            document: req.file ? req.file.path : req.body.document
        };

        console.log('Data being validated:', dataToValidate);  // Log the merged data

        if (imageOptional && !dataToValidate.image) {
            delete dataToValidate.image;
        }

        if (imageOptional && !dataToValidate.policiesDoc) {
            delete dataToValidate.policiesDoc;
        }

        if (imageOptional && !dataToValidate.document) {
            delete dataToValidate.document;
        }

        const parsedData = await schema.parseAsync(dataToValidate);
        req.body = parsedData;
        next();
    } catch (err) {
        console.error('Validation error:', err);
        const errorDetails = err.errors || [];
        const extraDetails = errorDetails.map(e => e.message).join(", ");

        const error = {
            status: "400",
            message: "Please fill in the required data correctly",
            extraDetails: extraDetails || "Unknown error"
        };

        res.status(400).json(error);
    }
};


module.exports = validate;
