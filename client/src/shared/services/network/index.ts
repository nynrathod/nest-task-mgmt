import axios, { AxiosInstance } from "axios";
import { onResponseFulfilled, onResponseRejected } from "./response.ts";
import { onRequestFulfilled, onRequestRejected } from "./request.ts";
import { getItemFromLocalStorage } from "../../utilities/common/storage.ts";
import { StorageItems } from "../../constants/app.ts";

interface NetworkRequest {
  url: string;
  body?: any;
  headers?: Record<string, any>;
  params?: Record<string, any>;
}

class Network {
  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 30000,
    });
    this.#attachInterceptors();
    this.attachAuthToken();
  }

  get = async (request: NetworkRequest) => {
    return this.client.get(request.url, {
      params: request.params,
      headers: request.headers,
    });
  };

  post = async (request: NetworkRequest) => {
    return this.client.post(request.url, request.body, {
      params: request.params,
      headers: request.headers,
    });
  };

  put = async (request: NetworkRequest) => {
    return this.client.put(request.url, request.body, {
      params: request.params,
      headers: request.headers,
    });
  };

  delete = async (request: NetworkRequest) => {
    return this.client.delete(request.url, {
      params: request.params,
      headers: request.headers,
    });
  };

  attachAuthToken = async () => {
    const user = getItemFromLocalStorage(StorageItems.USER_INFO, "object");
    console.log("Retrieved user info:", user);
    if (user && user.accessToken) {
      this.client.defaults.headers.common.Authorization = `Bearer ${user.accessToken}`;
    }
  };

  #attachInterceptors = () => {
    this.client.interceptors.request.use(onRequestFulfilled, onRequestRejected);
    this.client.interceptors.response.use(
      onResponseFulfilled,
      onResponseRejected,
    );
  };
}

const network = new Network();
export default network;
