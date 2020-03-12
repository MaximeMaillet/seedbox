class ApiError extends Error {
  constructor(statusCode, message, fields, e) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.fields = fields;
    this.previous = e;
  }
}

module.exports = ApiError;