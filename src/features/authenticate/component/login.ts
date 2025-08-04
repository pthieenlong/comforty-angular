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
          this.authService.login(res.data);

          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (res) => {
          console.error('Error: ', res);
        },
      });
  }
}
