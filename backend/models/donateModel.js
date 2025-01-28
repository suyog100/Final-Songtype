const mongoose = require("mongoose");

const donateSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

const Donate = mongoose.model("donate", donateSchema);
module.exports = Donate;
