import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getAppCheck } from "firebase-admin/app-check";

import { ENV } from "./env.config";

const privateKey = ENV.FIREBASE_ADMIN_SECRET;

const app =
  getApps().length > 0
    ? getApp()
    : initializeApp({
        credential: cert({
          projectId: "shackw-wallet",
          clientEmail: "firebase-adminsdk-fbsvc@shackw-wallet.iam.gserviceaccount.com",
          privateKey
        })
      });

export const firebaseApp = app;
export const firebaseAppCheck = getAppCheck(app);
