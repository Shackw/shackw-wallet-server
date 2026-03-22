export const makeMockClient = <T extends object>(overrides?: Partial<T>) =>
  ({
    ...overrides
  }) as unknown as T;
