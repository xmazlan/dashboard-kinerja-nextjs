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

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: false,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
    // Tambahan konfigurasi untuk performa
    keepAlive: true,
    maxSockets: 50,
    timeout: 15000, // 15 detik untuk connection
  }),
  // Tingkatkan timeout untuk request yang lebih kompleks
  timeout: 15000, // 15 detik (lebih reasonable untuk auth)

  // Konfigurasi retry otomatis untuk network issues
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },

  // Konfigurasi tambahan untuk handling request/response
  maxRedirects: 5,
  maxContentLength: 50 * 1024 * 1024, // 50MB
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
      // silent timeout logging
    } else if (error.response) {
      // Server responded with error status
      console.error(`❌ API Error ${error.response.status}:`, {
        url: error.config?.url,
        method: error.config?.method,
        data: error.response.data,
        status: error.response.status,
      });
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
