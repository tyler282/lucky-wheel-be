import { ResponseDto } from '../dto/response.dto';

export const buildErrorResponse = (message: string): ResponseDto => {
  return {
    data: null,
    isSuccess: false,
    message,
  };
};
