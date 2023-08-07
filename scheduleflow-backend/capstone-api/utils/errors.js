class BadRequestError extends Error{
  constructor(message = "Bad Request", statusCode = 400){
    super(message)
    this.statusCode = statusCode
  }
}

class UnauthorizedError extends Error{
  constructor(message = "Not Authorized", statusCode = 401){
    super(message)
    this.statusCode = statusCode
  }
}

module.exports = {BadRequestError, UnauthorizedError}