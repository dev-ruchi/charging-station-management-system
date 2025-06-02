import mongoose from "mongoose";

const stationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180,
      },
      address: {
        type: String,
        trim: true,
      },
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    powerOutput: {
      type: Number,
      required: true,
      min: 0,
    },
    connectorType: {
      type: String,
      required: true,
      enum: ["Type 1", "Type 2", "CHAdeMO", "CCS", "Tesla Supercharger"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

stationSchema.index({ "location.latitude": 1, "location.longitude": 1 });

const Station = mongoose.model("Station", stationSchema);
export default Station;
