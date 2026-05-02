import { sleep, generateCorrelationId } from './utils';

interface MockTenant {
  id: string;
  tenant_name: string;
  tenant_type: string;
  created_at: string;
}

const mockTenants: MockTenant[] = [
  {
    id: 'tenant-001',
    tenant_name: 'Acme Corporation',
    tenant_type: 'enterprise',
    created_at: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'tenant-002',
    tenant_name: 'StartupXYZ',
    tenant_type: 'startup',
    created_at: new Date('2024-02-20').toISOString(),
  },
  {
    id: 'tenant-003',
    tenant_name: 'Global Relief Fund',
    tenant_type: 'nonprofit',
    created_at: new Date('2024-03-10').toISOString(),
  },
];

export async function interceptApiCall(
  pathname: string,
  method: string = 'GET',
  body?: any
): Promise<Response> {
  // Simulate network latency
  const latency = 150 + Math.random() * 250;
  await sleep(latency);

  // GET /api/uniqueness/check
  if (pathname === '/api/uniqueness/check' && method === 'POST') {
    const { field, value, context } = body;

    // Simulate 5% chance of rate limit
    if (Math.random() < 0.05) {
      return new Response(
        JSON.stringify({
          type: 'https://api.dynova.io/errors/rate-limited',
          title: 'Too Many Requests',
          status: 429,
          detail: 'Rate limit exceeded. Please wait before trying again.',
          traceId: generateCorrelationId(),
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check uniqueness for tenant_name
    if (field === 'tenant_name') {
      const isTaken = mockTenants.some((t) => t.tenant_name.toLowerCase() === value.toLowerCase());
      return new Response(
        JSON.stringify({
          field,
          value,
          available: !isTaken,
          traceId: generateCorrelationId(),
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        field,
        value,
        available: true,
        traceId: generateCorrelationId(),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // POST /api/tenants/create
  if (pathname === '/api/tenants/create' && method === 'POST') {
    const tenant_name = body.get('tenant_name');
    const tenant_type = body.get('tenant_type');
    const email = body.get('email');

    // Validate required fields
    const errors: Record<string, string[]> = {};
    if (!tenant_name) errors.tenant_name = ['Tenant name is required'];
    if (!tenant_type) errors.tenant_type = ['Tenant type is required'];
    if (!email) errors.email = ['Email is required'];

    if (Object.keys(errors).length > 0) {
      return new Response(
        JSON.stringify({
          type: 'https://api.dynova.io/errors/validation-failed',
          title: 'Validation Failed',
          status: 400,
          detail: 'One or more fields failed validation',
          traceId: generateCorrelationId(),
          errors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check for conflicts (tenant already exists)
    const exists = mockTenants.some((t) => t.tenant_name.toLowerCase() === tenant_name.toLowerCase());
    if (exists) {
      return new Response(
        JSON.stringify({
          type: 'https://api.dynova.io/errors/conflict',
          title: 'Conflict',
          status: 409,
          detail: `A tenant with the name "${tenant_name}" already exists`,
          traceId: generateCorrelationId(),
          errors: { tenant_name: ['This name is already taken'] },
        }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create new tenant
    const newTenant: MockTenant = {
      id: `tenant-${Date.now()}`,
      tenant_name,
      tenant_type,
      created_at: new Date().toISOString(),
    };

    mockTenants.push(newTenant);

    return new Response(
      JSON.stringify({
        id: newTenant.id,
        created_at: newTenant.created_at,
        traceId: generateCorrelationId(),
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // GET /api/tenants/list
  if (pathname === '/api/tenants/list' && method === 'GET') {
    return new Response(
      JSON.stringify({
        tenants: mockTenants,
        traceId: generateCorrelationId(),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({
      type: 'https://api.dynova.io/errors/not-found',
      title: 'Not Found',
      status: 404,
      detail: 'The requested endpoint was not found',
      traceId: generateCorrelationId(),
    }),
    { status: 404, headers: { 'Content-Type': 'application/json' } }
  );
}
