import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export interface FirebaseStatus {
  isConnected: boolean;
  authEnabled: boolean;
  firestoreEnabled: boolean;
  error?: string;
}

export const checkFirebaseStatus = async (): Promise<FirebaseStatus> => {
  const status: FirebaseStatus = {
    isConnected: false,
    authEnabled: false,
    firestoreEnabled: false,
  };

  try {
    // Check if Firebase app is initialized
    const app = auth().app;
    if (app) {
      status.isConnected = true;
    }

    // Test authentication
    try {
      // Try to get current user (this will work even if no user is signed in)
      auth().currentUser;
      status.authEnabled = true;
    } catch (authError) {
      console.log('Auth not available:', authError);
      status.error = 'Authentication not properly configured';
    }

    // Test Firestore connection
    try {
      // Try to access Firestore (this will fail if not configured)
      const testRef = firestore().collection('test');
      if (testRef) {
        status.firestoreEnabled = true;
      }
    } catch (firestoreError) {
      console.log('Firestore not available:', firestoreError);
      if (!status.error) {
        status.error = 'Firestore not properly configured';
      }
    }

  } catch (error: any) {
    console.log('Firebase initialization error:', error);
    status.error = error.message || 'Firebase not properly initialized';
  }

  return status;
};

export const getFirebaseErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'auth/operation-not-allowed':
      return 'Email/password authentication is not enabled in Firebase Console. Please enable it and try again.';
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please try logging in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up first.';
    case 'auth/wrong-password':
      return 'Invalid password. Please try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    default:
      return 'An error occurred. Please try again.';
  }
};

