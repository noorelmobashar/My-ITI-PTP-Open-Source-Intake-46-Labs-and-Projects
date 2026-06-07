import { Component, signal } from '@angular/core';
import { StudentList } from './student-list/student-list';
import { Product } from './product/product';

@Component({
  selector: 'app-root',
  imports: [StudentList, Product],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('lab1');
}

