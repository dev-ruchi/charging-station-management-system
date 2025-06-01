import User from "../models/user.models.js";

export function create(data) {
  return User.create(data);
}

export function findByEmail(email) {
  return User.findOne({ email });
}


