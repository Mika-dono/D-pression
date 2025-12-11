import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoginMode = true;
  isLoading = false;
  error = '';
  success = '';

  loginForm = {
    email: '',
    password: ''
  };

  registerForm = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
    this.success = '';
  }

  onLogin(): void {
    if (!this.loginForm.email || !this.loginForm.password) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.loginUser(this.loginForm.email, this.loginForm.password)
      .subscribe({
        next: (result) => {
          this.ngZone.run(() => {
            if (result && result.success) {
              this.authService.setUserSession(result);
              this.router.navigate(['/home']);
            } else {
              this.error = result?.message || 'Email ou mot de passe incorrect';
              this.isLoading = false;
            }
            this.cdr.detectChanges();
          });
        },
        error: (err) => {
          this.ngZone.run(() => {
            this.error = err.error?.message || 'Erreur de connexion';
            this.isLoading = false;
            this.cdr.detectChanges();
          });
        }
      });
  }

  onRegister(): void {
    if (!this.registerForm.username || !this.registerForm.email || 
        !this.registerForm.password || !this.registerForm.confirmPassword) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.registerForm.password.length < 6) {
      this.error = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.register(
      this.registerForm.username,
      this.registerForm.email,
      this.registerForm.password
    ).subscribe({
      next: (result) => {
        this.ngZone.run(() => {
          if (result && result.success) {
            this.success = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.';
            this.isLoginMode = true;
            this.loginForm.email = this.registerForm.email;
            this.registerForm = { username: '', email: '', password: '', confirmPassword: '' };
          } else {
            this.error = result?.message || 'Erreur lors de l\'inscription';
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.error = err.error?.message || 'Erreur lors de l\'inscription';
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }
}
