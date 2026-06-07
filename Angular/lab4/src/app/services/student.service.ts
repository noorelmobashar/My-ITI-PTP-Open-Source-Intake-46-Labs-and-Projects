import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IStudent } from '../models/istudent';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = 'https://analyzer-6fx2.onrender.com/students';

  getAll(): Observable<IStudent[]> {
    return this.http.get<IStudent[]>(this.apiUrl);
  }

  getById(id: number | string): Observable<IStudent> {
    return this.http.get<IStudent>(`${this.apiUrl}/${id}`);
  }

  addStudent(name: string, age: number): Observable<IStudent> {
    return this.http.post<IStudent>(this.apiUrl, { name, age });
  }

  updateStudent(updatedStudent: IStudent): Observable<IStudent> {
    return this.http.put<IStudent>(`${this.apiUrl}/${updatedStudent.id}`, updatedStudent);
  }

  deleteStudent(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

