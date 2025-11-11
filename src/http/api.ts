import Config from "react-native-config";

const base_url =
  Config.BASE_URL || "https://fcfqqtkmw9.execute-api.us-east-1.amazonaws.com";
const api_key = Config.API_KEY || "f00f3020932fddf";

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
