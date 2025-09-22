// Centralized API client with automatic authentication
class AuthenticatedApiClient {
  private baseUrl = 'http://localhost:3000';

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('kinde_token');
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    return response;
  }

  // Generic methods for all API calls
  async get(endpoint: string): Promise<any> {
    const response = await this.request(endpoint, { method: 'GET' });
    return response.json();
  }

  async post(endpoint: string, data?: any): Promise<any> {
    const response = await this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.json();
  }

  async put(endpoint: string, data?: any): Promise<any> {
    const response = await this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.json();
  }

  async delete(endpoint: string): Promise<any> {
    const response = await this.request(endpoint, { method: 'DELETE' });
    return response.json();
  }

  // Specific API methods
  async getExpenses() {
    return this.get('/api/expenses');
  }

  async getExpensesTotal() {
    return this.get('/api/expenses/total');
  }

  async createExpense(expense: any) {
    return this.post('/api/expenses', expense);
  }

  async updateExpense(id: number, expense: any) {
    return this.put(`/api/expenses/${id}`, expense);
  }

  async deleteExpense(id: number) {
    return this.delete(`/api/expenses/${id}`);
  }

  async getExpense(id: number) {
    return this.get(`/api/expenses/${id}`);
  }
}

// Export a singleton instance
export const api = new AuthenticatedApiClient();
