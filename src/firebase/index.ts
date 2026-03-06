'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore'

// Singleton cache for services
let firestoreInstance: Firestore | null = null;
let authInstance: Auth | null = null;

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (typeof window === 'undefined') {
    let app: FirebaseApp;
    if (getApps().length) {
      app = getApp();
    } else {
      if (firebaseConfig.apiKey) {
        app = initializeApp(firebaseConfig);
      } else {
        return {
          firebaseApp: null as any,
          auth: null as any,
          firestore: null as any
        };
      }
    }
    return getSdks(app);
  }

  if (!getApps().length) {
    let firebaseApp;
    try {
      firebaseApp = initializeApp(firebaseConfig);
    } catch (e) {
      firebaseApp = initializeApp(firebaseConfig);
    }
    return getSdks(firebaseApp);
  }

  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  if (!firebaseApp) return { firebaseApp: null as any, auth: null as any, firestore: null as any };
  
  // Ensure singletons for services to prevent internal Firestore sync errors
  if (!authInstance) authInstance = getAuth(firebaseApp);
  if (!firestoreInstance) firestoreInstance = getFirestore(firebaseApp);

  return {
    firebaseApp,
    auth: authInstance,
    firestore: firestoreInstance
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
