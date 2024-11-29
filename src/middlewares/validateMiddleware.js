const fs = require("fs")
const validate = (schema, imageOptional = false) => async (req, res, next) => {
    try {
        const dataToValidate = {
            ...req.body,
            image: req.file ? req.file.path : req.body.image
        };

        if (imageOptional && !dataToValidate.image) {
            delete dataToValidate.image;
        }
        const parsedData = await schema.parseAsync(dataToValidate);
        req.body = parsedData;
        next();
    } catch (err) {
        console.error(err);
        if (req.file) {
            fs.unlink(req.file.path, async (er) => {
                if (er) return res.status(500).json({ message: 'Failed to delete old file from server', error: er.message });
            });
        }
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
