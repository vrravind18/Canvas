import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../auth.service";
import { fabric } from 'fabric';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  canvas: any;

  constructor(public AuthService: AuthService) { }

  ngOnInit(): void {
    this.canvas = new fabric.Canvas('canvas', {
      width: 500,
      height: 300,
      isDrawingMode: false
    });
 
    this.canvas.add(new fabric.Path()); //must set isDrawingMode to true here else false

    this.canvas.add(new fabric.Circle({
      left: 200,
      top: 100,
      radius: 25,
      fill: '#afa'
    }));

    this.canvas.add(new fabric.Triangle({
      left: 300,
      top: 100,
      width: 50,
      height: 50,
      fill: '#aaf'
    }));
  }

}
