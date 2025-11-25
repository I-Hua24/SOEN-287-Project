// admin dashboard
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import RoomModel from "../model/roomModel.js";

import { verifyTokenMiddleware, isAdminMiddleware} from "../middleware/authMiddleware.js";
import ResourceModel from "../model/resourceModel.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/adminDashboard", (req, res) => {
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

 // GET /api/admin/bookings
 // Returns all non-free time slots across all rooms
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

 // GET /api/admin/resources
 // List all resources
router.get(
  "/api/admin/resources",
  verifyTokenMiddleware,
  isAdminMiddleware,
  async (req, res) => {
    try {
      const resources = await ResourceModel.find().lean();
      res.json({ resources });
    } catch (err) {
      res.status(500).json({
        message: "Error fetching resources",
        error: err.message,
      });
    }
  }
);



 // POST /api/admin/resources
 // Create a new resource
router.post(
  "/api/admin/resources",
  verifyTokenMiddleware,
  isAdminMiddleware,
  async (req, res) => {
    try {
      const { name, type, location, capacity, availabilityFrom, availabilityTo, description } =
        req.body;

      const resource = new ResourceModel({
        name,
        type,
        location,
        capacity,
        availabilityFrom,
        availabilityTo,
        description,
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

 // PUT /api/admin/resources/:id
 // Update an existing resource
router.put(
  "/api/admin/resources/:id",
  verifyTokenMiddleware,
  isAdminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, type, location, capacity, availabilityFrom, availabilityTo, description, imageUrl, isBlocked } =
        req.body;

      const updated = await ResourceModel.findByIdAndUpdate(
        id,
        { name, type, location, capacity, availabilityFrom, availabilityTo, description, imageUrl, isBlocked },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "Resource not found" });
      }

      res.json({ message: "Resource updated", resource: updated });
    } catch (err) {
      res.status(500).json({
        message: "Error updating resource",
        error: err.message,
      });
    }
  }
);

 // DELETE /api/admin/resources/:id
 // Delete a resource
router.delete(
  "/api/admin/resources/:id",
  verifyTokenMiddleware,
  isAdminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;

      const deleted = await ResourceModel.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: "Resource not found" });
      }

      res.json({ message: "Resource deleted" });
    } catch (err) {
      res.status(500).json({
        message: "Error deleting resource",
        error: err.message,
      });
    }
  }
);

 // PATCH /api/admin/resources/:id/block
router.patch(
  "/api/admin/resources/:id/block",
  verifyTokenMiddleware,
  isAdminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { isBlocked } = req.body;

      const updated = await ResourceModel.findByIdAndUpdate(
        id,
        { isBlocked: !!isBlocked },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "Resource not found" });
      }

      res.json({ message: "Resource block status updated", resource: updated });
    } catch (err) {
      res.status(500).json({
        message: "Error updating resource block status",
        error: err.message,
      });
    }
  }
);

export default router;
