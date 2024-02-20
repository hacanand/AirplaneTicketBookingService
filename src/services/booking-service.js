const axios = require("axios");
const { BookingRepository } = require("../repository/index");
const { FLIGHT_SERVICE_PATH } = require("../config/serverConfig");
const { StatusCodes } = require("http-status-codes");
const { ServiceError } = require("../utils/errors");

class BookingService {
  constructor() {
    this.bookingRepository = new BookingRepository();
  }
  async createBooking(data) {
    try {
      const flightId = data.flightId;
      const getFlightURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;

      const flight = await axios.get(getFlightURL);
      const flightData = flight.data.data;
      let priceOfTheFlight = flightData.price;
      if (data.noOfSeats > flightData.totalSeats) {
        throw new ServiceError(
          "something we wrong in the booking process",
          "No enough seats available"
        );
      }
      const totalCost = priceOfTheFlight * data.noOfSeats;
      const booking = { ...data, totalCost };
      const bookingData = await this.bookingRepository.create(booking);
      const updateFlightURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${bookingData.flightId}`;
      console.log(updateFlightURL);
      await axios.patch(updateFlightURL, {
        totalSeats: flightData.totalSeats - bookingData.noOfSeats,
      });
    const finalBooking = await this.bookingRepository.update(bookingData.id, {
      status: "Confirmed",
    });
      return finalBooking;
    } catch (error) {
      if (error.name == "RepositoryError" || error.name == "ValidationError")
        throw error;
    }
    throw new ServiceError();
  }
  async update(bookingId, data) {
    try {
      await this.bookingRepository.update(data, { where: { id: bookingId } });
      return true;
    } catch (error) {
      throw new AppError(
        "RepositoryError",
        "Error while updating the booking",
        "there was an error while updating the booking please try again later",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
module.exports = { BookingService };
