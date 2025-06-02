import Station from "../models/station.models.js";

export function create(data) {
  return Station.create(data);
}

export function findStations(filter = {}) {
  return Station.find(filter)
    .populate("createdBy", "username email")
    .sort({ createdAt: -1 });
}
