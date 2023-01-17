/* eslint max-classes-per-file: ['off'] */

class StandardError extends Error {
  constructor(message, code = 0) {
    super(message);
    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;
    this.code = code;
    // This clips the constructor invocation from the stack trace.
    // It's not absolutely essential, but it does make the stack trace a little nicer.
    //  @see Node.js reference (bottom)
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFound extends StandardError {
  constructor(message = '') {
    super(message || 'Resource not found', 404);
  }
}

module.exports = {
  StandardError,
  NotFound,
};
