import * as store from "../store/station.store.js";

export const createStation = async (stationData, userId) => {
  const newStation = await store.create({
    ...stationData,
    createdBy: userId,
  });

  await newStation.save();
  await newStation.populate("createdBy", "username email");

  return newStation;
};

export const findAll = async (query) => {
  const { status, connectorType, minPower, maxPower } = query;
  const filter = {};

  if (status) filter.status = status;
  if (connectorType) filter.connectorType = connectorType;

  if (minPower || maxPower) {
    filter.powerOutput = {};
    if (minPower) filter.powerOutput.$gte = Number(minPower);
    if (maxPower) filter.powerOutput.$lte = Number(maxPower);
  }

  const stations = await store.findAll(filter);
  return stations;
};

export const findById = async (id) => {
  const station = await store.findById(id);
  if (!station) {
    throw new Error("Station not found");
  }
  return station;
};

export const update = async (id, userId, updateData) => {
  const station = await store.update(id);
  if (!station) {
    const error = new Error("Station not found");
    error.statusCode = 404;
    throw error;
  }

  if (station.createdBy._id.toString() !== userId.toString()) {
    const error = new Error("Not authorized to update this station");
    error.statusCode = 403;
    throw error;
  }

  const updatedStation = await store.update(id, updateData);
  return updatedStation;
};

export const deleteStation = async (stationId, userId) => {
  const station = await store.findById(stationId);

  if (!station) {
    const error = new Error("Station not found");
    error.statusCode = 404;
    throw error;
  };

  if (station.createdBy._id.toString() !== userId.toString()) {
    const error = new Error("Not authorized to delete this station");
    error.statusCode = 403;
    throw error;
  }

  await store.deleteById(stationId);

  return {
    success: true,
    message: "Station deleted successfully",
  };
};
  
