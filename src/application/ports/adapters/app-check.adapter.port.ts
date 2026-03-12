// === Queries ===
export type AppCheckVerifyTokenQuery = { token: string };

// === Abstract Port ===
export interface AppCheckAdapter {
  verifyToken(query: AppCheckVerifyTokenQuery): Promise<void>;
}
