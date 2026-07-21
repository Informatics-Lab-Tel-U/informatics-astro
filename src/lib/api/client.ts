// Konfigurasi dasar untuk melakukan fetch request ke eksternal API
export const apiClient = {
  get: async <T>(url: string, init?: RequestInit): Promise<T> => {
    const response = await fetch(url, {
      ...init,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch GET ${url}: ${response.statusText}`);
    }

    return response.json();
  },
  
  // Tambahkan fungsi post, put, delete sesuai kebutuhan nanti
};
