import Station from "../models/station.models.js";

export function create(data) {
  return Station.create(data);
}

export function findAll(filter = {}) {
  return Station.find(filter)
    .populate("createdBy", "username email")
    .sort({ createdAt: -1 });
}

export function findById(id) {
 return Station.findById(id).populate("createdBy", "username email")
} 


export function update(id, updateData) {
  return  Station.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate("createdBy", "username email");
}; 

export const deleteById = (id) => {
  return Station.findByIdAndDelete(id);
};