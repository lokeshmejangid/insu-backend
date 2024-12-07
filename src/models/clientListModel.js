const mongoose = require("mongoose");

const clientListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 300,
    },
    phoneNumber: {
      type: String,
      required: true,
      maxlength: 10,
    },
    policy_id: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const ClientList = mongoose.model("CLIENTLIST", clientListSchema);

module.exports = ClientList;
