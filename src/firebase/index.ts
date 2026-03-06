'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore'

// Singleton cache for services to prevent internal Firestore sync errors (Unexpected state ID: ca9)
let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
let cachedFirestore: Firestore | null = null;

/**
 * Initializes and returns singleton instances of Firebase services.
 * This pattern ensures that only one connection is active, preventing
 * synchronization issues during Next.js hydration.
 */
export function initializeFirebase() {
  if (typeof window === 'undefined') {
    // Minimal initialization for server-side environments (SSR/Prerendering)
    const existingApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return {
      firebaseApp: existingApp,
      auth: getAuth(existingApp),
      firestore: getFirestore(existingApp)
    };
  }

  // Client-side singleton pattern: Ensure only one instance of the SDK services exists per session.
  if (!cachedApp) {
    const apps = getApps();
    cachedApp = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
  }

  if (!cachedAuth) cachedAuth = getAuth(cachedApp);
  if (!cachedFirestore) cachedFirestore = getFirestore(cachedApp);

  return {
    firebaseApp: cachedApp,
    auth: cachedAuth,
    firestore: cachedFirestore,
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
