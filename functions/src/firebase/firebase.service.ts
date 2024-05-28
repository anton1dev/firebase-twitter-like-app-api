import 'firebase/compat/auth';
import * as admin from 'firebase-admin';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Injectable, Logger } from '@nestjs/common';
import { serviceAccountPath, firebaseConfig } from 'src/config/firebase.config';
import { log } from 'console';
import { FirebaseAdmin } from 'nestjs-firebase';

import { Auth, getAuth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);
  private readonly serviceApp: admin.app.App;
  private readonly firebaseApp: firebase.app.App;
  private readonly firebaseAdmin: FirebaseAdmin;
  private readonly firebaseAuth: Auth;

  constructor() {
    if (!admin.apps.length) {
      this.serviceApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      });
      this.logger.log('Firebase Admin initialized successfully!');
    } else {
      this.serviceApp = admin.apps[0];
    }

    if (!firebase.apps.length) {
      this.firebaseApp = firebase.initializeApp(firebaseConfig);
      this.logger.log('Firebase Client initialized successfully!');
    } else {
      this.firebaseApp = firebase.apps[0];
    }
    log(this.firebaseApp.options);

    this.firebaseAuth = getAuth(this.serviceApp);
  }

  private getAdminAuth() {
    return this.serviceApp.auth();
  }

  private getClientAuth() {
    return firebase.auth();
  }

  async loginUser(email: string, password: string) {
    const clientAuth = this.getClientAuth();
    const { user } = await clientAuth.signInWithEmailAndPassword(
      email,
      password,
    );

    return user;
  }

  async createUser(
    email: string,
    password: string,
  ): Promise<firebase.auth.UserCredential> {
    const clientAuth = this.getClientAuth();
    const user = await clientAuth.createUserWithEmailAndPassword(
      email,
      password,
    );

    return user;
  }

  async signUpWithGooglePopup(): Promise<firebase.auth.UserCredential> {
    const provider = new firebase.auth.GoogleAuthProvider();

    return firebase.auth().signInWithPopup(provider);
  }

  async resetPassword(emailAddress: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(emailAddress);
  }

  async updatePassword(userId: string, newPassword: string): Promise<string> {
    const currentUser = admin.auth().getUser(userId);

    await admin.auth().updateUser(userId, {
      password: newPassword,
      ...currentUser,
    });

    return `User's password for ${userId} updated`;
  }

  async logOutUser(): Promise<void> {
    return await this.getClientAuth().signOut();
  }

  async deleteUser(userId: string): Promise<void> {
    return await this.getAdminAuth().deleteUser(userId);
  }
}
