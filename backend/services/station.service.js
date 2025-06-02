import * as store from "../store/station.store.js";
import Station from "../models/station.models.js";

export const createStation = async (stationData, userId) => {
  const newStation = new Station({
    ...stationData,
    createdBy: userId,
  });

  await newStation.save();
  await newStation.populate("createdBy", "username email");

  return newStation;
};
