import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IStudent } from '../models/istudent';
import { StudentIn } from '../student-in/student-in';
import { StudentEdit } from '../student-edit/student-edit';
import { StudentView } from '../student-view/student-view';

@Component({
  selector: 'app-student-list',
  imports: [CommonModule, StudentIn, StudentEdit, StudentView],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css',
})
export class StudentList {
  students: IStudent[] = [
    { id: 1, name: 'Ahmed', age: 20 },
    { id: 2, name: 'Ali', age: 21 },
    { id: 3, name: 'Omar', age: 22 },
  ];

  selectedStudentForView: IStudent | null = null;
  selectedStudentForEdit: IStudent | null = null;

  onStudentAdded(newStudent: { name: string; age: number }) {
    const nextId = this.students.length > 0 ? Math.max(...this.students.map(s => s.id)) + 1 : 1;
    this.students.push({
      id: nextId,
      name: newStudent.name,
      age: newStudent.age,
    });
  }

  onStudentUpdated(updatedStudent: IStudent) {
    const index = this.students.findIndex(s => s.id === updatedStudent.id);
    if (index !== -1) {
      this.students[index] = updatedStudent;
    }
    if (this.selectedStudentForView && this.selectedStudentForView.id === updatedStudent.id) {
      this.selectedStudentForView = updatedStudent;
    }
    this.selectedStudentForEdit = null;
  }

  deleteStudent(id: number) {
    this.students = this.students.filter(s => s.id !== id);
    if (this.selectedStudentForView?.id === id) {
      this.selectedStudentForView = null;
    }
    if (this.selectedStudentForEdit?.id === id) {
      this.selectedStudentForEdit = null;
    }
  }

  viewStudent(student: IStudent) {
    this.selectedStudentForView = student;
    this.selectedStudentForEdit = null;
  }

  editStudent(student: IStudent) {
    this.selectedStudentForEdit = student;
    this.selectedStudentForView = null;
  }
}
