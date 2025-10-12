class apiError extends Error {

  constructor(statuscode,      // consructor will accept parameter
    message = "Something went wronge",
    errors = [],
    stack = "") 
    {    // overrite all properties 
    super(message)
    this.message = message
    this.errors = errors
    this.statuscode = statuscode
    this.data = null
    this.success = false

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }

}

export { apiError }