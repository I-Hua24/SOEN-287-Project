import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      // e.g. "Study Room", "Lab", "Sports Facility", "Equipment"
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    availability: {
      // Simple human-readable string for now ("Mon–Fri 08:00–20:00")
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ResourceModel = mongoose.model("Resource", resourceSchema);

export default ResourceModel;
