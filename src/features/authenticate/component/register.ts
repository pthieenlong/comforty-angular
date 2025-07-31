import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { API_URL } from 'types/const';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: '../ui/register.html',
  styleUrl: '../ui/register.css'
})
export class Register {
  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(8)]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'),
    ]),
    email: new FormControl('', [Validators.required,
      Validators.email]),
    acceptTerms: new FormControl(false, [Validators.requiredTrue]),

  })
  get f() {
    return this.registerForm.controls;
  }
  constructor(private httpClient: HttpClient) {}
  onSubmit() {
    const formData = this.registerForm.value;

    this.httpClient.post(`${API_URL}/auth/register`, formData).subscribe({
      next: (res) => {
        console.log("Result: ", res);
      },
      error: (res) => {
        console.error("Error: ", res);
      }
    })
    console.log('register');
    

  }
  passwordMatchValidator(password: string, confirmPassword: string):boolean {
    return password === confirmPassword;
  }
}
