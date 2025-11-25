import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
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
    availabilityFrom: {
        type: Date,
        required: true
    },
    availabilityTo: {
        type: Date,
        required: true
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
