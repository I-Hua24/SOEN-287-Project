// admin dashboard
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import RoomModel from "../model/roomModel.js";

import { verifyTokenMiddleware, isAdminMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/adminDashboard", (req, res) => {

    //   const day = atMidnight();
    //    /* await */ ensureSeedFor(day, "study", 10);

    res.sendFile(path.join(__dirname, "../../pages/adminDashboard.html"));
});

router.get(
  "/api/admin/dashboard/stats",
  verifyTokenMiddleware,
  isAdminMiddleware,
  async (req, res) => {
    try {
      const rooms = await RoomModel.find().lean();

      let totalSlots = 0;
      let totalBookings = 0;
      let pendingBookings = 0;

      rooms.forEach((room) => {
        room.slots.forEach((slot) => {
          totalSlots++;
          if (slot.status !== "free") {
            totalBookings++;
            if (slot.status === "pending") pendingBookings++;
          }
        });
      });

      const resourcesCount = rooms.length;
      const utilization = totalSlots === 0 ? 0 : Math.round((totalBookings / totalSlots) * 100);

      res.json({
        totalBookings,
        pendingBookings,
        resources: resourcesCount,
        utilization, // %
      });
    } catch (err) {
      res.status(500).json({
        message: "Error computing dashboard stats",
        error: err.message,
      });
    }
  }
);

/**
 * GET /api/admin/bookings
 * Returns all non-free time slots across all rooms
 * Optional query: ?status=pending or ?status=booked
 */
router.get(
  "/api/admin/bookings",
  verifyTokenMiddleware,
  isAdminMiddleware,
  async (req, res) => {
    try {
      const { status } = req.query;
      const rooms = await RoomModel.find().lean();

      const bookings = [];

      rooms.forEach((room) => {
        room.slots.forEach((slot, index) => {
          if (slot.status === "free") return;
          if (status && slot.status !== status) return;

          bookings.push({
            roomId: room._id,
            slotIndex: index,
            user: slot.bookedBy,
            category: room.category,
            room: room.room,
            date: room.day.toISOString().slice(0, 10), // YYYY-MM-DD
            time: slot.time,
            status: slot.status,
          });
        });
      });

      res.json({ bookings });
    } catch (err) {
      res.status(500).json({
        message: "Error fetching bookings",
        error: err.message,
      });
    }
  }
);

// patch bookings
//
router.patch(
    "/api/admin/bookings/:roomId/slots/:slotIndex",
    verifyTokenMiddleware,
    isAdminMiddleware,
    async (req, res) => {
        try {
            const { roomId, slotIndex } = req.params;
            const { action } = req.body;

            const room = await RoomModel.findById(roomId);
            if (!room) {
                return res.status(404).json({ message: "Room not found" });
            }

            const index = parseInt(slotIndex, 10);
            const slot = room.slots[index];

            if (!slot) {
                return res.status(404).json({ message: "Slot not found" });
            }

            if (action === "approve") {
                if (slot.status !== "pending") {
                    return res
                        .status(400)
                        .json({ message: "Only pending slots can be approved" });
                }
                slot.status = "booked";
            } else if (action === "reject" || action === "cancel") {
                slot.status = "free";
                slot.bookedBy = null;
                slot.note = "";
            } else {
                return res.status(400).json({ message: "Unknown action" });
            }

            await room.save();

            res.json({
                message: "Booking updated",
                slot,
            });
        } catch (err) {
            res.status(500).json({
                message: "Error updating booking",
                error: err.message,
            });
        }
    }
);

/**
 * GET /api/admin/resources
 * List all rooms
 */
router.get(
  "/api/admin/resources",
  verifyTokenMiddleware,
  isAdminMiddleware,
  async (req, res) => {
    try {
      const rooms = await RoomModel.find().lean();
      res.json({ rooms });
    } catch (err) {
      res.status(500).json({
        message: "Error fetching resources",
        error: err.message,
      });
    }
  }
);



/**
 * POST /api/admin/resources
 * Create a new resource
 */
router.post(
  "/api/admin/resources",
  verifyTokenMiddleware,
  isAdminMiddleware,
  async (req, res) => {
    try {
      const { name, type, location, capacity, availability, description, imageUrl } =
        req.body;

      const resource = new ResourceModel({
        name,
        type,
        location,
        capacity,
        availability,
        description,
        imageUrl,
      });

      await resource.save();
      res.status(201).json({ message: "Resource created", resource });
    } catch (err) {
      res.status(500).json({
        message: "Error creating resource",
        error: err.message,
      });
    }
  }
);
export default router;
