import { ValidationError } from 'class-validator';
import { ErrorMessage } from '../response-message';

export const getCustomErrorMessage = (error: ValidationError) => {
  let baseErrorMessage: string = ErrorMessage.BAD_REQUEST;
  const firstKey = Object.keys(error.constraints)[0];
  baseErrorMessage = error.constraints[firstKey];
  return baseErrorMessage;
};
