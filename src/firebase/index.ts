'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (typeof window === 'undefined') {
    // During SSR/Build, we return a safe structure but avoid calling initializeApp() 
    // without arguments if we can't guarantee App Hosting environment variables are set.
    // This prevents the 'app/no-options' crash.
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    return getSdks(app);
  }

  if (!getApps().length) {
    let firebaseApp;
    try {
      // Attempt automatic initialization (preferred for Firebase App Hosting)
      firebaseApp = initializeApp();
    } catch (e) {
      // Fallback to hardcoded config for development or other environments
      firebaseApp = initializeApp(firebaseConfig);
    }
    return getSdks(firebaseApp);
  }

  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
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
