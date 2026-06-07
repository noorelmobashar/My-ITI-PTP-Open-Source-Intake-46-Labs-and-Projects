import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IStudent } from '../models/istudent';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-view',
  imports: [CommonModule],
  templateUrl: './student-view.html',
  styleUrl: './student-view.css',
})
export class StudentView {
  @Input() student!: IStudent;
  @Output() close = new EventEmitter<void>();

  dismiss() {
    this.close.emit();
  }
}
