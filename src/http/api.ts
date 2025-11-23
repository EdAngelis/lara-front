import Constants from "expo-constants";

const extra =
  (Constants as any).expoConfig?.extra ??
  (Constants as any).manifest?.extra ??
  {};

const base_url = extra.BASE_URL;
const api_key = extra.API_KEY;
const env = extra.ENV;

const defaultHeaders = {
  "x-api-key": api_key,
  "Content-Type": "application/json",
};

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export const api = {
  async makeRequest(
    endpoint: string,
    method: HttpMethod,
    data?: any,
    customHeaders?: any
  ) {
    if (env === "development") return;
    try {
      let headers = { ...defaultHeaders, ...customHeaders };
      let body;
      if (data instanceof FormData) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ["Content-Type"]: _, ...rest } = headers;
        headers = rest;
        body = data;
      } else {
        body = data ? JSON.stringify(data) : undefined;
      }
      const response = await fetch(`${base_url}${endpoint}`, {
        method,
        headers,
        body,
      });

      return response.json();
    } catch (error) {
      console.error(`Error fetching ${method} request:`, error);
      throw error;
    }
  },

  async get(endpoint: string, customHeaders?: any) {
    return this.makeRequest(endpoint, "GET", undefined, customHeaders);
  },

  async post(endpoint: string, data?: any, customHeaders?: any) {
    return this.makeRequest(endpoint, "POST", data, customHeaders);
  },

  async put(endpoint: string, data: any, customHeaders?: any) {
    return this.makeRequest(endpoint, "PUT", data, customHeaders);
  },

  async delete(endpoint: string, data?: any, customHeaders?: any) {
    return this.makeRequest(endpoint, "DELETE", data, customHeaders);
  },
};
