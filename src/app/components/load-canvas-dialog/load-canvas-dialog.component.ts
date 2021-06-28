import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { fabric } from 'fabric';

@Component({
  selector: 'app-load-canvas-dialog',
  templateUrl: './load-canvas-dialog.component.html',
  styleUrls: ['./load-canvas-dialog.component.css']
})

export class LoadCanvasDialogComponent implements OnInit {
  // Values received from CanvasComponent
  public message: string;
  public loading: boolean;
  public canvas: any;
  public sharedCanvases: any;
  public sharedIndex: number;
  public confirmButtonText: string;
  public cancelButtonText: string;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
  private dialogRef: MatDialogRef<LoadCanvasDialogComponent>) { 
    if(data){
      // Pass values to canvas dialog
      this.message = data.message;
      this.loading = data.loading;
      this.canvas = data.canvas;
      this.sharedCanvases = data.sharedCanvases;
      this.sharedIndex = data.sharedIndex;
      if (data.buttonText.ok) {
        this.confirmButtonText = data.buttonText.ok;
      }
      if (data.buttonText.cancel) {
        this.cancelButtonText = data.buttonText.cancel;
      }
    }
  }

   // Set index for the selected shared canvas
  setSharedIndex(index: number) {
    this.sharedIndex = index;
  }

  // Load the selected shared canvas
  loadSharedCanvas() {
    this.loadCanvas(this.sharedCanvases[this.sharedIndex].canvas);
  } 

  // Load a canvas from SVG
  loadCanvas(canvas: string) {
    this.loading = true;
    // Clear and reset canvas
    this.canvas.clear();
    this.canvas.selection = true;
    this.canvas.preserveObjectStacking = true;
    this.canvas.backgroundColor = '#efefef';
    fabric.loadSVGFromString(canvas, (objects, options) => {
      var obj = fabric.util.groupSVGElements(objects, options)
      this.canvas.add(obj).requestRenderAll();
    });
    this.loading = false;
    // after close dialog box
    this.dialogRef.close(true);
  }

  ngOnInit(): void {
  }

}
