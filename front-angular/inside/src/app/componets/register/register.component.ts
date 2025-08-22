import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { username, email, password } = this.registerForm.value;

      // Appel au service d'authentification pour l'inscription
      this.authService.register(username, email, password).subscribe({
        next: (response) => {
          console.log('Inscription réussie:', response);
          
          // Si l'inscription inclut un token (connexion automatique)
          if (response.token && response.username) {
            // Stocker les informations de connexion
            localStorage.setItem('token', response.token);
            localStorage.setItem('username', response.username);
            
            this.successMessage = 'Inscription réussie ! Connexion automatique...';
            
            // Rediriger vers le dashboard après connexion automatique
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 1500);
          } else {
            // Fallback si pas de token
            this.successMessage = 'Inscription réussie ! Redirection vers la connexion...';
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          }
          
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Erreur lors de l\'inscription:', err);
          this.errorMessage = err.error?.error || 'Erreur lors de l\'inscription. Veuillez réessayer.';
          this.isSubmitting = false;
        }
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} est requis`;
      if (field.errors['minlength']) return `${fieldName} doit contenir au moins ${field.errors['minlength'].requiredLength} caractères`;
      if (field.errors['email']) return 'Email invalide';
      if (field.errors['passwordMismatch']) return 'Les mots de passe ne correspondent pas';
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  resetForm(): void {
    this.registerForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }
}
