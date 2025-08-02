export class TestService {
  constructor() {}

  async get() {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const result = "I am Test";
    return result;
  }
}
