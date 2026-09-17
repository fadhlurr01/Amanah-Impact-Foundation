/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Centralized API Base URL configuration
export const API_BASE_URL: string = 
  import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : (typeof window !== 'undefined' && window.location.hostname.includes('kembangin.online'))
      ? 'https://api-amanah.kembangin.online'
      : '';

export function apiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
}

// Global fetch interceptor: automatically redirects any /api/ calls to API_BASE_URL on production
if (typeof window !== 'undefined' && API_BASE_URL) {
  const originalFetch = window.fetch;
  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    if (typeof input === 'string') {
      if (input.startsWith('/api/')) {
        input = `${API_BASE_URL}${input}`;
      }
    } else if (input instanceof URL && input.pathname.startsWith('/api/')) {
      input = new URL(`${API_BASE_URL}${input.pathname}${input.search}`);
    } else if (typeof Request !== 'undefined' && input instanceof Request) {
      const url = input.url;
      // In case URL object or relative string in Request
      try {
        const parsed = new URL(url);
        if (parsed.pathname.startsWith('/api/')) {
          input = new Request(`${API_BASE_URL}${parsed.pathname}${parsed.search}`, input);
        }
      } catch (e) {
        if (url.startsWith('/api/')) {
          input = new Request(`${API_BASE_URL}${url}`, input);
        }
      }
    }
    return originalFetch.call(this, input, init);
  };
}
