import TeacherSalary from "../../models/Fee Model/teacher salary models/teacherSalary.model.js";
import SalaryPayment from "../../models/Payment Model/salaryPayment.model.js";
import Teacher from "../../models/teacher.model.js";
import { ApiError } from "../../utils/ApiError.utils.js";
import { asyncHandler } from "../../utils/asyncHandler.utils.js";

const addSalaryPayment = asyncHandler(async (req, res) => {
  try {
    console.log("USER in S", req.user);

    if (!req.user.role === "superAdmin" || !req.user.role === "admin") {
      throw new ApiError(408, "Unauthorized access in monthly payment updates");
    }

    const teachers = await Teacher.find();

    if (!teachers) {
      throw new ApiError(400, "No teachers found in feePayment controller");
    }

    const salaryPayments = await Promise.all(
      teachers.map(async (teacher) => {
        const teacherId = teacher._id;
        try {
          console.log("teacherSalary");

          const teacherSalary = await TeacherSalary.findOne({ teacherId })
            .sort({ createdAt: -1 }) // Sort in descending order to get the latest document
            .exec();
          console.log(teacherSalary);

          if (!teacherSalary) {
            throw new ApiError(
              404,
              `No fee record found for teacher ID: ${teacherId}`
            );
          }

          console.log("teacherSalary", teacherSalary);

          let salaryData = {
            teacherId: teacher._id,
            academicYear: teacherSalary.academicYear,
            baseSalary: teacherSalary.baseSalary,
            allowances: teacherSalary.allowances,
            deductions: teacherSalary.deductions,
            bonuses: teacherSalary.bonuses,
            totalPayable: teacherSalary.totalPayable,
          };

          const newTeacherSalary = await new TeacherSalary.create({
            ...salaryData,
          });

          if (!newTeacherSalary) {
            return new ApiError(
              400,
              "Teacher salary data not created in salary payment controller"
            );
          }

          console.log("newTeacherSalary", newTeacherSalary);

          const salaryId = teacherSalary._id;

          const previousSalaryPayment = await SalaryPayment.findOne({
            salaryId,
          })
            .sort({ createdAt: -1 })
            .exec();

          if (!previousSalaryPayment) {
            throw new ApiError(
              404,
              `No fee record found for teacher ID: ${teacherId}`
            );
          }

          console.log("previousSalaryPayment", previousSalaryPayment);

          // const previousSalaryPayment = await new SalaryPayment.create({
          //   salaryId: newTeacherSalary._id,
          //   userId: user._id,
          //   amount: newTeacherSalary.totalPayable,
          //   payPeriod: "monthly",
          //   status: "pending",
          //   transactionId: "123abc",
          //   paymentMethod: "cash",
          //   taxDeductions: 100,
          //   netSalary: teacherSalaryData.totalPayable,
          // });
        } catch (error) {
          throw new ApiError(
            400,
            `Error in creating salaryPayments for ${teacherId}`
          );
        }
      })
    );
  } catch (error) {}
});
const fetchSalaryPayment = asyncHandler(async (req, res) => {
  try {
    const { teacherId } = req.params;

    // console.log("teacherID", teacherId);

    const salaryDetails = await TeacherSalary.find({ teacherId });

    if (!salaryDetails) {
      throw new ApiError(
        400,
        "Teacher salary not found in salaryPayment controller"
      );
    }

    const salaryId = salaryDetails[0]._id;

    const salaryPaymentDetails = await SalaryPayment.find({ salaryId });

    // console.log("salary payment", salaryPaymentDetails);

    return res.status(200).json({
      statusCode: 200,
      data: {
        salaryDetails,
        salaryPaymentDetails,
      },
      message: "Successfully salary detail fetched.",
    });
  } catch (error) {
    throw new ApiError(
      400,
      "Unable to fetch salary payment in controller function"
    );
  }
});
const updateSalaryPayment = asyncHandler(async (req, res) => {});

export { addSalaryPayment, fetchSalaryPayment, updateSalaryPayment };
