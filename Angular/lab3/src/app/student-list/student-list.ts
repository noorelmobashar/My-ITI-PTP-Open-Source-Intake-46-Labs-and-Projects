import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IStudent } from '../models/istudent';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-student-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css',
})
export class StudentList {
  private studentService = inject(StudentService);

  newName: string = '';
  newAge: number | null = null;

  selectedStudentForView: IStudent | null = null;
  selectedStudentForEdit: IStudent | null = null;

  editName: string = '';
  editAge: number = 0;

  get students(): IStudent[] {
    return this.studentService.getAll();
  }

  addStudent() {
    if (this.newName.trim() && this.newAge !== null && this.newAge > 0) {
      this.studentService.addStudent(this.newName.trim(), this.newAge);
      this.newName = '';
      this.newAge = null;
    }
  }

  viewStudent(student: IStudent) {
    this.selectedStudentForView = student;
    this.selectedStudentForEdit = null;
  }

  editStudent(student: IStudent) {
    this.selectedStudentForEdit = student;
    this.editName = student.name;
    this.editAge = student.age;
    this.selectedStudentForView = null;
  }

  saveEdit() {
    if (this.selectedStudentForEdit && this.editName.trim() && this.editAge > 0) {
      const updated: IStudent = {
        id: this.selectedStudentForEdit.id,
        name: this.editName.trim(),
        age: this.editAge,
      };
      this.studentService.updateStudent(updated);

      if (this.selectedStudentForView?.id === updated.id) {
        this.selectedStudentForView = updated;
      }
      this.selectedStudentForEdit = null;
    }
  }

  deleteStudent(id: number) {
    this.studentService.deleteStudent(id);
    if (this.selectedStudentForView?.id === id) {
      this.selectedStudentForView = null;
    }
    if (this.selectedStudentForEdit?.id === id) {
      this.selectedStudentForEdit = null;
    }
  }
}
