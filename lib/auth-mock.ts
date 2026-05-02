/**
 * Mock authentication API
 * All functions return Promises with simulated latency
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Session {
  user: User;
  expiresAt: number;
}

const MOCK_USER: User = {
  id: "user-1",
  name: "کاربر آزمایشی",
  email: "test@dynova.ir",
  avatar: "/placeholder-user.jpg",
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Initiates login flow - redirects to Keycloak (mocked)
 */
export async function startLogin(): Promise<void> {
  await delay(800);
  // In a real app, this would redirect to Keycloak
  // For the mock, we'll navigate to the callback page
}

/**
 * Exchanges authorization code for session (mocked)
 */
export async function exchangeCode(
  _code: string
): Promise<{ success: boolean; error?: string }> {
  await delay(1000);

  // Mock success case
  return { success: true };
}

/**
 * Gets the current session (mocked)
 */
export async function getSession(): Promise<Session | null> {
  await delay(200);

  // Return mock session
  return {
    user: MOCK_USER,
    expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes from now
  };
}

/**
 * Refreshes the session (mocked)
 */
export async function refresh(): Promise<Session | null> {
  await delay(300);

  // Return refreshed session
  return {
    user: MOCK_USER,
    expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes from now
  };
}

/**
 * Logs out the user (mocked)
 */
export async function logout(): Promise<void> {
  await delay(500);
  // In a real app, this would clear the session and redirect
}
