const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

const seedAdmin = async () => {
  try {
    const adminExists = await userModel.findOne({ role: "admin" });

    if (adminExists) {
      console.log("Admin already exists");
      return;
    }
    const hashedPassword = await bcrypt.hash("Amit@123", 10);

    await userModel.create({
      name: "Admin",
      email: "admin@test.com",
      password: hashedPassword,
      role: "admin",
      status: "active",
    });
    console.log("Default admin created");
  } catch (error) {
    console.error("Error seeding admin", error.message);
  }
};
module.exports = seedAdmin;
