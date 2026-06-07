import { Component } from '@angular/core';
import { IStudent } from '../models/istudent';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test1',
  imports: [FormsModule, CommonModule],
  templateUrl: './test1.html',
  styleUrl: './test1.css',
})

export class Test1 {

  name: string = '';
  age: number = 0;

  students:IStudent [] = [
    {id: 1, name: 'Ahmed', age: 20},
    {id: 2, name: 'Ali', age: 21},
    {id: 3, name: 'Omar', age: 22}
  ]

  addStudent(){
    this.students.push({id: this.students.length + 1, name: this.name, age: this.age})
  }
}
