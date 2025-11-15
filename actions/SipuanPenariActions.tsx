'use server'

import { Key } from 'react';
import axios, { AxiosError } from 'axios';
// Server
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
// Client
import { getSession } from 'next-auth/react';

type ResponResult = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: any;
  status?: any;
};

export async function getStatisticPertanianAction(paramGet?: string): Promise<ResponResult> {
  try {
    // Get token from session (server)
    const session = await getServerSession(authOptions);
    const token = session?.data.token;

    let apiURL = process.env.NEXT_PUBLIC_API_URL + '/api/v1/getResult/sipuanpenari/pertanian';
    if (paramGet) {
      apiURL += '?' + paramGet;
    }
    const response = await axios.get(apiURL, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const api = response.data;
    return api;
  }
  catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const api = error.response.data;
        return {
          success: false,
          message: api.message || 'Gagal mengambil data produksi pertanian !',
          errors: api.errors
        };
      } else if (error.request) {
        return {
          success: false,
          message: 'Network error - Tidak dapat terhubung ke server !'
        };
      } else {
        return {
          success: false,
          message: 'Request error - ' + error.message + ' !'
        };
      }
    } else {
      return {
        success: false,
        message: 'Unexpected error occurred !'
      };
    }
  }
}

export async function getStatisticPerkebunanAction(paramGet?: string): Promise<ResponResult> {
  try {
    // Get token from session (server)
    const session = await getServerSession(authOptions);
    const token = session?.data.token;

    let apiURL = process.env.NEXT_PUBLIC_API_URL + '/api/v1/getResult/sipuanpenari/perkebunan';
    if (paramGet) {
      apiURL += '?' + paramGet;
    }
    const response = await axios.get(apiURL, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const api = response.data;
    return api;
  }
  catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const api = error.response.data;
        return {
          success: false,
          message: api.message || 'Gagal mengambil data produksi perkebunan !',
          errors: api.errors
        };
      } else if (error.request) {
        return {
          success: false,
          message: 'Network error - Tidak dapat terhubung ke server !'
        };
      } else {
        return {
          success: false,
          message: 'Request error - ' + error.message + ' !'
        };
      }
    } else {
      return {
        success: false,
        message: 'Unexpected error occurred !'
      };
    }
  }
}

export async function getStatisticPeternakanAction(paramGet?: string): Promise<ResponResult> {
  try {
    // Get token from session (server)
    const session = await getServerSession(authOptions);
    const token = session?.data.token;

    let apiURL = process.env.NEXT_PUBLIC_API_URL + '/api/v1/getResult/sipuanpenari/peternakan';
    if (paramGet) {
      apiURL += '?' + paramGet;
    }
    const response = await axios.get(apiURL, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const api = response.data;
    return api;
  }
  catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const api = error.response.data;
        return {
          success: false,
          message: api.message || 'Gagal mengambil data produksi peternakan !',
          errors: api.errors
        };
      } else if (error.request) {
        return {
          success: false,
          message: 'Network error - Tidak dapat terhubung ke server !'
        };
      } else {
        return {
          success: false,
          message: 'Request error - ' + error.message + ' !'
        };
      }
    } else {
      return {
        success: false,
        message: 'Unexpected error occurred !'
      };
    }
  }
}

export async function getStatisticPerikananAction(paramGet?: string): Promise<ResponResult> {
  try {
    // Get token from session (server)
    const session = await getServerSession(authOptions);
    const token = session?.data.token;

    let apiURL = process.env.NEXT_PUBLIC_API_URL + '/api/v1/getResult/sipuanpenari/perikanan';
    if (paramGet) {
      apiURL += '?' + paramGet;
    }
    const response = await axios.get(apiURL, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const api = response.data;
    return api;
  }
  catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const api = error.response.data;
        return {
          success: false,
          message: api.message || 'Gagal mengambil data produksi perikanan !',
          errors: api.errors
        };
      } else if (error.request) {
        return {
          success: false,
          message: 'Network error - Tidak dapat terhubung ke server !'
        };
      } else {
        return {
          success: false,
          message: 'Request error - ' + error.message + ' !'
        };
      }
    } else {
      return {
        success: false,
        message: 'Unexpected error occurred !'
      };
    }
  }
}