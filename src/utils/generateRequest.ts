/* eslint-disable @typescript-eslint/no-explicit-any */

import { credentials } from "../constants";

type FetchOptions = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
};

export const generateRequest = async (
  endpoint: string,
  options: FetchOptions
) => {
  try {
    const response = await fetch(`${credentials.apiBaseUrl}/${endpoint}`, {
      method: options.method,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};
