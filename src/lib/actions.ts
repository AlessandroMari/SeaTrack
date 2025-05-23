"use server";

import { adminDb } from '@/lib/firebaseAdmin'; // importa la connessione admin
import * as admin from 'firebase-admin'; // per usare FieldValue

interface LocationData {
  objectId: string;
  latitude: number;
  longitude: number;
  userAgent?: string;
}

export async function logLocationData(data: LocationData): Promise<{ success: boolean; message: string; docId?: string }> {
  if (!data.objectId || typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
    return { success: false, message: "Invalid data provided." };
  }

  try {
    console.log("Attempting to add document to Firestore with Admin SDK...");
    const docRef = await adminDb.collection('locations').add({
      objectId: data.objectId,
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      userAgent: data.userAgent || 'N/A',
    });
    console.log("Document successfully added to Firestore with ID:", docRef.id);
    return { success: true, message: "Location logged successfully.", docId: docRef.id };
  } catch (error) {
    console.error("Error writing document to Firestore: ", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to log location: ${errorMessage}` };
  }
}
