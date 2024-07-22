const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Computer = require("../models/computerModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();
    res
      .status(200)
      .send({ message: "User registered successfully", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error creating user", success: false, error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid email or password", success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(200).send({
        message: "User logged successfully",
        success: true,
        token,
        userId: user._id,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error logging in user", success: false, error });
  }
});

router.post("/get-user-info-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    if (!user) {
      console.log("not found user by id");
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    } else {
      user.password = null; // hiding the password before sending it to the client
      console.log("found user by id, sending data to client");
      res.status(200).send({
        success: true,
        data: { user },
      });
    }
  } catch (error) {
    console.log("caught error in get user info route");
    res
      .status(500)
      .send({ message: "Error fetching user info", success: false });
  }
});

router.post("/add-new-computer", authMiddleware, async (req, res) => {
  try {
    console.log('on add new computer route');
    console.log('Request body:', req.body);
    const { computerNumber } = req.body;
    console.log('Computer number:', computerNumber);
    
    const existingComputer = await Computer.findOne({
      computerNumber: computerNumber,
    });
    
    if (!existingComputer) {
      const newComputer = new Computer({ computerNumber });
      await newComputer.save();
      res.status(200).send({
        message: "New computer added successfully",
        success: true,
      });
    } else {
      res.status(200).send({
        message: "Computer number already exists",
        success: false,
      });
    }
  } catch (error) {
    console.log("caught error in add new computer route");
    console.error(error);  // Log the full error
    res
      .status(500)
      .send({ message: "Error adding new computer", success: false, error: error.message });
  }
});

// Get available computers
router.post("/get-available-computers", authMiddleware, async (req, res) => {
  try {
    const { dateRange, rentalType } = req.body;
    const [startDate, endDate] = dateRange;

    // Logic to find available computers based on the date range and rental type
    const availableComputers = await Computer.find({
      $or: [
        { fromTime: { $exists: false } },
        { toTime: { $exists: false } },
        { 
          $and: [
            { fromTime: { $gt: new Date(endDate) } },
            { toTime: { $lt: new Date(startDate) } }
          ]
        }
      ]
    });

    res.status(200).send({
      message: "Available computers fetched successfully",
      success: true,
      computers: availableComputers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error fetching available computers",
      success: false,
      error: error.message,
    });
  }
});

// Rent a computer
router.post("/rent-computer", authMiddleware, async (req, res) => {
  try {
    const { dateRange, rentalType, computerId } = req.body;
    const [startDate, endDate] = dateRange;

    const computer = await Computer.findById(computerId);
    if (!computer) {
      return res.status(404).send({
        message: "Computer not found",
        success: false,
      });
    }

    computer.fromTime = new Date(startDate);
    computer.toTime = new Date(endDate);
    await computer.save();

    res.status(200).send({
      message: "Computer rented successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error renting computer",
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
