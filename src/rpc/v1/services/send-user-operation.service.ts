export class SendUserOperationService {
  constructor() {}

  async send() {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const result = { status: "ok" };
    return result;
  }
}
