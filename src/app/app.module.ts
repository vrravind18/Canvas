import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Import Firebase services
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFireStorageModule } from '@angular/fire/storage';

// Import components
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { DialogBodyComponent } from './components/dialog-body/dialog-body.component';
import { LoadCanvasDialogComponent } from './components/load-canvas-dialog/load-canvas-dialog.component';

// Import Material Modules
import { MaterialModule } from './material.module';

// Import Color Picker
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    CanvasComponent,
    DialogBodyComponent,
    LoadCanvasDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireAuthGuardModule,
    AngularFireStorageModule,
    MaterialModule,
    ColorPickerModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
