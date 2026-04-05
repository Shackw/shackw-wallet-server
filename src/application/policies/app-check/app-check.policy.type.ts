// === Abstract ===
export abstract class AppCheckPolicy {
  abstract verify(input: VerifyAppCheckTokenInput): Promise<void>;
}

// === Input ===
export type VerifyAppCheckTokenInput = {
  token: string;
};
