class ApiError extends Error {
  constructor(statusCode, message, e) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.previous = e;
  }
}

module.exports = ApiError;