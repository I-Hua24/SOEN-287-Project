import mongoose from 'mongoose';

// This is the room time slots
const slotSchema = new mongoose.Schema({
    time: { type: String, required: true, match: /^\d{2}:\d{2}$/ }, // 09:00
    status: { type: String, enum: ['free', 'pending', 'booked'], default: 'free' },
    bookedBy: { type: String, default: null },
    note: { type: String, default: '' } // Added note so i can later add a purpose or a group title.
});

// Each room is composed of a category, room number, day, and then the times (array of slotSchema)
const roomSchema = new mongoose.Schema({
    category: { type: String, enum: ['study', 'sportsFacility', 'specializedEquipment', 'softwareSeats'], required: true},
    room: { type: String, required: true, trim: true }, // HA-305
    day: { type: Date, required: true }, // in 2025-11-12T05:00:00.000+00:00 format
    slots: { type: [slotSchema], default: [] }
},{ timestamps: true });

// Set day to midnight
roomSchema.pre('save', function (next) {
    if (this.day) this.day.setHours(0, 0, 0, 0);
    next();
});

// Prevent duplicates
roomSchema.index({ category: 1, room: 1, day: 1 }, { unique: true });

const RoomModel = mongoose.model('Room', roomSchema);

export default RoomModel;
