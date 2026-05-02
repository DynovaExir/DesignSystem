interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  traceId: string;
  errors?: Record<string, string[]>;
}

interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  status: number;
}

class ApiClient {
  private baseUrl = '/api';
  private cooldownMap = new Map<string, number>();

  async checkUniqueness(field: string, value: string, context?: string): Promise<boolean> {
    const cacheKey = `${field}:${value}:${context || ''}`;
    const cooldownUntil = this.cooldownMap.get(cacheKey);
    
    if (cooldownUntil && Date.now() < cooldownUntil) {
      throw new Error('COOLDOWN');
    }

    try {
      const response = await fetch(`${this.baseUrl}/uniqueness/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, value, context }),
      });

      if (response.status === 429) {
        this.cooldownMap.set(cacheKey, Date.now() + 10000);
        throw new Error('COOLDOWN');
      }

      const data = await response.json();
      return data.available === true;
    } catch (error) {
      if (error instanceof Error && error.message === 'COOLDOWN') {
        throw error;
      }
      throw new Error('Network error');
    }
  }

  async createTenant(payload: {
    tenant_name: string;
    tenant_type: string;
    address: string;
    phone: string;
    email: string;
    branding?: {
      logo?: Blob;
      favicon?: Blob;
    };
  }): Promise<{ id: string; created_at: string }> {
    const formData = new FormData();
    formData.append('tenant_name', payload.tenant_name);
    formData.append('tenant_type', payload.tenant_type);
    formData.append('address', payload.address);
    formData.append('phone', payload.phone);
    formData.append('email', payload.email);

    if (payload.branding?.logo) {
      formData.append('logo', payload.branding.logo);
    }
    if (payload.branding?.favicon) {
      formData.append('favicon', payload.branding.favicon);
    }

    const response = await fetch(`${this.baseUrl}/tenants/create`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as ApiError;
      const err = new Error(error.detail || 'Failed to create tenant');
      (err as any).status = response.status;
      (err as any).errors = error.errors;
      throw err;
    }

    return data;
  }

  async getTenants(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/tenants/list`);
    const data = await response.json();
    return data.tenants || [];
  }
}

export const apiClient = new ApiClient();
