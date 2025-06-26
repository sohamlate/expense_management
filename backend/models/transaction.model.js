const mongoose = require("mongoose");
const axios = require("axios");

const transactionSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0.01 },
    description: { type: String, maxlength: 200 },
    date: { type: Date, default: Date.now, index: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String, required: true, index: true },

    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", index: true },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    splitType: { type: String, enum: ["personal", "group"] },
    splits: [{ type: mongoose.Schema.Types.ObjectId, ref: "Split" }],
    currency: {
      type: String,
    },
    isSettled: { type: Boolean, default: false },
  },
  { timestamps: true }
);



module.exports = mongoose.model("Transaction", transactionSchema);
