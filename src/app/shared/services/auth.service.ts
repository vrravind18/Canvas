import { Injectable, NgZone } from '@angular/core';
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from '../services/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    // Inject services
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    private afStorage: AngularFireStorage,
    public router: Router,
    public ngZone: NgZone
  ) {}

  // Login with Google
  async googleLogin() {
    return this.afAuth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['canvas']);
        });
        this.setUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Login with email and password
  async login(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['canvas']);
        });
        this.setUserData(result.user);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Sign up user with email and password
  async signup(email: string, password: string, confirmPassword: string) {
    // Password Validation
    if (confirmPassword != password) {
      window.alert("Passwords don't match!");
      return;
    }
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['canvas']);
        });
        this.setUserData(result.user);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Logout
  async logout() {
    return this.afAuth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }

  // Login check
  get isLoggedIn(): boolean {
    var user = firebase.auth().currentUser;
    return user !== null;
  }

  // Set user data
  async setUserData(user: firebase.User) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Retrieve User Data
  get getUserData() {
    var user = firebase.auth().currentUser;
    return new Promise((resolve, reject) =>
      this.afs
        .collection('users')
        .doc(user.uid)
        .ref.get()
        .then((doc) => {
          if (doc.exists) {
            resolve(doc.data());
          }
          resolve({});
        })
        .catch((error) => {
          reject(error);
        })
    );
  }
}
