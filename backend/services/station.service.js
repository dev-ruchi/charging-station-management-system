import * as store from "../store/station.store.js";

const createStation = async (stationData, userId) => {
  const newStation = await store.create({
    ...stationData,
    createdBy: userId,
  });

  await newStation.save();
  await newStation.populate("createdBy", "username email");

  return newStation;
};

export default createStation;
