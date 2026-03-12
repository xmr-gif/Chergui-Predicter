import axios from 'axios';

const ACCESS_TOKEN_KEY = 'bs_access_token';
const REFRESH_TOKEN_KEY = 'bs_refresh_token';
const ENTERPRISE_KEY = 'bs_enterprise';

// ─── Token Storage ──────────────────────────────────────────

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(access: string, refresh: string, enterprise?: any) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  localStorage.setItem('bs_authenticated', 'true');
  if (enterprise) {
    localStorage.setItem(ENTERPRISE_KEY, JSON.stringify(enterprise));
  }
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ENTERPRISE_KEY);
  localStorage.removeItem('bs_authenticated');
}

export function getEnterprise(): any | null {
  const raw = localStorage.getItem(ENTERPRISE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ─── Auth Check ─────────────────────────────────────────────

export function isAuthenticated(): boolean {
  const token = getAccessToken();
  if (!token) return false;

  // Check if JWT is expired by decoding the payload
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to ms
    return Date.now() < exp;
  } catch {
    return false;
  }
}

// ─── Token Refresh ──────────────────────────────────────────

export async function refreshAccessToken(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  try {
    const res = await axios.post('/api/auth/refresh/', { refresh });
    setTokens(res.data.access, res.data.refresh);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

// ─── Axios Interceptor ──────────────────────────────────────

// Attach JWT to all requests
axios.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401
let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshed = await refreshAccessToken();
      isRefreshing = false;

      if (refreshed) {
        const newToken = getAccessToken();
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      } else {
        processQueue(error, null);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
