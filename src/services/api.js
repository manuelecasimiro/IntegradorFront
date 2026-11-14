const BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  getToken() {
    return localStorage.getItem('inova_token');
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('inova_token', token);
    } else {
      localStorage.removeItem('inova_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const token = this.getToken();

    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('inova_token');
          localStorage.removeItem('inova_user');
          window.dispatchEvent(new Event('auth:logout'));
        }

        const error = new Error(data?.message || 'Ocorreu um erro na requisição');
        error.status = response.status;
        error.errors = data?.errors || null;
        throw error;
      }

      return data;
    } catch (err) {
      throw err;
    }
  }

  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
