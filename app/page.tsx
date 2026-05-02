'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { LocaleToggle } from '@/components/locale-toggle';

interface Tenant {
  id: string;
  tenant_name: string;
  tenant_type: string;
  created_at: string;
}

export default function HomePage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await fetch('/api/tenants/list');
        const data = await response.json();
        setTenants(data.tenants || []);
      } catch (error) {
        console.error('Failed to fetch tenants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  return (
    <AppShell
      header={
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dynova</h1>
            <p className="text-sm text-muted-foreground">Tenant Management</p>
          </div>
          <LocaleToggle />
        </div>
      }
    >
      <div className="grid gap-8">
        {/* Hero Section */}
        <div className="border border-border rounded-lg p-8 bg-gradient-to-br from-primary/10 to-accent/10">
          <h2 className="text-3xl font-bold text-foreground mb-3">Welcome to Dynova</h2>
          <p className="text-muted-foreground mb-6 max-w-xl">
            Manage your organization&apos;s tenants with ease. Create new tenants, configure branding, and manage contacts all in one place.
          </p>
          <Link href="/wizard" className="btn btn-primary">
            Create New Tenant
          </Link>
        </div>

        {/* Tenants List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Existing Tenants</h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 rounded-full border-2 border-border border-t-primary animate-spin" />
            </div>
          ) : tenants.length === 0 ? (
            <div className="text-center py-8 border border-border rounded-lg">
              <p className="text-muted-foreground">No tenants yet</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {tenants.map((tenant) => (
                <div
                  key={tenant.id}
                  className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{tenant.tenant_name}</h4>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="capitalize">Type: {tenant.tenant_type}</span>
                        <span>ID: {tenant.id}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Created: {new Date(tenant.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
