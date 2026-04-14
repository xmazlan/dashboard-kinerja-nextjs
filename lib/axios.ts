import Axios, { AxiosRequestConfig } from "axios";
import https from "https";

// Extend AxiosRequestConfig to include metadata
declare module "axios" {
  export interface AxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
  }
}

const isServer = typeof window === "undefined";

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: false,
  timeout: 15000, // 15 detik

  // Hanya terapkan konfigurasi Agent dan pengaturan spesifik node di server
  ...(isServer && {
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
      keepAlive: true,
      maxSockets: 50,
      timeout: 15000,
    }),
    maxRedirects: 5,
    maxContentLength: 50 * 1024 * 1024, // 50MB
  }),

  // Konfigurasi retry otomatis untuk network issues
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
});

// Request interceptor untuk debugging dan add headers dinamis
axios.interceptors.request.use(
  (config) => {
    // Log request untuk debugging
    // if (process.env.NODE_ENV === "development") {
    //   console.log(`🚀 Request: ${config.method?.toUpperCase()} ${config.url}`, {
    //     baseURL: config.baseURL,
    //     timeout: config.timeout,
    //     headers: config.headers,
    //   });
    // }

    // Add timestamp for tracking
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor untuk handling error dan logging
axios.interceptors.response.use(
  (response) => {
    // Log response time untuk monitoring
    if (
      process.env.NODE_ENV === "development" &&
      response.config.metadata?.startTime
    ) {
      const endTime = new Date();
      const duration =
        endTime.getTime() - response.config.metadata.startTime.getTime();
      // console.log(`✅ Response: ${response.status} in ${duration}ms`);
    }

    return response;
  },
  (error) => {
    // Enhanced error logging
    if (error.code === "ECONNABORTED") {
    } else if (error.response) {
      const payload = error.response?.data as
        | { message?: string; errors?: Record<string, unknown> }
        | undefined;
      const info = {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response.status,
        message: String(payload?.message || ""),
        errors: payload?.errors ?? null,
      };
      if (process.env.NODE_ENV === "development") {
        console.error("❌ API Error", info);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("🔌 Network Error:", {
        url: error.config?.url,
        method: error.config?.method,
        message: error.message,
      });
    } else {
      console.error("⚠️ Unexpected Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axios;
