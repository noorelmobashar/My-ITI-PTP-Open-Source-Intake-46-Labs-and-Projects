import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { IStudent } from '../models/istudent';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-edit',
  imports: [FormsModule, CommonModule],
  templateUrl: './student-edit.html',
  styleUrl: './student-edit.css',
})
export class StudentEdit implements OnChanges {
  @Input() student!: IStudent;
  @Output() studentUpdated = new EventEmitter<IStudent>();
  @Output() close = new EventEmitter<void>();

  editName: string = '';
  editAge: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['student'] && this.student) {
      this.editName = this.student.name;
      this.editAge = this.student.age;
    }
  }

  save() {
    if (this.editName.trim() && this.editAge > 0) {
      this.studentUpdated.emit({
        id: this.student.id,
        name: this.editName.trim(),
        age: this.editAge,
      });
    }
  }

  cancel() {
    this.close.emit();
  }
}
