import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import authRouter from "./routes/auth.js";
import stationRoutes from "./routes/stations.js";

mongoose
  .connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("Failed to connect to DB:", err));

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 3000;

app.get("/", (req, res) => {
  res.send("Welcome to the Charging Station Management System!");
});

app.use("/api/auth", authRouter);
app.use('/api/stations', stationRoutes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
