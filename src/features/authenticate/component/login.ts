import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { API_URL } from 'types/const';
import { AuthService } from '../service/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: '../ui/login.html',
  styleUrl: '../ui/login.css',
})
export class Login {
  private readonly router = inject(Router);

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    rememberMe: new FormControl(false),
  });
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}
  onSubmit() {
    const formData = this.loginForm.value;
    this.httpClient
      .post(`${API_URL}/auth/login`, { ...formData, withCredential: true })
      .subscribe({
        next: (res: any) => {
          console.log('Login response:', res);
          this.authService.login(res.data);

          // Check if user is admin and redirect accordingly
          if (this.authService.isAdmin()) {
            console.log('User is admin, redirecting to admin dashboard');
            this.router.navigate(['/admin']);
          } else {
            console.log('User is not admin, redirecting to home');
            this.router.navigate(['/']);
          }
        },
        error: (res) => {
          console.error('Error: ', res);
        },
      });
  }
}
