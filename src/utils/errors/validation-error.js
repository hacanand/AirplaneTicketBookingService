const { StatusCodes } = require("http-status-codes");
class ValidationError extends Error {
    constructor(error) {
      super();
      let explanation = [];
      error.errors.forEach((err) => {
          explanation.push(err.message)
      })
      this.name = "ValidationError";
      this.message = 'not able to validate the request body';
      this.explanation = explanation;
      this.statusCode = statusCode;
      
  }
}
module.exports = ValidationError;