import { Component, inject, OnInit, signal } from '@angular/core';
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
export class StudentList implements OnInit {
  private studentService = inject(StudentService);

  students = signal<IStudent[]>([]);
  newName: string = '';
  newAge: number | null = null;

  selectedStudentForView: IStudent | null = null;
  selectedStudentForEdit: IStudent | null = null;

  editName: string = '';
  editAge: number = 0;

  isLoading = signal<boolean>(false);

  
  
  ngOnInit() {
    this.isLoading.set(true);
    this.loadStudents();
  }
  
  loadStudents() {
    this.studentService.getAll().subscribe({
      next: (data) => {
        this.isLoading.set(false);
        this.students.set(data);
        console.log(data);
      },
      error: (err) => {
        console.error('Error loading students:', err);
      }
    });
  }

  addStudent() {
    if (this.newName.trim() && this.newAge !== null && this.newAge > 0) {
      this.studentService.addStudent(this.newName.trim(), this.newAge).subscribe({
        next: (newStudent) => {
          this.newName = '';
          this.newAge = null;
        },
        error: (err) => {
          console.error('Error adding student:', err);
        },
        complete: () => {
          this.loadStudents();
        }
      });
    }
  }

  viewStudent(student: IStudent) {
    this.studentService.getById(student.id).subscribe({
      next: (data) => {
        this.selectedStudentForView = data;
        this.selectedStudentForEdit = null;
      },
      error: (err) => {
        console.error('Error viewing student:', err);
      }
    });
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
      this.studentService.updateStudent(updated).subscribe({
        next: (updatedStudent) => {
          if (this.selectedStudentForView?.id === updatedStudent.id) {
            this.selectedStudentForView = updatedStudent;
          }
          this.selectedStudentForEdit = null;
        },
        error: (err) => {
          console.error('Error updating student:', err);
        },
        complete: () => {
          this.loadStudents();
        }
      });
    }
  }

  deleteStudent(id: number) {
    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        this.students.set(this.students().filter((s) => s.id !== id));
        if (this.selectedStudentForView?.id === id) {
          this.selectedStudentForView = null;
        }
        if (this.selectedStudentForEdit?.id === id) {
          this.selectedStudentForEdit = null;
        }
      },
      error: (err) => {
        console.error('Error deleting student:', err);
      }
    });
  }
}

