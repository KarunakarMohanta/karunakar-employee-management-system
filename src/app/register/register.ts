import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {

  fullName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  onRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.fullName) {
      this.showError('Please enter your full name');
      return;
    }

    if (!this.email) {
      this.showError('Please enter email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.showError('Please enter a valid email address');
      return;
    }

    if (!this.password) {
      this.showError('Please enter password');
      return;
    }

    if (this.password.length < 4) {
      this.showError('Password must be at least 4 characters');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.showError('Passwords do not match!');
      return;
    }

    this.isLoading = true;

    const userData = {
      fullName: this.fullName,
      email: this.email,
      password: this.password
    };

    console.log('Sending registration data:', userData);

    this.http.post('http://localhost:8080/api/auth/register', userData)
      .subscribe({
        next: (response: any) => {
          console.log('Registration success:', response);
          this.successMessage = `✅ Registration successful! Welcome ${this.fullName}! Please login.`;
          this.isLoading = false;
          this.resetForm();
          
          // Clear success message and redirect after 2 seconds
          setTimeout(() => {
            this.successMessage = '';
            console.log('Redirecting to login page...');
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          console.error('Registration error:', err);
          const errorMsg = err.error?.message || 'Registration failed! Please try again.';
          this.showError(errorMsg);
          this.isLoading = false;
        }
      });
  }

  resetForm() {
    this.fullName = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goToFrontpage() {
    this.router.navigate(['/frontpage']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}