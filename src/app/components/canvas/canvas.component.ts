import { Component, OnInit, Inject, ViewChild, HostListener,} from '@angular/core';
import { fabric } from 'fabric';
import { AuthService } from '../../shared/services/auth.service';
import { CanvasService } from '../../shared/services/canvas.service';
import { NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogBodyComponent } from '../dialog-body/dialog-body.component';
import { LoadCanvasDialogComponent } from '../load-canvas-dialog/load-canvas-dialog.component';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})

export class CanvasComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public canvasService: CanvasService,
    public ngZone: NgZone,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(DOCUMENT) public document: Document
  ) {}

  @ViewChild('email') emailInput: { nativeElement: { value: string; }; }; 
  public loggedIn = this.authService.isLoggedIn; 
  public user: any; 
  private canvas: any;
  public color: string = '#FFD740'; // defualt stroke color
  public loading: boolean = true; // loading indicator
  public mode: number = 1; // canvas mode 1 -> draw, 0 -> select
  public sharedCanvases: any; 
  public sharedIndex = -1; // shared canvas index -> -1 default with no selections
  public width: number; 
  public height: number = 700; 

  openDeleteDialog(){
    const dialogRef = this.dialog.open(DialogBodyComponent,{
      data:{
        message: 'Are you sure want to clear this?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.canvas.remove(...this.canvas.getObjects());
        this.canvas.selection = true;
        this.canvas.preserveObjectStacking = true;
        this.canvas.backgroundColor = '#efefef';
        const a = document.createElement('a');
        a.click();
        a.remove();
        this.snackBar.open('Cleared your Canvas', 'Close', {
          duration: 2000,
        });
      }
    });
  }

  openLoadCanvasDialog() {
    this.sharedIndex = -1;
    if (this.sharedCanvases.length == 0 || this.sharedCanvases == undefined) {
      const a = document.createElement('a');
          a.click();
          a.remove();
          this.snackBar.open('You currently have no shared canvases', 'Close', {
            duration: 4500,
          });
    } else {
      const dialogRef = this.dialog.open(LoadCanvasDialogComponent,{
        data:{
          message: 'Load your shared canvas:',
          loading: this.loading,
          canvas: this.canvas,
          sharedCanvases: this.sharedCanvases,
          sharedIndex: this.sharedIndex,
          buttonText: {
            ok: 'Load',
            cancel: 'Cancel'
          }
        }
      });

      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          const a = document.createElement('a');
          a.click();
          a.remove();
          this.snackBar.open('Successfully loaded your shared Canvas!', 'Close', {
            duration: 2000,
          });
        }
      });
    }
  }

  // Change the stroke color
  public changeColor(newColor: string) {
    this.canvas.freeDrawingBrush.color = newColor;
  }

  // Start the loading indicator
  public startLoading() {
    this.loading = true;
  }

  // Stop the loading indicator
  public stopLoading() {
    this.loading = false;
  }

  // Change the drawing mode
  public setMode(newMode: number) {
    this.mode = newMode;
    this.canvas.isDrawingMode = this.mode;
  }

  // Upload an image to Firebase and display on the canvas
  async uploadImage(event: any) {
    const imageURL = await this.canvasService.uploadImage(event);
    fabric.Image.fromURL(imageURL, (myImg) => {
      this.canvas.add(myImg).renderAll();
    });
  }

  // Share canvas with another user by email
  async shareCanvas(email: string) {
    this.startLoading();
    const success = await this.canvasService.shareCanvas(
      email,
      this.canvas.toSVG()
    );
    if (success) {
      alert('Successfully shared canvas with ' + email + '!');
      this.stopLoading();
    } else {
      alert('Please try again with a valid email address');
      this.stopLoading();
    }
  }

  // Load a canvas from SVG
  public loadCanvas(canvas: string) {
    this.startLoading();
    // Clear and reset canvas
    this.canvas.clear();
    this.canvas.selection = true;
    this.canvas.preserveObjectStacking = true;
    this.canvas.backgroundColor = '#efefef';
    fabric.loadSVGFromString(canvas, (objects) => {
      objects.map((obj) => {
        this.canvas.add(obj).renderAll();
      });
    });
    this.stopLoading();
  }

  // Set the selected shared canvas
  public setSharedIndex(index: number) {
    this.sharedIndex = index;
  }

  // Load the selected shared canvas
  public loadSharedCanvas() {
    this.loadCanvas(this.sharedCanvases[this.sharedIndex].canvas);
  }

  // Listen for window resize
  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: number; innerHeight: number}; }) {
    // Make canvas responsive
    this.width = event.target.innerWidth;
    if (this.width < 1024) {
      this.canvas.setWidth(this.width - 30);
    } else {
      this.canvas.setWidth(this.width - 120 > 1400 ? 1400 : this.width - 120);
    }
    if (this.height < 600) {
      this.canvas.setHeight(this.height - 20);
    } else {
      this.canvas.setHeight(this.height - 10 > 800 ? 790: this.height - 15);
    }
  }

  async ngOnInit() {
    // Set window width
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    // Get the user's data
    await this.authService.getUserData.then((res) => (this.user = res));
    // Get the user's shared canvases
    await this.canvasService.getSharedCanvases.then((res) => {
      this.sharedCanvases = res;
    });
    this.stopLoading();

    // Canvas setup
    this.canvas = new fabric.Canvas('canvas', {
      selection: true,
      preserveObjectStacking: true,
      backgroundColor: '#efefef',
    });

    // Set the canvas' dimensions
    if (this.width < 1024) {
      this.canvas.setWidth(this.width - 30);
    } else {
      this.canvas.setWidth(this.width - 120 > 1400 ? 1400 : this.width - 120);
    }
    if (this.height < 600) {
      this.canvas.setHeight(this.height - 20);
    } else {
      this.canvas.setHeight(this.height - 10 > 800 ? 790: this.height - 15);
    }

    this.canvas.isDrawingMode = this.mode;
    this.canvas.freeDrawingBrush.color = this.color;
    this.canvas.freeDrawingBrush.width = 5;
    this.canvas.renderAll();

    // If the user has a saved canvas
    if ('canvas' in this.user) {
      this.loadCanvas(this.user.canvas);
    }

    // Listen for events and auto-save
    this.canvas.on('object:added', async () => {
      this.startLoading();
      await this.canvasService.setCanvas(this.canvas.toSVG()); // Store serialized canvas
      this.stopLoading();
    });

    this.canvas.on('object:removed', async () => {
      this.startLoading();
      await this.canvasService.setCanvas(this.canvas.toSVG()); // Store serialized canvas
      this.stopLoading();
    });

    this.canvas.on('object:moving', async () => {
      this.startLoading();
      await this.canvasService.setCanvas(this.canvas.toSVG()); // Store serialized canvas
      this.stopLoading();
    });

    this.canvas.on('object:scaling', async () => {
      this.startLoading();
      await this.canvasService.setCanvas(this.canvas.toSVG()); // Store serialized canvas
      this.stopLoading();
    });
  }
}
