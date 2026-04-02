const recordModel = require("../models/recordModel");

const getDashboardSummary = async (req, res) => {
  try {
    const records = await recordModel.find({ isDeleted: false });

    let totalIncome = 0;
    let totalExpense = 0;
    let categoryTotals = {};
    const monthlyData = {};

    const recentActivity = await recordModel
      .find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("amount type category date note");

    records.forEach((record) => {
      // calculate income and expense
      if (record.type === "income") {
        totalIncome += record.amount;
      } else {
        totalExpense += record.amount;
      }
      // category wise totals
      if (!categoryTotals[record.category]) {
        categoryTotals[record.category] = 0;
      }
      categoryTotals[record.category] += record.amount;

      // monthly trend grouping
      const month = record.date.toISOString().slice(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }
      if (record.type === "income") {
        monthlyData[month].income += record.amount;
      } else {
        monthlyData[month].expense += record.amount;
      }
    });
    const monthlyTrend = Object.keys(monthlyData).map((month) => ({
      month,
      ...monthlyData[month],
    }));
    const netBalance = totalIncome - totalExpense;

    res.status(200).send({
      success: true,
      data: {
        summary: { totalIncome, totalExpense, netBalance },
        categoryTotals,
        recentActivity,
        monthlyTrend,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};
module.exports = { getDashboardSummary };
