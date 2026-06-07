import { Injectable } from '@angular/core';
import { IStudent } from '../models/istudent';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private students: IStudent[] = [
    { id: 1, name: 'Ahmed', age: 20 },
    { id: 2, name: 'Ali', age: 21 },
    { id: 3, name: 'Omar', age: 22 },
  ];

  getAll(): IStudent[] {
    return this.students;
  }

  addStudent(name: string, age: number): void {
    const nextId = this.students.length > 0 ? Math.max(...this.students.map((s) => s.id)) + 1 : 1;
    this.students.push({ id: nextId, name, age });
  }

  updateStudent(updatedStudent: IStudent): void {
    const index = this.students.findIndex((s) => s.id === updatedStudent.id);
    if (index !== -1) {
      this.students[index] = updatedStudent;
    }
  }

  deleteStudent(id: number): void {
    this.students = this.students.filter((s) => s.id !== id);
  }
}
