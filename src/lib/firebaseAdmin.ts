import admin from "firebase-admin";

if (!admin.apps.length) {
  // Parse the JSON string stored in environment variable
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK || "{}");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const adminDb = admin.firestore();

export { adminDb };