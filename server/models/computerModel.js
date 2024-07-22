const mongoose = require('mongoose');

const computerSchema = new mongoose.Schema(
  {
    computerNumber: {
      type: Number,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
    fromTime: {
      type: Date,
    },
    toTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

const ComputerModel = mongoose.model("Computer", computerSchema);
module.exports = ComputerModel;
