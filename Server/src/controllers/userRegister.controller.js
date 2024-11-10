import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { User } from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import Teacher from "../models/teacher.model.js";
import Student from "../models/student.model.js";
import { Class } from "../models/class.model.js";
import FeeStructure from "../models/Fee Model/feeStructure.model.js";
import StudentFee from "../models/Fee Model/student fees document/studentFee.model.js";
import SalaryStructure from "../models/Fee Model/teacherSalaryStructure.model.js";
import TeacherSalary from "../models/Fee Model/teacher salary models/teacherSalary.model.js";
import AdminSalaryStructure from "../models/Fee Model/adminSalaryStructureSchema.model.js";
import AdminSalary from "../models/Fee Model/admin salary models/adminSalary.model.js";

const registerAdmin = asyncHandler(async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      department,
      academicYear,
      dob,
      employmentType,
      accessLevel,
      allowances,
      bonuses,
      deductions,
      address,
      mobileNumber,
    } = req.body;

    console.log(req.body);

    // 1. Validate input data
    if (
      !fullName ||
      !email ||
      !password ||
      !department ||
      !employmentType ||
      !accessLevel ||
      !academicYear ||
      !dob ||
      !mobileNumber
    ) {
      throw new ApiError(400, "All fields are required.");
    }

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already existed");
      throw new ApiError(402, "Admin already existed");
    }

    // 2. Create a new User record
    const user = await User.create({
      fullName,
      email,
      password, // Make sure to hash the password in the User model
      role: "admin",
    });

    // 3. Generate a unique AdminId (e.g., random or UUID-based)
    const adminId = `A-${Date.now()}`; // Simple example for generating unique teacherId

    console.log("adminID", adminId);

    // 3. Create a new Admin record
    const admin = await Admin.create({
      userId: user._id, // Link the admin to the created user
      department,
      dateOfBirth: dob,
      academicYear,
      address,
      mobileNumber,
      employmentType,
      accessLevel,
    });

    if (!admin) {
      return new ApiError(400, "Admin not created");
    }

    const salaryStructure = await AdminSalaryStructure.find({});
    // console.log("Admin", admin);

    if (!salaryStructure) {
      return new ApiError(400, "No salary structure found for admins");
    }

    const currentSalaryStructure = salaryStructure.find(
      (data) => data.academicYear === "2024-25"
    );

    console.log("currentSalaryStructure", currentSalaryStructure);

    if (!currentSalaryStructure) {
      return new ApiError(
        400,
        "No salary structure found for teachers FOR THIS YEAR"
      );
    }

    const baseSalaryAmount = currentSalaryStructure.baseSalary;
    // This is here because we want to calculate concession in fee object

    console.log("baseSalaryAmount", baseSalaryAmount);

    let total_payable_salary = 0;

    const calculateAllowances = (currentSalaryAllowances) => {
      let totalAllowances = {};

      if (allowances.houseAllowance) {
        totalAllowances.houseAllowance = currentSalaryAllowances.houseAllowance;

        total_payable_salary =
          total_payable_salary + currentSalaryAllowances.houseAllowance;
      }

      if (allowances.transportationAllowance) {
        totalAllowances.transportationAllowance =
          currentSalaryAllowances.transportationAllowance;

        total_payable_salary =
          total_payable_salary +
          currentSalaryAllowances.transportationAllowance;
      }

      if (allowances.medicalAllowance) {
        totalAllowances.medicalAllowance =
          currentSalaryAllowances.medicalAllowance;

        total_payable_salary =
          total_payable_salary + currentSalaryAllowances.medicalAllowance;
      }

      if (allowances.specialAllowance) {
        totalAllowances.specialAllowance =
          currentSalaryAllowances.specialAllowance;
        total_payable_salary =
          total_payable_salary + currentSalaryAllowances.specialAllowance;
      }

      if (allowances.otherAllowances) {
        totalAllowances.otherAllowances = {
          description: allowances.otherAllowances.description,
          amount: allowances?.otherAllowances?.amount,
        };
        total_payable_salary =
          total_payable_salary + allowances?.otherAllowances?.amount;
      }

      console.log("total_payable_salary1", total_payable_salary);

      console.log("totalAllowances:", totalAllowances);

      return totalAllowances;
    };

    const calculateDeductions = (currentSalaryDeductions) => {
      let totalDeductions = {};
      if (deductions.taxDeduction) {
        totalDeductions.taxDeduction = currentSalaryDeductions.taxDeduction;
        total_payable_salary =
          total_payable_salary -
          (baseSalaryAmount * currentSalaryDeductions.taxDeduction) / 100;
      }
      console.log(baseSalaryAmount);

      console.log("total_payable_salary after tax", total_payable_salary);

      if (deductions.providentFund) {
        totalDeductions.providentFund = currentSalaryDeductions.providentFund;
        total_payable_salary =
          total_payable_salary -
          (baseSalaryAmount * currentSalaryDeductions.providentFund) / 100;
      }

      if (deductions.professionalTax) {
        totalDeductions.professionalTax =
          currentSalaryDeductions.professionalTax;
        total_payable_salary =
          total_payable_salary -
          (baseSalaryAmount * currentSalaryDeductions.professionalTax) / 100;
      }

      if (deductions?.otherDeductions) {
        totalDeductions.otherDeductions = {
          description: deductions.otherDeductions.description,
          amount: deductions?.otherDeductions?.amount,
        };
        total_payable_salary =
          total_payable_salary - deductions?.otherDeductions?.amount;
      }

      console.log("totalDeductions:", totalDeductions);
      console.log("total_payable_salary2", total_payable_salary);

      return totalDeductions;
    };

    const calculateBonuses = (currentSalaryBonuses) => {
      let total_bonus = {};

      if (bonuses.performanceBonus) {
        total_bonus.performanceBonus = currentSalaryBonuses.performanceBonus;
        total_payable_salary =
          total_payable_salary + currentSalaryBonuses.performanceBonus;
        console.log("total_payable_salary3 1", total_payable_salary);
      }

      if (bonuses?.festivalBonus) {
        total_bonus.festivalBonus = currentSalaryBonuses.festivalBonus;
        total_payable_salary =
          total_payable_salary + currentSalaryBonuses.festivalBonus;
        console.log("total_payable_salary3  2", total_payable_salary);
      }

      if (bonuses.otherBonuses) {
        total_bonus.otherBonuses = {
          description: bonuses.otherBonuses.description,
          amount: bonuses?.otherBonuses?.amount,
        };
        total_payable_salary =
          total_payable_salary + bonuses?.otherBonuses?.amount;
        console.log("total_payable_salary3  3", total_payable_salary);
      }

      console.log("total_bonus", total_bonus);
      console.log("total_payable_salary3", total_payable_salary);

      return total_bonus;
    };

    let salaryData = {
      adminId: admin._id,
      academicYear: currentSalaryStructure.academicYear,
      baseSalary: currentSalaryStructure.baseSalary,
      allowances: calculateAllowances(currentSalaryStructure.allowances),
      deductions: calculateDeductions(currentSalaryStructure.deductions),
      bonuses: calculateBonuses(currentSalaryStructure.bonus),
    };

    total_payable_salary = total_payable_salary + baseSalaryAmount;

    console.log("total_ payable_salary", total_payable_salary);

    salaryData.totalPayable = total_payable_salary;

    // console.log("salaryData", salaryData);

    if (!salaryData) {
      return new ApiError(400, "Unable to calculate salary data");
    }

    const adminSalaryData = await AdminSalary.create({
      ...salaryData,
      adminId: admin._id,
    });

    console.log("adminSalaryData", adminSalaryData);

    // 4. Return success response
    return res.status(201).json(
      new ApiResponse(201, {
        message: "Admin registered successfully.",
        admin: {
          id: admin._id,
          fullName: user.fullName,
          email: user.email,
          department: admin.department,
          employmentDate: admin.employmentDate,
          // Include additional fields as necessary
        },
      })
    );
  } catch (error) {
    // Handle any errors that occurred during the registration process
    console.error("Error registering admin:", error);
    return res.status(500).json(
      new ApiResponse(500, {
        message: "Internal server error.",
        error: error.message,
      })
    );
  }
});

