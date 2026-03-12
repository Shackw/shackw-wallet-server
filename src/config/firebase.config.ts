import { ENV } from "./env.config";

const privateKey = ENV.FIREBASE_ADMIN_SECRET;

export const FIREBASE_CREDENTIAL = {
  projectId: "shackw-wallet",
  clientEmail: "firebase-adminsdk-fbsvc@shackw-wallet.iam.gserviceaccount.com",
  privateKey
} as const;
