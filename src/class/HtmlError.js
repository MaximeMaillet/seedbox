class HtmlError extends Error {
  constructor(statusCode, title, body, e) {
    super(title);
    this.name = "HtmlError";
    this.statusCode = statusCode;
    this.title = title;
    this.body = body;
    this.previous = e;
  }
}

module.exports = HtmlError;