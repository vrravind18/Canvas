import { Injectable, NgZone } from '@angular/core';
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  public url= '';
  constructor(
    // Inject services
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    private afStorage: AngularFireStorage,
    public router: Router,
    public ngZone: NgZone
  ) {}

  // Set canvas
  async setCanvas(canvas: any) {
    var user = firebase.auth().currentUser;
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    return userRef.update({ canvas });
  }

  // Upload image to Firebase with helper function for storage URL location
  async uploadImage(event: { target: { files: any[]; }; }) {
    var user = firebase.auth().currentUser;
    const randomId = Math.random().toString(36).substring(2); // Generate random ID
    const filePath = `users/${user.uid}/images/${randomId}`
    const snap = await this.afStorage.upload(filePath, event.target.files[0])
    this.afStorage.ref(filePath);
    return this.getUrl(snap)
  }

  private async getUrl(snap: firebase.storage.UploadTaskSnapshot) {
    const url = await snap.ref.getDownloadURL();
    this.url = url;  //store the URL
    return this.url 
  }

  // Share canvas
  async shareCanvas(email: string, canvas: any) {
    var user = firebase.auth().currentUser;
    var success = this.afs
      .collection('users')
      .ref.where('email', '==', email)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          return false;
        }
        if (querySnapshot.size == 1) {
          querySnapshot.forEach((documentSnapshot) => {
            const otherUser = this.afs.doc(documentSnapshot.ref);
            otherUser
              .collection('sharedCanvases')
              .add({ user: user.email, canvas });
          });
          return true;
        }
        return false;
      });
    return success;
  }

  // Retrieve shared canvases
  get getSharedCanvases() {
    var user = firebase.auth().currentUser;
    return new Promise((resolve, reject) =>
      this.afs
        .collection('users')
        .doc(user.uid)
        .collection('sharedCanvases')
        .get()
        .toPromise()
        .then((querySnapshot) => {
          let sharedCanvases: any = [];
          querySnapshot.forEach((doc) => {
            sharedCanvases.push(doc.data());
          });
          resolve(sharedCanvases);
        })
        .catch((error) => {
          reject(error);
        })
    );
  }
}
