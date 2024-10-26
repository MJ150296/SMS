import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { Event } from "../models/events.model.js";
import mongoose from "mongoose";
import { nanoid } from "nanoid";

// Create an event (handles both non-recurring and recurring events)
const createEvent = asyncHandler(async (req, res) => {
  try {
    const isArray = Array.isArray(req.body); // Check if req.body is an array
    let isRecurring = false;
    let eventsData = []; // Initialize an empty array for events

    // If req.body is an array, assume it’s a recurring event
    if (isArray) {
      isRecurring = true;
      const recurrenceId = nanoid();

      // Create an array of recurring events based on each instance in the array
      eventsData = req.body.map((event) => ({
        ...event,
        title: event.title,
        description: event.description,
        type: event.type,
        organizer: event.organizer,
        startDate: event.startDate,
        endDate: event.endDate,
        startTime: event.startTime,
        endTime: event.endTime,
        isRecurring: true,
        recurrenceId: recurrenceId, // Assign the same recurrence ID to each instance
        recurringType: event.recurringType, // Add recurringType
        recurringCount: event.recurringCount,
      }));
    } else {
      // Handle non-recurring event case
      const {
        title,
        description,
        type,
        organizer,
        startDate,
        startTime,
        endDate,
        endTime,
      } = req.body;

      eventsData = [
        {
          title,
          description,
          type,
          organizer,
          startDate,
          startTime,
          endDate,
          endTime,
          isRecurring: false,
        },
      ];
    }

    // Save all events to the database
    const savedEvents = await Event.insertMany(eventsData);

    res.status(201).json(
      new ApiResponse(200, {
        success: true,
        data: savedEvents,
        message: `Successfully created ${
          isRecurring ? "recurring" : "non-recurring"
        } event(s)`,
      })
    );
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      message: "Failed to create event",
      error: error.message,
    });
  }
});

// Get all events or filter by recurrence ID
const getAllEvents = asyncHandler(async (req, res) => {
  try {
    const { recurrenceId } = req.query;

    let events;
    if (recurrenceId) {
      events = await Event.find({ recurrenceId });
    } else {
      events = await Event.find();
    }

    res.status(200).json(
      new ApiResponse(200, {
        success: true,
        data: events,
        message: "Successfully fetched all events",
      })
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch events", error: error.message });
  }
});

// Get a specific event by ID
const getEventById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(
      new ApiResponse(200, {
        success: true,
        data: event,
        message: "Successfully fetched event by ID",
      })
    );
  } catch (error) {
    console.error("Error fetching event:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch event", error: error.message });
  }
});

export { getAllEvents, getEventById, createEvent };
