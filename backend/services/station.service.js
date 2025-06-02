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

  const stations = await store.findStations(filter);
  return stations;
};

export const findById = async (id) => {
  const station = await store.findById(id);
  if (!station) {
    throw new Error("Station not found");
  }
  return station;
}; 
