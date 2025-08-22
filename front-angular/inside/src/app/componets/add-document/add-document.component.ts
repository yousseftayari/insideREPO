// src/app/components/add-document/add-document.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DocumentService, DocumentModel } from '../../services/document.service';

@Component({
  selector: 'app-add-document',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.css']
})
export class AddDocumentComponent {

  documentForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private router: Router
  ) {
    this.documentForm = this.fb.group({
      numero_dossier: ['', [Validators.required, Validators.minLength(2)]],
      numero_carton: ['', [Validators.required, Validators.minLength(2)]],
      modele: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  addDocument(): void {
    if (this.isSubmitting || this.documentForm.invalid) return;
    
    this.isSubmitting = true;
    this.errorMessage = '';

    const newDocument: Omit<DocumentModel, 'id'> = {
      numero_dossier: this.documentForm.get('numero_dossier')?.value,
      numero_carton: this.documentForm.get('numero_carton')?.value,
      modele: this.documentForm.get('modele')?.value,
      states: []
    };

    this.documentService.addDocument(newDocument as DocumentModel).subscribe({
      next: (response) => {
        console.log('Document ajouté avec succès:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout du document:', err);
        this.errorMessage = err.error?.message || 'Erreur lors de l\'ajout du document. Veuillez réessayer.';
        this.isSubmitting = false;
      }
    });
  }

  onSubmit(): void {
    if (this.documentForm.valid) {
      this.addDocument();
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.documentForm.controls).forEach(key => {
      const control = this.documentForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.documentForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} est requis`;
      if (field.errors['minlength']) return `${fieldName} doit contenir au moins ${field.errors['minlength'].requiredLength} caractères`;
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.documentForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  resetForm(): void {
    this.documentForm.reset();
    this.errorMessage = '';
  }
}
