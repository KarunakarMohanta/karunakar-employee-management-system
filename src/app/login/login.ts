import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  onLogin() {
    if (!this.email) {
      this.showError('Please enter email');
      return;
    }

    if (!this.password) {
      this.showError('Please enter password');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Case 1: Fixed User (user@ems.com)
    if (this.email === 'user@ems.com' && this.password === 'user123') {
      const user = {
        id: 1,
        email: 'user@ems.com',
        fullName: 'Normal User',
        role: 'user',
        userType: 'fixed',
        loggedIn: true
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.showSuccess(user);
      setTimeout(() => {
        this.router.navigate(['/add-employee']);
      }, 500);
      this.isLoading = false;
      return;
    }
    
    // Case 2: Fixed Admin (admin@ems.com)
    if (this.email === 'admin@ems.com' && this.password === 'admin123') {
      const admin = {
        id: 2,
        email: 'admin@ems.com',
        fullName: 'Super Admin',
        role: 'SUPER_ADMIN',
        userType: 'fixed',
        loggedIn: true
      };
      localStorage.setItem('currentUser', JSON.stringify(admin));
      this.showSuccess(admin);
      setTimeout(() => {
        this.router.navigate(['/super-admin']);
      }, 500);
      this.isLoading = false;
      return;
    }

    // Case 3: Registered users from backend
    const loginData = {
      email: this.email,
      password: this.password
    };

    console.log('Checking registered user:', loginData);

    this.http.post('http://localhost:8080/api/auth/login', loginData)
      .subscribe({
        next: (response: any) => {
          console.log('Login success:', response);
          
          const user = {
            id: response.user.id,
            email: response.user.email,
            fullName: response.user.fullName,
            role: 'user',
            userType: 'registered',  // Important
            loggedIn: true
          };
          
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.showSuccess(user);
          this.isLoading = false;

          setTimeout(() => {
            this.router.navigate(['/add-employee']);
          }, 500);
        },
       error: (err) => {
          this.isLoading = false;
          
          // Proper error message based on status
          let errorMsg = 'Invalid email or password!';
          
          if (err.status === 0) {
            errorMsg = 'Cannot connect to server. Please check if backend is running on port 8080.';
          } else if (err.status === 401) {
            errorMsg = 'Invalid email or password!';
          } else if (err.status === 404) {
            errorMsg = 'Login service not found. Please check backend API.';
          } else if (err.status === 500) {
            errorMsg = 'Server error. Please try again later.';
          } else if (err.error?.message) {
            errorMsg = err.error.message;
          }
          
          this.showError(errorMsg);
        }
      });
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  showSuccess(user: any) {
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
      ">
        ✅ Welcome ${user.fullName || 'User'}! Redirecting...
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  goToFrontpage() {
    this.router.navigate(['/frontpage']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}