"use server";

import { db } from '@/config/firebaseAdmin'; // Usa l'SDK Admin lato server
import { collection, addDoc, serverTimestamp } from 'firebase-admin/firestore';

interface LocationData {
  objectId: string;
  latitude: number;
  longitude: number;
  userAgent?: string;
}

export async function logLocationData(
  data: LocationData
): Promise<{ success: boolean; message: string; docId?: string }> {
  if (!data.objectId || typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
    return { success: false, message: "Invalid data provided." };
  }

  try {
    const docRef = await addDoc(collection(db, 'locations'), {
      objectId: data.objectId,
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: serverTimestamp(),
      userAgent: data.userAgent || 'N/A',
    });

    return {
      success: true,
      message: "Location logged successfully.",
      docId: docRef.id,
    };
  } catch (error) {
    console.error("Error writing document to Firestore:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      success: false,
      message: `Failed to log location: ${errorMessage}`,
    };
  }
}
