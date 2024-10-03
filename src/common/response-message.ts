export enum ResponseMessage {
  SUCCESS = 'Success',
  ERROR = 'Error',
  NOT_FOUND = 'Not Found',
  INVALID_CREDENTIALS = 'Invalid Credentials',
}

export enum ErrorMessage {
  IS_REQUIRED = 'is required',
  BAD_REQUEST = 'Bad Request',
  EXISTED = 'is already existed',
  GREATER_THAN_ZERO = 'must be greater than 0',
  USERNAME_PASSWORD_INCORRECT = 'username or password incorrect',
  DATA_NOT_FOUND = 'data not found',
  USER_NOT_FOUND = 'user not found',
}
