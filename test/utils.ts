export const makeMockObject = <T extends object>(overrides?: Partial<T>) =>
  ({
    ...overrides
  }) as unknown as T;
