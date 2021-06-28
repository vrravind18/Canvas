import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadCanvasDialogComponent } from './load-canvas-dialog.component';

describe('LoadCanvasDialogComponent', () => {
  let component: LoadCanvasDialogComponent;
  let fixture: ComponentFixture<LoadCanvasDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadCanvasDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadCanvasDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
