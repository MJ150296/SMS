import StudentFee from "../../models/Fee Model/student fees document/studentFee.model.js";
import FeePayment from "../../models/Payment Model/feePayment.model.js";
import Student from "../../models/student.model.js";
import { ApiError } from "../../utils/ApiError.utils.js";
import { asyncHandler } from "../../utils/asyncHandler.utils.js";
import dayjs from "dayjs";

const addFeePayment = asyncHandler(async (req, res) => {
  try {
    console.log("USER in FandS", req.user);

    if (!req.user.role === "superAdmin" || !req.user.role === "admin") {
      throw new ApiError(408, "Unauthorized access in monthly payment updates");
    }

    // Fetch all students
    const students = await Student.find();

    if (!students) {
      throw new ApiError(400, "No students found in feePayment controller");
    }

    // Loop through each student with fees and create a fee payment record
    const feePayments = await Promise.all(
      students.map(async (student) => {
        try {
          const studentId = student._id;

          // Fetch the latest student fee document for the current student
          const studentFee = await StudentFee.findOne({ studentId })
            .sort({ createdAt: -1 }) // Sort in descending order to get the latest document
            .exec();

          if (!studentFee) {
            throw new ApiError(
              404,
              `No fee record found for student ID: ${studentId}`
            );
          }

          let fee = {
            academicYear: studentFee.academicYear,
            department: studentFee.department || "Unknown", // You can set a default if department is null
            baseTuitionFee: studentFee.baseTuitionFee,
            transportationFee: studentFee.transportationFee,
            hostelFee: studentFee.hostelFee,
            labFees: 0, // Assuming lab fees are not included in the fee structure data; update accordingly
            extracurricularFees: 0, // Assuming extracurricular fees are not included
            libraryFee: studentFee.libraryFee || 0,
            examFees: studentFee.examFees || 0,
            uniformFee: studentFee.uniformFee || 0,
            digitalResourcesFee: studentFee.digitalResourcesFee || 0,
            sportsFacilityFee: studentFee.sportsFacilityFee || 0,
            medicalServiceFee: studentFee.medicalServiceFee || 0,
            counselingFee: studentFee.counselingFee || 0,
            concessions: {
              siblingDiscount: studentFee.concessions.siblingDiscount,
              incomeBasedDiscount: studentFee.concessions.incomeBasedDiscount,
              meritScholarship: studentFee.concessions.meritScholarship,
            },
            eventFees: 0, // Assuming event fees are not included
          };

          const newStudentFee = await StudentFee.create({
            ...fee,
            studentId: student._id, // Spread the properties of `fee` object here
          });

          //Previous Month Fee Payment details
          const previousFeePayment = await FeePayment.findOne({ studentId })
            .sort({ createdAt: -1 })
            .exec();

          if (!previousFeePayment) {
            throw new ApiError(
              404,
              `No fee record found for student ID: ${studentId}`
            );
          }

          console.log("studentFee", studentFee);

          const studentFeePayment = await FeePayment.create({
            feeId: newStudentFee._id,
            studentId: newStudentFee.studentId,
            amount: previousFeePayment.amount,
            overDueAmount: previousFeePayment.overDueAmount,
            dueDate: dayjs()
              .add(1, "month")
              .startOf("month")
              .format("YYYY-MM-DD"),
            status: "unpaid",
            transactionId: "12345",
            paymentMethod: "cash",
            receipt: "receipt url or file path",
            remarks: "Unpaid till now",
          });

          if (!studentFeePayment) {
            throw new ApiError(
              400,
              `Unable to create fee payment in feePayment controller for ${studentId}`
            );
          }

          console.log("Created fee payment for student:", studentId);
          return studentFeePayment;
        } catch (error) {
          console.error(
            `Error processing fee payment controller function`,
            error
          );
          // Return null or an error object so Promise.all continues
          return null; // or you can return { studentId, error } if you want more info
        }
      })
    );

    // Filter out any nulls (if you choose to return null on errors)
    const successfulPayments = feePayments.filter(
      (payment) => payment !== null
    );

    if (successfulPayments.length === 0) {
      throw new ApiError(500, "No fee payments could be created.");
    } else {
      console.log("Successfully created payments:", successfulPayments);
    }
  } catch (error) {
    throw new ApiError(
      500,
      "An error occurred while adding fee payments",
      error
    );
  }
});
const fetchFeePayment = asyncHandler(async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log("studentId", studentId);

    const studentFeeDetails = await StudentFee.find({ studentId });
    const studentFeePaymentDetails = await FeePayment.find({ studentId });

    console.log(studentFeeDetails);
    console.log("studentFeePaymentDetails", studentFeePaymentDetails);

    return res.status(200).json({
      statusCode: 200,
      data: {
        studentFeeDetails,
        studentFeePaymentDetails,
      },
      message: "Successfully student payment detail fetched.",
    });
  } catch (error) {
    throw new ApiError(402, "unable to fetch payment in feepayment controller");
  }
});
const updateFeePayment = asyncHandler(async (req, res) => {});

export { addFeePayment, fetchFeePayment, updateFeePayment };
