/* eslint max-classes-per-file: ['off'] */

export class StandardError extends Error {
  code: number;

  constructor(message: string, code: number = 0) {
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

export class NotFound extends StandardError {
  constructor(message: string = '') {
    super(message || 'Resource not found', 404);
  }
}
