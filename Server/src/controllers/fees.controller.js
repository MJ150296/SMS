import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import mongoose from "mongoose";
import FeeStructure from "../models/Fee Model/feeStructure.model.js";

// Controller for FeeStructure

// Create a new fee structure
const createFeeStructure = asyncHandler(async (req, res) => {
  try {
    const feeData = req.body;
    const user = req.user; // assuming the user information is passed with req.user
    const {
      academicYear,
      baseTuitionFee,
      libraryFee,
      examFees,
      uniformFee,
      digitalResourcesFee,
      sportsFacilityFee,
      medicalServiceFee,
      counselingFee,
    } = feeData;

    // Align feeData to the FeeStructure model
    const feeStructureData = {
      createdBy: user._id,
      academicYear,
      baseTuitionFee,
      libraryFee,
      examFees,
      uniformFee,
      digitalResourcesFee,
      sportsFacilityFee,
      medicalServiceFee,
      counselingFee,
      transportationFee: {
        distanceZone: feeData.distanceZone,
        oneWayFee: feeData.oneWayFee,
        roundTripFee: feeData.roundTripFee,
      },
      hostelFee: {
        roomType: feeData.roomType,
        boardingOption: feeData.boardingOption,
        mealPlan: feeData.mealPlan,
        feeAmount: feeData.hostelFeeAmount,
      },
      concessions: {
        siblingDiscount: feeData.siblingDiscount,
        incomeBasedDiscount: feeData.incomeBasedDiscount,
        meritScholarship: feeData.meritScholarship,
      },
    };

    // Check if a fee structure exists for the given class and academic year
    let feeStructure = await FeeStructure.findOne({
      ClassId: feeStructureData.ClassId,
      academicYear: feeStructureData.academicYear,
    });

    if (feeStructure) {
      // Update the existing fee structure
      feeStructure = await FeeStructure.findByIdAndUpdate(
        feeStructure._id,
        feeStructureData,
        { new: true, runValidators: true }
      );

      console.log("updated feeStructure", feeStructure);

      res.status(200).json({
        message: "Fee structure updated successfully",
        data: feeStructure,
      });
    } else {
      // Create a new fee structure
      feeStructure = new FeeStructure(feeStructureData);
      await feeStructure.save();

      console.log("created feeStructure", feeStructure);

      res.status(201).json({
        message: "Fee structure created successfully",
        data: feeStructure,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Error processing fee structure",
      error: error.message,
    });
    console.log(error);
  }
});

// Get all fee structures
const getAllFeeStructures = asyncHandler(async (req, res) => {
  try {
    const feeStructures = await FeeStructure.find()
      .populate("createdBy", "name email")
      .populate("ClassId", "name");

    res.status(200).json({
      message: "Fee structures retrieved successfully",
      data: feeStructures,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching fee structures", error });
  }
});

// Get a fee structure by ID
const getFeeStructureById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid fee structure ID" });
    }

    const feeStructure = await FeeStructure.findById(id)
      .populate("createdBy", "name email")
      .populate("ClassId", "name");

    if (!feeStructure) {
      return res.status(404).json({ message: "Fee structure not found" });
    }

    res.status(200).json({
      message: "Fee structure retrieved successfully",
      data: feeStructure,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching fee structure", error });
  }
});

// Update a fee structure by ID
const updateFeeStructure = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid fee structure ID" });
    }

    const feeStructure = await FeeStructure.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!feeStructure) {
      return res.status(404).json({ message: "Fee structure not found" });
    }

    res.status(200).json({
      message: "Fee structure updated successfully",
      data: feeStructure,
    });
  } catch (error) {
    res.status(400).json({ message: "Error updating fee structure", error });
  }
});

// Delete a fee structure by ID
const deleteFeeStructure = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid fee structure ID" });
    }

    const feeStructure = await FeeStructure.findByIdAndDelete(id);

    if (!feeStructure) {
      return res.status(404).json({ message: "Fee structure not found" });
    }

    res.status(200).json({
      message: "Fee structure deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting fee structure", error });
  }
});

export {
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  getAllFeeStructures,
  getFeeStructureById,
};
