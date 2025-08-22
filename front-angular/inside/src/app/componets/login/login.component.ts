import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  flashMessage: { type: 'success' | 'error'; text: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.flashMessage = { type: 'error', text: 'Veuillez remplir tous les champs.' };
      return;
    }

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (res) => {
        this.flashMessage = { type: 'success', text: 'Connexion réussie !' };
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Erreur login:', err);
        this.flashMessage = { type: 'error', text: 'Nom d’utilisateur ou mot de passe incorrect.' };
      }
    });
  }
}
