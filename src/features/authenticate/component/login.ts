import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { API_URL } from 'types/const';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: '../ui/login.html',
  styleUrl: '../ui/login.css',
})
export class Login {
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    rememberMe: new FormControl(false),
  });
  constructor(private httpClient: HttpClient) {}
  onSubmit() {
    const formData = this.loginForm.value;

    this.httpClient.post(`${API_URL}/auth/login`, {...formData, withCredential: true}).subscribe({
      next: res => {
        console.log("Result: ", res);
      },
      error: res => {
        console.error("Error: ", res);
      }
    })
  }
}
