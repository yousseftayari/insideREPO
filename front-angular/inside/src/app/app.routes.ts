// app-routing.module.ts
import { Routes } from '@angular/router';

// Import your components
import { StatsComponent } from './componets/stats/stats.component';
import { RegisterComponent } from './componets/register/register.component';
import { PrintDocumentComponent } from './componets/print-document/print-document.component';
import { LoginComponent } from './componets/login/login.component';
import { EditDocumentComponent } from './componets/edit-document/edit-document.component';
import { AddDocumentComponent } from './componets/add-document/add-document.component';
import { DashbordsComponent } from './componets/dashboard/dashbords.component';
import { ScannerComponent } from './componets/scanner/scanner.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'scanner', component: ScannerComponent },
  { path: 'dashboard', component: DashbordsComponent },
  { path: 'stats', component: StatsComponent },
  { path: 'add-document', component: AddDocumentComponent },
  { path: 'edit-document/:id', component: EditDocumentComponent },
  { path: 'print-document/:id', component: PrintDocumentComponent },
  { path: '**', redirectTo: 'login' }  // fallback route
];
