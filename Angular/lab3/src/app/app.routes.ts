import { Routes } from '@angular/router';
import { Home } from './home/home';
import { StudentList } from './student-list/student-list';
import { AboutUs } from './about-us/about-us';
import { Contact } from './contact/contact';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'students', component: StudentList },
  { path: 'about', component: AboutUs },
  { path: 'contact', component: Contact },
  { path: '**', component: NotFound }
];
