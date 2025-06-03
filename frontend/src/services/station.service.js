import api from "./api";

export const stationService = {
  async getAllStations(params = {}) {
    try {
      const response = await api.get("/stations", { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getStationById(id) {
    try {
      const response = await api.get(`/stations/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async createStation(stationData) {
    try {
      const response = await api.post("/stations", stationData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async updateStation(id, stationData) {
    try {
      const response = await api.put(`/stations/${id}`, stationData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async deleteStation(id) {
    try {
      const response = await api.delete(`/stations/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  handleError(error) {
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      const message = error.response.data?.message || "An error occurred";
      const status = error.response.status;

      // Create a custom error with additional properties
      const customError = new Error(message);
      customError.status = status;
      customError.response = error.response;

      return customError;
    } else if (error.request) {
      // Request was made but no response received
      return new Error("No response received from server");
    } else {
      // Something happened in setting up the request
      return new Error("Error setting up the request");
    }
  },
};