const registerTeacher = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    password,
    subjectSpecialization,
    dob,
    academicYear,
    allowances,
    baseSalary, // Type of salary (Basic/ Premium)
    bonuses,
    deductions,
    address,
    mobileNumber,
  } = req.body;

  try {
    // 1. Validate input data
    if (
      !fullName ||
      !email ||
      !password ||
      !subjectSpecialization ||
      !dob ||
      !academicYear ||
      !baseSalary
    ) {
      throw new ApiError(
        400,
        "Full name, email, password, and subject specialization are required."
      );
    }

    //Check for existing teacher in user model
    const existingTeacher = await User.findOne({ email });

    if (existingTeacher) {
      // console.log("teacher existed /n");

      return new ApiError(402, "Teacher already existed");
    }

    // 2. Create a new User record
    const user = await User.create({
      fullName,
      email,
      password, // Make sure to hash the password in the User model
      role: "teacher",
    });

    // 3. Generate a unique teacherId (e.g., random or UUID-based)
    const teacherId = `T-${Date.now()}`; // Simple example for generating unique teacherId

    // console.log(teacherId);

    // console.log(
    //   "Teacher created",
    //   user._id,
    //   teacherId,
    //   subjectSpecialization,
    //   dob,
    //   academicYear,
    //   allowances,
    //   baseSalary,
    //   bonuses,
    //   deductions,
    //   address,
    //   mobileNumber
    // );

    // 4. Create a new Teacher record
    const teacher = await Teacher.create({
      userId: user._id, // Link the teacher to the created user
      teacherId,
      subjectSpecialization,
      dateOfBirth: dob,
      academicYear,
      address,
      mobileNumber,
    });

    // console.log("Teacher Data", teacher);

    if (!teacher) {
      return new ApiError(400, "Teacher not created");
    }

    const salaryStructure = await SalaryStructure.find({});

    if (!salaryStructure) {
      return new ApiError(400, "No salary structure found for teachers");
    }

    const currentSalaryStructure = salaryStructure.find(
      (data) => data.academicYear === "2024-25"
    );

    // console.log("currentSalaryStructure", currentSalaryStructure);

    if (!currentSalaryStructure) {
      return new ApiError(
        400,
        "No salary structure found for teachers FOR THIS YEAR"
      );
    }

    const baseSalaryAmount = currentSalaryStructure.baseSalary;
    // This is here because we want to calculate concession in fee object

    let total_payable_salary = 0;

    const calculateAllowances = (currentSalaryAllowances) => {
      let totalAllowances = {};

      if (allowances.houseAllowance) {
        totalAllowances.houseAllowance = currentSalaryAllowances.houseAllowance;

        total_payable_salary =
          total_payable_salary + currentSalaryAllowances.houseAllowance;
      }

      if (allowances.transportationAllowance) {
        totalAllowances.transportationAllowance =
          currentSalaryAllowances.transportationAllowance;

        total_payable_salary =
          total_payable_salary +
          currentSalaryAllowances.transportationAllowance;
      }

      if (allowances.medicalAllowance) {
        totalAllowances.medicalAllowance =
          currentSalaryAllowances.medicalAllowance;

        total_payable_salary =
          total_payable_salary + currentSalaryAllowances.medicalAllowance;
      }

      if (allowances.specialAllowance) {
        totalAllowances.specialAllowance =
          currentSalaryAllowances.specialAllowance;
        total_payable_salary =
          total_payable_salary + currentSalaryAllowances.specialAllowance;
      }

      if (allowances.otherAllowances) {
        totalAllowances.otherAllowances = {
          description: allowances.otherAllowances.description,
          amount: allowances?.otherAllowances?.amount,
        };
        total_payable_salary =
          total_payable_salary + allowances?.otherAllowances?.amount;
      }

      // console.log("total_payable_salary1", total_payable_salary);

      // console.log("totalAllowances:", totalAllowances);

      return totalAllowances;
    };

    const calculateDeductions = (currentSalaryDeductions) => {
      let totalDeductions = {};
      if (deductions.taxDeduction) {
        totalDeductions.taxDeduction = currentSalaryDeductions.taxDeduction;
        total_payable_salary =
          total_payable_salary -
          (baseSalaryAmount * currentSalaryDeductions.taxDeduction) / 100;
      }
      // console.log(baseSalaryAmount);

      // console.log("total_payable_salary after tax", total_payable_salary);

      if (deductions.providentFund) {
        totalDeductions.providentFund = currentSalaryDeductions.providentFund;
        total_payable_salary =
          total_payable_salary -
          (baseSalaryAmount * currentSalaryDeductions.providentFund) / 100;
      }

      if (deductions.professionalTax) {
        totalDeductions.professionalTax =
          currentSalaryDeductions.professionalTax;
        total_payable_salary =
          total_payable_salary -
          (baseSalaryAmount * currentSalaryDeductions.professionalTax) / 100;
      }

      if (deductions?.otherDeductions) {
        totalDeductions.otherDeductions = {
          description: deductions.otherDeductions.description,
          amount: deductions?.otherDeductions?.amount,
        };
        total_payable_salary =
          total_payable_salary - deductions?.otherDeductions?.amount;
      }

      // console.log("totalDeductions:", totalDeductions);
      // console.log("total_payable_salary2", total_payable_salary);

      return totalDeductions;
    };

    const calculateBonuses = (currentSalaryBonuses) => {
      let total_bonus = {};

      if (bonuses.performanceBonus) {
        total_bonus.performanceBonus = currentSalaryBonuses.performanceBonus;
        total_payable_salary =
          total_payable_salary + currentSalaryBonuses.performanceBonus;
      }

      if (bonuses.festivalBonus) {
        total_bonus.festivalBonus = currentSalaryBonuses.festivalBonus;
        total_payable_salary =
          total_payable_salary + currentSalaryBonuses.festivalBonus;
      }

      if (bonuses.otherBonuses) {
        total_bonus.otherBonuses = {
          description: bonuses.otherBonuses.description,
          amount: bonuses?.otherBonuses?.amount,
        };
        total_payable_salary =
          total_payable_salary + bonuses?.otherBonuses?.amount;
      }

      // console.log("total_bonus", total_bonus);
      // console.log("total_payable_salary3", total_payable_salary);

      return total_bonus;
    };

    let salaryData = {
      teacherId: teacher._id,
      academicYear: currentSalaryStructure.academicYear,
      baseSalary: currentSalaryStructure.baseSalary,
      allowances: calculateAllowances(currentSalaryStructure.allowances),
      deductions: calculateDeductions(currentSalaryStructure.deductions),
      bonuses: calculateBonuses(currentSalaryStructure.bonus),
    };

    total_payable_salary = total_payable_salary + baseSalaryAmount;

    // console.log("total_ payable_salary", total_payable_salary);

    salaryData.totalPayable = total_payable_salary;

    // console.log("salaryData", salaryData);

    if (!salaryData) {
      return new ApiError(400, "Unable to calculate salary data");
    }

    const teacherSalaryData = await TeacherSalary.create({
      ...salaryData,
      teacherId: teacher._id,
    });

    console.log("teacherSalaryData", teacherSalaryData);

    // 5. Return success response
    return res.status(201).json(
      new ApiResponse(201, {
        message: "Teacher registered successfully.",
        teacher: {
          id: teacher._id,
          fullName: user.fullName,
          email: user.email,
          teacherId: teacher.teacherId,
          subjectSpecialization: teacher.subjectSpecialization,
          employmentDate: teacher.employmentDate, // Date.now() is assigned in teacher model
          dateOfBirth: teacher.dateOfBirth,
          address: teacher.address,
        },
      })
    );
  } catch (error) {
    console.error("Error registering teacher:", error);
    throw new ApiError(
      500,
      "Internal Server Error. Teacher registration failed."
    );
  }
});

