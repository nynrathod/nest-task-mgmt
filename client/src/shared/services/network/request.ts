import { InternalAxiosRequestConfig } from 'axios';

const onRequestFulfilled = (request: InternalAxiosRequestConfig) => {
  console.log('%c Request: ', 'background: #00f; color: #fff', request);

  return request;
};

const onRequestRejected = (error: Error) => Promise.reject(error);

export { onRequestFulfilled, onRequestRejected };
