import express from "express";
import { validationResult } from "express-validator";
import createStationRules from "../rules/station.rules.js";
import {
  createStation,
  findAll,
  findById,
  update,
  deleteStation
} from "../services/station.service.js";
import auth from "../routes/middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  ...createStationRules,
  auth,

  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const station = await createStation(req.body, req.user._id);

      // Populate createdBy field for response
      await station.populate("createdBy", "username email");

      res.status(201).json({
        success: true,
        message: "Station created successfully",
        data: station,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const stations = await findAll(req.query);

    res.json({
      success: true,
      count: stations.length,
      data: stations,
    });
  } catch (error) {
    console.error("Get Stations Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const station = await findById(req.params.id);
    res.json({
      success: true,
      data: station,
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
});

router.put("/:id", auth, ...createStationRules, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedStation = await update(req.params.id, req.user._id, req.body);

    res.json({
      success: true,
      message: "Station updated successfully",
      data: updatedStation,
    });
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const stationId = req.params.id;
    const userId = req.user?._id;

    const result = await deleteStation(stationId, userId);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
});

export default router;
