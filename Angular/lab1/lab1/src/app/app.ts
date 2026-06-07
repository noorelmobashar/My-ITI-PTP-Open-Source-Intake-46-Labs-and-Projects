import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Test1 } from './test1/test1';
import { Test2 } from './test2/test2';
import { Test3 } from './test3/test3';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Test1, Test2, Test3],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('lab1');
}

