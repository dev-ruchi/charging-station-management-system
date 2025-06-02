import { body } from "express-validator";

export default [
  body("name").notEmpty().withMessage("Station name is required"),
  body("location.latitude")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Valid latitude is required"),
  body("location.longitude")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Valid longitude is required"),
  body("powerOutput")
    .isFloat({ min: 0 })
    .withMessage("Valid power output is required"),
  body("connectorType")
    .isIn(["Type 1", "Type 2", "CHAdeMO", "CCS", "Tesla Supercharger"])
    .withMessage("Valid connector type is required"),
];
