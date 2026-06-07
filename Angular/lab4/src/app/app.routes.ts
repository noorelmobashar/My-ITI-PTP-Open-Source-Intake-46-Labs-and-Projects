import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadComponent: () => import('./home/home').then((m) => m.Home) 
  },
  { 
    path: 'students', 
    loadComponent: () => import('./student-list/student-list').then((m) => m.StudentList) 
  },
  { 
    path: 'about', 
    loadComponent: () => import('./about-us/about-us').then((m) => m.AboutUs) 
  },
  { 
    path: 'contact', 
    loadComponent: () => import('./contact/contact').then((m) => m.Contact) 
  },
  { 
    path: '**', 
    loadComponent: () => import('./not-found/not-found').then((m) => m.NotFound) 
  }
];