const registerStudent = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    password,
    classEnrolled,
    section, //  section is being sent from the frontend
    dateOfBirth,
    guardianDetails,
    academicYear, // academicYear is sent too
    hostel,
    transportation,
    concessions,
  } = req.body;

  // console.log("hostel", hostel);

  // console.log(fullName, academicYear, hostel, transportation, concessions);

  const calculateTransportationFees = (basicTransportationFee) => {
    const { isTransportation, transportationDetails } = transportation;
    if (!isTransportation) {
      return 0;
    }

    if (!transportationDetails.distance && !transportationDetails.tripType) {
      return 0;
    }

    if (transportationDetails.distance === "upto 10km") {
      if (transportationDetails.tripType === "oneWay") {
        return basicTransportationFee.oneWayFee;
      } else if (transportationDetails.tripType === "roundTrip") {
        return basicTransportationFee.roundTripFee;
      }
    } else if (transportationDetails.distance === "10-20km") {
      if (transportationDetails.tripType === "oneWay") {
        return basicTransportationFee.oneWayFee * 1.5;
      } else if (transportationDetails.tripType === "roundTrip") {
        return basicTransportationFee.roundTripFee * 1.5;
      }
    } else if (transportationDetails.distance === "above 20km") {
      if (transportationDetails.tripType === "oneWay") {
        return basicTransportationFee.oneWayFee * 2;
      } else if (transportationDetails.tripType === "roundTrip") {
        return basicTransportationFee.roundTripFee * 2;
      }
    }
  };

  const calculateHostelFee = (basicHostelFee) => {
    const { isHostel, hostelDetails } = hostel;

    if (!isHostel) {
      return 0;
    }

    if (
      !hostelDetails.roomType &&
      !hostelDetails.boardingOption &&
      !hostelDetails.mealPlan
    ) {
      return 0;
    }

    if (hostelDetails.roomType === "single") {
      if (hostelDetails.boardingOption === "fullTime") {
        if (hostelDetails.mealPlan === "standard") {
          return basicHostelFee.feeAmount;
        } else if (hostelDetails.mealPlan === "premium") {
          return basicHostelFee.feeAmount * 1.5;
        }
      } else if (hostelDetails.boardingOption === "weekDays") {
        if (hostelDetails.mealPlan === "standard") {
          return basicHostelFee.feeAmount * 0.8;
        } else if (hostelDetails.mealPlan === "premium") {
          return basicHostelFee.feeAmount * 1.25;
        }
      } else if (hostelDetails.boardingOption === "weekEnds") {
        if (hostelDetails.mealPlan === "standard") {
          return basicHostelFee.feeAmount * 0.4;
        } else if (hostelDetails.mealPlan === "premium") {
          return basicHostelFee.feeAmount * 0.6;
        }
      }
    } else if (hostelDetails.roomType === "double") {
      if (hostelDetails.boardingOption === "fullTime") {
        if (hostelDetails.mealPlan === "standard") {
          return basicHostelFee.feeAmount * 0.6;
        } else if (hostelDetails.mealPlan === "premium") {
          return basicHostelFee.feeAmount * 1.5 * 0.6;
        }
      } else if (hostelDetails.boardingOption === "weekDays") {
        if (hostelDetails.mealPlan === "standard") {
          return basicHostelFee.feeAmount * 0.8 * 0.6;
        } else if (hostelDetails.mealPlan === "premium") {
          return basicHostelFee.feeAmount * 1.25 * 0.6;
        }
      } else if (hostelDetails.boardingOption === "weekEnds") {
        if (hostelDetails.mealPlan === "standard") {
          return basicHostelFee.feeAmount * 0.4 * 0.6;
        } else if (hostelDetails.mealPlan === "premium") {
          return basicHostelFee.feeAmount * 0.6 * 0.6;
        }
      }
    } else if (hostelDetails.roomType === "dormitory") {
      if (hostelDetails.boardingOption === "fullTime") {
        if (hostelDetails.mealPlan === "standard") {
          return basicHostelFee.feeAmount * 0.4;
        } else if (hostelDetails.mealPlan === "premium") {
          return basicHostelFee.feeAmount * 1.5 * 0.4;
        }
      } else if (hostelDetails.boardingOption === "weekDays") {
        if (hostelDetails.mealPlan === "standard") {
          return basicHostelFee.feeAmount * 0.8 * 0.4;
        } else if (hostelDetails.mealPlan === "premium") {
          return basicHostelFee.feeAmount * 1.25 * 0.4;
        }
      } else if (hostelDetails.boardingOption === "weekEnds") {
        if (hostelDetails.mealPlan === "standard") {
          return basicHostelFee.feeAmount * 0.4 * 0.4;
        } else if (hostelDetails.mealPlan === "premium") {
          return basicHostelFee.feeAmount * 0.6 * 0.4;
        }
      }
    }
  };

  try {
    // 1. Validate required fields
    if (
      !fullName ||
      !email ||
      !password ||
      !classEnrolled ||
      !dateOfBirth ||
      !academicYear
    ) {
      throw new ApiError(
        400,
        "Full name, email, password, class, date of birth, academicYear are required."
      );
    }

    // 2. Check if the class exists
    let classRecord = await Class.findOne({
      className: classEnrolled,
      section: section,
    });

    // 3. If the class doesn't exist, create a new class and assign a CLass Teacher to the class
    if (!classRecord) {
      // Fetch the first teacher
      const firstTeacher = await Teacher.findOne({}).sort({ createdAt: 1 }); // Get the first teacher based on creation date

      if (!firstTeacher) {
        return res
          .status(400)
          .json({ message: "No teachers available to assign." });
      }

      classRecord = await Class.create({
        className: classEnrolled, // Assuming you're passing a className or ID in classEnrolled
        section: section, // You can adjust the section logic
        academicYear: academicYear || "2023-2024", // Default academic year if not provided
        students: [], // Start with an empty student array
        classTeacher: firstTeacher._id, // Assign the first teacher as the class teacher
      });
    }

    // 4. Check if a student with the same full name, email, date of birth, and guardian details exists
    const existingStudent = await Student.findOne({
      fullName,
      email,
      dateOfBirth,
      "guardianDetails.fatherName": guardianDetails.fatherName,
      "guardianDetails.motherName": guardianDetails.motherName,
    });

    if (existingStudent) {
      throw new ApiError(400, "A student with these details already exists.");
    }

    // Find the highest existing roll number in the class
    const highestRollNumber = await Student.findOne(
      {
        classEnrolled: classRecord._id,
        section: section || classRecord.section, // Also filter by section
      },
      { rollNumber: 1 }
    ).sort({ rollNumber: -1 });

    // If a highest roll number exists, increment it; otherwise, start at 1
    const rollNumber = highestRollNumber
      ? `${parseInt(highestRollNumber.rollNumber) + 1}`
      : `${parseInt("1")}`;

    // 5. Create a new User record
    const user = await User.create({
      fullName,
      email,
      password, // Ensure password hashing is done in the User model
    });

    // 6. Generate a unique studentId (example based on current timestamp)
    const studentId = `S-${Date.now()}`;

    let fee = {};
    let totalFeeAmount;
    // FEES DEFINING
    if (classEnrolled) {
      const feeStructureData = await FeeStructure.find({});
      // console.log("feeStructureData", feeStructureData);
      // Find the fee structure for the current class and academic year
      const feeStructure = feeStructureData.find(
        (fee) => fee.academicYear === "2024-25"
      );

      const baseTuitionFee = feeStructure.baseTuitionFee || 0;
      // This is here because we want to calculate concession in fee object

      if (feeStructure) {
        fee = {
          academicYear: feeStructure.academicYear,
          department: feeStructure.department || "Unknown", // You can set a default if department is null
          baseTuitionFee: baseTuitionFee,
          transportationFee: calculateTransportationFees(
            feeStructure.transportationFee
          ),
          hostelFee: calculateHostelFee(feeStructure.hostelFee),
          labFees: 0, // Assuming lab fees are not included in the fee structure data; update accordingly
          extracurricularFees: 0, // Assuming extracurricular fees are not included
          libraryFee: feeStructure.libraryFee || 0,
          examFees: feeStructure.examFees || 0,
          uniformFee: feeStructure.uniformFee || 0,
          digitalResourcesFee: feeStructure.digitalResourcesFee || 0,
          sportsFacilityFee: feeStructure.sportsFacilityFee || 0,
          medicalServiceFee: feeStructure.medicalServiceFee || 0,
          counselingFee: feeStructure.counselingFee || 0,
          concessions: {
            siblingDiscount: concessions?.siblingDiscount
              ? (feeStructure?.concessions?.siblingDiscount * baseTuitionFee) /
                100
              : 0,
            incomeBasedDiscount: concessions?.incomeBasedDiscount
              ? (feeStructure?.concessions?.incomeBasedDiscount *
                  baseTuitionFee) /
                100
              : 0,
            meritScholarship: concessions?.meritScholarship
              ? (feeStructure?.concessions?.meritScholarship * baseTuitionFee) /
                100
              : 0,
          },
          eventFees: 0, // Assuming event fees are not included
        };

        function calculateTotalFee(fee) {
          // Base fees
          const baseFees = [
            fee.baseTuitionFee,
            fee.transportationFee,
            fee.hostelFee,
            fee.labFees,
            fee.extracurricularFees,
            fee.libraryFee,
            fee.examFees,
            fee.uniformFee,
            fee.digitalResourcesFee,
            fee.sportsFacilityFee,
            fee.medicalServiceFee,
            fee.counselingFee,
            fee.eventFees,
          ];

          // Calculate total base fees
          const totalBaseFees = baseFees.reduce(
            (total, current) => total + (current || 0),
            0
          );

          // Concession fees
          const concessionFees = [
            fee.concessions?.siblingDiscount,
            fee.concessions?.incomeBasedDiscount,
            fee.concessions?.meritScholarship,
          ];

          // Calculate total concessions
          const totalConcessions = concessionFees.reduce(
            (total, current) => total + (current || 0),
            0
          );

          // Subtract concessions from total fees
          const totalFeeAmount = totalBaseFees - totalConcessions;

          return totalFeeAmount;
        }

        // Usage
        totalFeeAmount = calculateTotalFee(fee);

        fee.totalFeeAmount = totalFeeAmount; // ADDING NEW PROPERTY, total fee amount

        // console.log("Total Fee Amount: ", totalFeeAmount);

        console.log("Final Fee Data: ", fee);
      } else {
        console.log("No fee structure found for the academic year.");
      }
    }

    // 7. Create a new Student record
    const student = await Student.create({
      userId: user._id, // Link the student to the created user
      studentId,
      classEnrolled: classRecord._id,
      section: section || classRecord.section, // Ensure the section is stored in the student document
      rollNumber,
      dateOfBirth,
      guardianDetails: {
        fatherName: guardianDetails.fatherName,
        motherName: guardianDetails.motherName,
        contactNumber: guardianDetails.contactNumber,
        address: {
          street: guardianDetails.address.street,
          city: guardianDetails.address.city,
          state: guardianDetails.address.state,
          postalCode: guardianDetails.address.postalCode,
        },
      },
    });

    // console.log("student._id", student._id);

    const studentFee = await StudentFee.create({
      ...fee,
      studentId: student._id, // Spread the properties of `fee` object here
    });

    // console.log("studentFee", studentFee);

    // 8. Add the student to the class's students array
    classRecord.students.push(student._id);
    await classRecord.save();

    console.log("Student Created", student);

    // 9. Return success response
    return res.status(201).json(
      new ApiResponse(201, {
        message: "Student registered successfully and added to the class.",
        student: {
          id: student._id,
          fullName: user.fullName,
          email: user.email,
          studentId: student.studentId,
          classEnrolled: classRecord.className,
          rollNumber: student.rollNumber,
          dateOfBirth: student.dateOfBirth,
          admissionDate: student.admissionDate,
          guardianDetails: student.guardianDetails,
        },
        class: {
          className: classRecord.className,
          section: classRecord.section,
          academicYear: classRecord.academicYear,
        },
      })
    );
  } catch (error) {
    console.error("Error registering student:", error);
    throw new ApiError(
      500,
      "Internal Server Error. Student registration failed."
    );
  }
});

export { registerAdmin, registerTeacher, registerStudent };
