const recordModel = require("../models/recordModel");
const mongoose = require("mongoose");

const createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, note } = req.body || {};
    if (!amount || !type || !category || !note) {
      return res.status(400).send({
        success: false,
        message: "Amount, type , category and note are required",
      });
    }
    const record = await recordModel.create({
      amount,
      type,
      category,
      date,
      note,
      createdBy: req.user.id,
    });
    res.status(201).send({
      success: true,
      message: "Record created successfully",
      data: record,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to create record",
      error: error.message,
    });
  }
};
const getRecords = async (req, res) => {
  try {
    const {
      type,
      category,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 10,
    } = req.query;
    let filter = { isDeleted: false };

    //filter by type
    if (type) {
      filter.type = new RegExp(`^${type}$`, "i");
    }
    //filter by category
    if (category) {
      filter.category = new RegExp(category, "i");
    }
    //filter by date
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    // search (note or category)
    if (search) {
      filter.$or = [
        { note: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }
    const skip = (page - 1) * limit;

    const total = await recordModel.countDocuments(filter);

    const records = await recordModel
      .find(filter)
      .populate("createdBy", "name email")
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).send({
      success: true,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
      count: records.length,
      data: records,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch records",
      error: error.message,
    });
  }
};
const getRecordById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid record id",
      });
    }
    const record = await recordModel
      .findOne({
        _id: req.params.id,
        isDeleted: false,
      })
      .populate("createdBy", "name email role");

    if (!record) {
      return res.status(404).send({
        success: false,
        message: "Record not found",
      });
    }
    res.status(200).send({
      success: true,
      data: record,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch records",
      error: error.message,
    });
  }
};
const updateRecord = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid record id",
      });
    }
    const { amount, type, category, date, note } = req.body || {};

    const record = await recordModel.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!record) {
      return res.status(404).send({
        success: false,
        message: "Record not found",
      });
    }

    if (amount !== undefined) {
      if (typeof amount !== "number" || amount < 0) {
        return res.status(400).send({
          success: false,
          message: "Amount must be a positive number",
        });
      }
      record.amount = amount;
    }
    if (type !== undefined) {
      if (typeof type !== "string") {
        return res.status(400).send({
          success: false,
          message: "Type must be string",
        });
      }
      const validTypes = ["income", "expense"];
      if (!validTypes.includes(type.toLowerCase())) {
        return res.status(400).send({
          success: false,
          message: "Type must be income or expense",
        });
      }
      record.type = type.toLowerCase();
    }
    if (category !== undefined) {
      if (typeof category !== "string") {
        return res.status(400).send({
          success: false,
          message: "Category must be string",
        });
      }
      record.category = category;
    }
    if (date !== undefined) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate)) {
        return res.status(400).send({
          success: false,
          message: "Invalid date format",
        });
      }
      record.date = parsedDate;
    }
    if (note !== undefined) {
      if (typeof note !== "string") {
        return res.status(400).json({
          success: false,
          message: "Note must be string",
        });
      }
      record.note = note;
    }
    await record.save();

    res.status(200).send({
      success: true,
      message: "Record updated successfully",
      data: record,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to update record",
      error: error.message,
    });
  }
};
const deleteRecord = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid record id",
      });
    }
    const record = await recordModel.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!record) {
      return res.status(404).send({
        success: false,
        message: "Record not found",
      });
    }
    record.isDeleted = true;
    await record.save();

    res.status(200).send({
      success: true,
      message: "Record soft deleted successsfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to delete record",
      error: error.message,
    });
  }
};
module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};
