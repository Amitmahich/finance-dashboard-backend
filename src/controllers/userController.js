const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password || !role) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }
    const existingUser = await userModel.findOne({ email, isDeleted: false });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role,
      status: "active",
    });
    res.status(201).send({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to create user",
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid user Id",
      });
    }
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true },
    );
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to delete user",
    });
  }
};
const getUsers = async (req, res) => {
  try {
    const { role, status } = req.query;
    let filter = {};

    // excluding logged-in user
    filter._id = { $ne: req.user.id };

    filter.isDeleted = false;

    //filtering by role
    if (role) {
      filter.role = role;
    }
    //filter by status
    if (status) {
      filter.status = status;
    }
    const users = await userModel.find(filter).select("-password").sort({
      createdAt: -1,
    });

    res.status(200).send({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};
const getUserById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }
    const user = await userModel
      .findOne({ _id: req.params.id, isDeleted: false })
      .select("-password");
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).send({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};
const updateUserStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }
    const { status } = req.body || {};
    if (!status) {
      return res.status(400).send({
        success: false,
        message: "Status is required",
      });
    }

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).send({
        success: false,
        message: "Invalid status. Allowed values: active, inactive",
      });
    }
    const user = await userModel
      .findOneAndUpdate(
        { _id: req.params.id, isDeleted: false },
        { status },
        { new: true },
      )
      .select("-password");

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "User status updated",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
};
const updateUserRole = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }
    const { role } = req.body || {};
    if (!role) {
      return res.status(400).send({
        success: false,
        message: "Role is required",
      });
    }
    if (!["admin", "analyst", "viewer"].includes(role)) {
      return res.status(400).send({
        success: false,
        message: "Invalid role. Allowed values: admin, analyst, viewer",
      });
    }
    const user = await userModel
      .findOneAndUpdate(
        { _id: req.params.id, isDeleted: false },
        { role },
        { new: true },
      )
      .select("-password");

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "User role updated",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to update role",
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  deleteUser,
};
