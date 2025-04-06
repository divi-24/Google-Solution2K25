import { PeriodTracking } from "../models/periodTrackingModel.js";
import { User } from "../models/userModel.js";

export const trackerDataController = async (req, res) => {
  const { userId, ...trackerData } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPeriodTracking = new PeriodTracking({
      user: user._id,
      ...trackerData,
    });

    await newPeriodTracking.save();
    console.log("Tracker data submitted:", newPeriodTracking);
    res
      .status(201)
      .json({ message: "Period tracking data saved successfully" });
  } catch (error) {
    console.error("Error saving period tracking data:", error);
    res.status(500).json({
      message: "Error saving period tracking data",
      error: error.message,
    });
  }
};

export const periodTrackingController = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const periodTrackingData = await PeriodTracking.findOne({
      user: userId,
    }).sort({ date: -1 });
    if (!periodTrackingData) {
      return res
        .status(404)
        .json({ message: "No period tracking data found for this user" });
    }

    res.status(200).json(periodTrackingData);
  } catch (error) {
    console.error("Error fetching period tracking data:", error);
    res.status(500).json({
      message: "Error fetching period tracking data",
      error: error.message,
    });
  }
};
