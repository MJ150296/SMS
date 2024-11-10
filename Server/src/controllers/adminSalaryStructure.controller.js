import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import AdminSalaryStructure from "../models/Fee Model/adminSalaryStructureSchema.model.js";

const adminSalaryStructure = asyncHandler(async (req, res) => {
  const createdByUser = req.user._id;

  console.log("createdByUser", createdByUser);

  const {
    academicYear,
    baseSalary,
    allowances,
    deductions,
    bonus,
    revisionCycle,
  } = req.body;

  console.log("BODY DATA", req.body);

  try {
    // Validate required fields
    if (!createdByUser || !academicYear || !baseSalary) {
      return res.status(400).json({
        success: false,
        message: "CreatedBy, academicYear, and baseSalary are required fields.",
      });
    }

    const structureData = {
      createdByUser,
      academicYear,
      baseSalary,
      allowances,
      deductions,
      bonus,
      revisionCycle,
    };

    console.log("structureData", structureData);

    let salaryStructure = await AdminSalaryStructure.findOne({});

    if (salaryStructure) {
      salaryStructure = await AdminSalaryStructure.findByIdAndUpdate(
        salaryStructure._id,
        structureData,
        { new: true, runValidators: true }
      );
      console.log("updated salaryStructure", salaryStructure);

      return res.status(200).json({
        message: "Salary structure updated successfully",
        data: salaryStructure,
      });
    } else {
      const newSalaryStructure = new AdminSalaryStructure({
        createdBy: createdByUser,
        academicYear,
        baseSalary,
        allowances: {
          houseAllowance: allowances?.houseAllowance || 0,
          transportationAllowance: allowances?.transportationAllowance || 0,
          medicalAllowance: allowances?.medicalAllowance || 0,
          specialAllowance: allowances?.specialAllowance || 0,
          otherAllowances: {
            description: allowances?.otherAllowances?.description || "",
            amount: allowances?.otherAllowances?.amount || 0,
          },
        },
        deductions: {
          taxDeduction: deductions?.taxDeduction || 0,
          providentFund: deductions?.providentFund || 0,
          professionalTax: deductions?.professionalTax || 0,
          otherDeductions: {
            description: deductions?.otherDeductions?.description || "",
            amount: deductions?.otherDeductions?.amount || 0,
          },
        },
        bonus: {
          performanceBonus: bonus?.performanceBonus || 0,
          festivalBonus: bonus?.festivalBonus || 0,
          otherBonuses: {
            description: bonus?.otherBonuses?.description || "",
            amount: bonus?.otherBonuses?.amount || 0,
          },
        },
        revisionCycle: revisionCycle || "Annual",
      });

      // Save the new salary structure
      const savedSalaryStructure = await newSalaryStructure.save();

      console.log("savedSalaryStructure", savedSalaryStructure);

      // Send a successful response
      return res.status(201).json({
        success: true,
        message: "Salary structure created successfully.",
        data: savedSalaryStructure,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create admin salary structure.",
      error: error.message,
    });
  }
});

export { adminSalaryStructure };
