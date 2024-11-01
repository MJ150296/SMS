import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { AttendanceRecord } from "../models/Attendance Model/attendanceRecord.model.js";
import dayjs from "dayjs";

// Controller function for fetching attendance summary for the current month
const getMonthlyAttendanceSummary = asyncHandler(async (req, res) => {
  try {
    // Define the start and end of the current month
    const startOfMonth = dayjs().startOf("month").toDate();
    const endOfMonth = dayjs().endOf("month").toDate();

    // Query for all attendance records within the current month, sorted by date
    const attendanceRecords = await AttendanceRecord.find({
      date: { $gte: startOfMonth, $lte: endOfMonth },
    }).sort({ date: 1 }); // Sorting by date in ascending order

    // console.log(attendanceRecords);

    // Find the first and last dates based on the records retrieved
    const firstRecordDate =
      attendanceRecords.length > 0 ? attendanceRecords[0].date : null;
    const lastRecordDate =
      attendanceRecords.length > 0
        ? attendanceRecords[attendanceRecords.length - 1].date
        : null;

    // Calculate the difference in days between firstRecordDate and lastRecordDate
    const numberOfDays =
      firstRecordDate && lastRecordDate
        ? dayjs(lastRecordDate).diff(dayjs(firstRecordDate), "day") + 1
        : 0;

    // Check if there are attendance records in the current month
    if (attendanceRecords.length === 0) {
      return res.status(200).json({
        message: "No attendance data available for the current month",
        summary: { total: 0, students: 0, teachers: 0, admins: 0 },
        firstRecordDate,
        lastRecordDate,
      });
    }

    // Initialize summary object
    const summary = {
      total: attendanceRecords.length,
      student: { present: 0, absent: 0, late: 0, approved_leave: 0 },
      teacher: { present: 0, absent: 0, late: 0, approved_leave: 0 },
      admin: { present: 0, absent: 0, late: 0, approved_leave: 0 },
      firstRecordDate,
      lastRecordDate,
      numberOfDays,
    };

    // Helper function to increment role-based attendance status
    const incrementStatusCount = (role, status) => {
      if (summary[role]) {
        summary[role][status] += 1;
      }
    };

    // Iterate over records and categorize by role and status
    attendanceRecords.forEach((record) => {
      const { role, status } = record;
      incrementStatusCount(role, status);
    });

    // console.log(summary);

    // Additional calculations: Count total present days
    const totalPresent = attendanceRecords.filter((record) => {
      return record.status === "present";
    }).length;

    summary.totalPresent = totalPresent;

    // console.log(summary);

    // Send response with calculated summary
    res.status(200).json({
      message: "Monthly attendance summary fetched successfully",
      summary,
    });
  } catch (error) {
    console.error("Error fetching attendance summary:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching attendance summary" });
  }
});

const addOrUpdateAttendance = asyncHandler(async (req, res) => {
  try {
    const { date, attendance, userRole, classId } = req.body;

    // console.log(req.body);

    // Validate date and attendance data
    if (!date || !attendance || typeof attendance !== "object" || !userRole) {
      return new ApiError(
        res,
        400,
        "Invalid input data: date, attendance, or userRole missing or incorrect"
      );
    }

    // Process each attendance record
    const results = await Promise.all(
      Object.entries(attendance).map(async ([userId, { status, reason }]) => {
        // Check required fields in each record
        if (!userId || !status) {
          throw new Error(
            "Each attendance entry must contain a userId and status"
          );
        }

        // Create or update record based on userRole
        const query = {
          userId,
          date,
          ...(userRole === "student" && { classId }),
        };

        // Check if an attendance record exists
        let attendanceRecord = await AttendanceRecord.findOne(query);

        if (attendanceRecord) {
          // Update the existing record
          attendanceRecord.status = status;
          attendanceRecord.notes = reason || attendanceRecord.notes;

          if (status === "approved_leave") {
            attendanceRecord.approvedLeave = true;
          }
          attendanceRecord.approvedLeave = true;
          await attendanceRecord.save();
          return { action: "updated", record: attendanceRecord };
        } else {
          let approvedLeave;
          if (status === "approved_leave") {
            approvedLeave = true;
          }
          // Create a new attendance record
          const newRecord = new AttendanceRecord({
            submitterId: req.user._id,
            userId,
            role: userRole,
            date,
            status,
            notes: reason || "",
            approvedLeave: approvedLeave || false,
            ...(userRole === "student" && { classId }),
          });
          await newRecord.save();
          return { action: "created", record: newRecord };
        }
      })
    );
    // console.log("attendance success");
    // console.log("results", results);

    return res
      .status(200)
      .json(new ApiResponse(200, "Attendance processed successfully", results));
  } catch (error) {
    console.error("Error saving attendance:", error);
    return new ApiError(
      res,
      500,
      "Failed to process attendance",
      error.message
    );
  }
});

export { addOrUpdateAttendance, getMonthlyAttendanceSummary };
