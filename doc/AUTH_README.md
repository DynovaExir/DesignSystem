# Dynova Authentication System

A complete frontend authentication system built with React, TypeScript, Vite, and Tailwind CSS. Features PKCE-based OIDC authentication, session management, multi-tab coordination, and full RTL support (Persian/English).

## Features

- **PKCE Authentication Flow**: Secure OAuth 2.0 with PKCE code challenge
- **In-Memory Token Storage**: Access tokens never stored in browser storage
- **Silent Token Refresh**: Automatic session restoration from cookies
- **Multi-Tab Coordination**: BroadcastChannel API for cross-tab sync
- **Session Timeout Banner**: Non-blocking warning with countdown
- **Session Expired Modal**: Blocking modal with focus trap
- **i18n Support**: Persian (RTL) and English (LTR) with Persian numerals
- **Accessible**: ARIA labels, focus management, keyboard navigation

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Project Structure

```
src/
├── components/         # React components
│   ├── ui/            # Base UI components (Button, Card, etc.)
│   ├── auth-provider.tsx
│   ├── header.tsx
│   ├── language-switcher.tsx
│   ├── protected-route.tsx
│   ├── session-expired-modal.tsx
│   └── session-timeout-banner.tsx
├── hooks/             # Custom React hooks
│   ├── use-auth.ts
│   ├── use-auto-refresh.ts
│   ├── use-broadcast-auth-sync.ts
│   └── use-timeout-banner.ts
├── locales/           # i18n translations
│   ├── en.ts
│   ├── fa.ts
│   └── i18n-provider.tsx
├── pages/             # Page components
│   ├── callback.tsx
│   ├── dashboard.tsx
│   └── login.tsx
├── services/          # API and utilities
│   ├── api.ts         # Mock API endpoints
│   ├── pkce.ts        # PKCE utilities
│   └── types.ts
├── stores/            # Zustand stores
│   └── auth-store.ts
└── lib/
    └── utils.ts       # Utility functions
```

## Testing Mock Flows

### Normal Login Flow
1. Visit `/login`
2. Click "Sign in with Keycloak"
3. Redirected to `/auth/callback` with mock code
4. Token exchanged, redirected to dashboard

### Session Expiry Simulation
Add `?simulateExpired=true` to any page URL to trigger 401 responses:
```
http://localhost:5173/?simulateExpired=true
```

### Language Switching
Click the globe icon in the header or login page to toggle between English and Persian (فارسی).

## Architecture Notes

### Token Storage
- Access tokens are stored **only in memory** (Zustand store)
- On page reload, the store is reset
- Session restoration uses `POST /api/v1/auth/refresh` with HttpOnly cookie

### Multi-Tab Coordination
Uses `BroadcastChannel` with channel name `dynova_auth`:
- `token-refreshed`: Notifies other tabs to sync tokens
- `session-expired`: Triggers expired modal in all tabs

### Auto-Refresh
Tokens are refreshed 60 seconds before expiry. Single-flight pattern prevents duplicate refreshes.

## Mock API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/.well-known/config` | GET | OIDC configuration |
| `/api/v1/auth/token` | POST | Exchange code for tokens |
| `/api/v1/auth/refresh` | POST | Refresh access token |
| `/api/v1/auth/logout` | POST | Invalidate session |
| `/api/v1/me` | GET | Get current user info |
