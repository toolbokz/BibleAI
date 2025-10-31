// src/services/auth/authService.ts

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { User } from '../../types';

class AuthService {
    async signUp(email: string, password: string, name: string): Promise<User> {
        try {
            const userCredential = await auth().createUserWithEmailAndPassword(
                email,
                password
            );

            await userCredential.user.updateProfile({ displayName: name });

            const user: User = {
                id: userCredential.user.uid,
                email,
                name,
                language: 'en',
                preferredBibleVersion: 'de4e12af7f28f599-02',
                isPremium: false,
                createdAt: new Date()
            };

            await firestore().collection('users').doc(user.id).set(user);

            return user;
        } catch (error: any) {
            console.error('Sign Up Error:', error);
            throw this.handleAuthError(error);
        }
    }

    async signIn(email: string, password: string): Promise<User> {
        try {
            const userCredential = await auth().signInWithEmailAndPassword(
                email,
                password
            );

            return await this.getUserData(userCredential.user.uid);
        } catch (error: any) {
            console.error('Sign In Error:', error);
            throw this.handleAuthError(error);
        }
    }

    async signInAnonymously(): Promise<User> {
        try {
            const userCredential = await auth().signInAnonymously();
            const user: User = {
                id: userCredential.user.uid,
                email: 'guest@email.com',
                name: 'Guest',
                language: 'en',
                preferredBibleVersion: 'de4e12af7f28f599-02',
                isPremium: false,
                createdAt: new Date()
            };

            await firestore().collection('users').doc(user.id).set(user);
            return user;
        } catch (error: any) {
            console.error('Anonymous Sign In Error:', error);
            throw new Error('Failed to sign in anonymously');
        }
    }

    async signOut(): Promise<void> {
        try {
            await auth().signOut();
        } catch (error) {
            console.error('Sign Out Error:', error);
            throw new Error('Failed to sign out');
        }
    }

    async resetPassword(email: string): Promise<void> {
        try {
            await auth().sendPasswordResetEmail(email);
        } catch (error: any) {
            console.error('Reset Password Error:', error);
            throw this.handleAuthError(error);
        }
    }

    async updateProfile(userId: string, updates: Partial<User>): Promise<void> {
        try {
            await firestore().collection('users').doc(userId).update(updates);

            if (updates.name) {
                await auth().currentUser?.updateProfile({ displayName: updates.name });
            }
        } catch (error) {
            console.error('Update Profile Error:', error);
            throw new Error('Failed to update profile');
        }
    }

    async getUserData(userId: string): Promise<User> {
        try {
            const doc = await firestore().collection('users').doc(userId).get();

            if (!doc.exists) {
                throw new Error('User data not found');
            }

            const data = doc.data();
            return {
                id: userId,
                email: data?.email || '',
                name: data?.name || '',
                language: data?.language || 'en',
                preferredBibleVersion: data?.preferredBibleVersion || 'de4e12af7f28f599-02',
                isPremium: data?.isPremium || false,
                createdAt: data?.createdAt?.toDate() || new Date()
            };
        } catch (error) {
            console.error('Get User Data Error:', error);
            throw new Error('Failed to get user data');
        }
    }

    getCurrentUser(): FirebaseAuthTypes.User | null {
        return auth().currentUser;
    }

    onAuthStateChanged(
        callback: (user: FirebaseAuthTypes.User | null) => void
    ): () => void {
        return auth().onAuthStateChanged(callback);
    }

    private handleAuthError(error: any): Error {
        switch (error.code) {
            case 'auth/email-already-in-use':
                return new Error('This email is already registered');
            case 'auth/invalid-email':
                return new Error('Invalid email address');
            case 'auth/weak-password':
                return new Error('Password should be at least 6 characters');
            case 'auth/user-not-found':
                return new Error('No account found with this email');
            case 'auth/wrong-password':
                return new Error('Incorrect password');
            case 'auth/too-many-requests':
                return new Error('Too many attempts. Please try again later');
            case 'auth/network-request-failed':
                return new Error('Network error. Please check your connection');
            default:
                return new Error('Authentication failed. Please try again');
        }
    }

    async deleteAccount(userId: string): Promise<void> {
        try {
            await firestore().collection('users').doc(userId).delete();
            await auth().currentUser?.delete();
        } catch (error) {
            console.error('Delete Account Error:', error);
            throw new Error('Failed to delete account');
        }
    }
}

export default new AuthService();