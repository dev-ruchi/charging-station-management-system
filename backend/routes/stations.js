import express from "express";
import { validationResult } from "express-validator";
import createStationRules from "../rules/station.rules.js";
import createStation from "../services/station.service.js";
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

export default router;
