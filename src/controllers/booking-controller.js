const { BookingService } = require("../services/index");
const { StatusCodes } = require("http-status-codes");
const bookingService = new BookingService();
const { createChannel, publishMessage } = require("../utils/messageQueue");
const { REMAINDER_BINDING_KEY } = require("../config/serverConfig");
class BookingController {
  constructor() {}
  async sendMessageToQueue(req, res) {
    const channel = await createChannel();
    const payload = {
      data: {
        subject: "this is a notification message from queue",
        content: "some queue will subscribe this",
        recipientEmail: "noreply@gmail.com",
        NotificationTime: "2023-02-22T19:35:00",
      },
      service: "CREATE_TICKET",
    };
    publishMessage(channel, REMAINDER_BINDING_KEY, JSON.stringify(payload));
    return res.status(200).json({
      message: "successfully send message to queue",
    });
  }

  async create(req, res) {
    try {
      const response = await bookingService.createBooking(req.body);
      // console.log(response);
      return res.status(StatusCodes.OK || 200).json({
        message: "Booking created successfully",
        success: true,
        err: {},
        data: response,
      });
    } catch (error) {
      return res.status(error.statusCode).json({
        message: error.message,
        success: false,
        err: error.explanation,
        data: {},
      });
    }
  }
}
module.exports = BookingController;
