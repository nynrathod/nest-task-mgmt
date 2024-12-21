import { AxiosResponse } from "axios";

const onResponseFulfilled = (response: AxiosResponse) => {
  console.log("%c Response: ", "background: #0f0; color: #fff", response);
  return response.data;
};

const onResponseRejected = (error: any) => {
  console.log("%c Error: ", "background: #f00; color: #fff", error.response);
  return Promise.reject(error.response);
};

export { onResponseFulfilled, onResponseRejected };
