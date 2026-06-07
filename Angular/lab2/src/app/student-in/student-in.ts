import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-in',
  imports: [FormsModule, CommonModule],
  templateUrl: './student-in.html',
  styleUrl: './student-in.css',
})
export class StudentIn {
  name: string = '';
  age: number | null = null;

  @Output() studentAdded = new EventEmitter<{ name: string; age: number }>();

  addStudent() {
    if (this.name.trim() && this.age !== null && this.age > 0) {
      this.studentAdded.emit({ name: this.name.trim(), age: this.age });
      this.name = '';
      this.age = null;
    }
  }
}
