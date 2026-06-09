import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-view.html',
  styleUrls: ['./user-view.css']
})
export class UserView implements OnInit {

  employees: any[] = [];
  searchTerm: string = '';
  allEmployees: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  currentUser: any = null;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
      this.router.navigate(['/login']);
      return;
    }
    this.currentUser = JSON.parse(userData);
    console.log('Logged in user:', this.currentUser);
    this.loadEmployees();
  }

  loadEmployees() {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:8080/api/employees')
      .subscribe({
        next: (data) => {
          console.log('Employees loaded:', data);
          this.employees = data.map(emp => ({
            id: emp.id,
            firstName: emp.firstName,
            lastName: emp.lastName,
            name: `${emp.firstName || ''} ${emp.lastName || ''}`.trim(),
            email: emp.email || 'N/A',
            mobileNumber: emp.mobileNumber || 'N/A',
            joiningDate: emp.joiningDate || 'N/A',
            department: emp.department || 'Not Assigned',
            salary: emp.salary || 0
          }));
          this.allEmployees = [...this.employees];
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading employees:', err);
          this.errorMessage = 'Failed to load employees. Please try again.';
          this.isLoading = false;
        }
      });
  }

  searchEmployees() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.employees = [...this.allEmployees];
      return;
    }
    
    const searchLower = this.searchTerm.toLowerCase();
    this.employees = this.allEmployees.filter((emp: any) => 
      (emp.name && emp.name.toLowerCase().includes(searchLower)) ||
      (emp.department && emp.department.toLowerCase().includes(searchLower)) ||
      (emp.email && emp.email.toLowerCase().includes(searchLower)) ||
      (emp.mobileNumber && emp.mobileNumber.includes(searchLower))
    );
  }

  viewEmployeeProfile(id: number) {
    this.router.navigate(['/employee-profile', id]);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getDepartmentColor(department: string) {
    const colors: any = {
      'IT': '#2196F3',
      'HR': '#4CAF50',
      'Finance': '#FF9800',
      'Marketing': '#9C27B0',
      'Sales': '#f44336',
      'Development': '#4CAF50',
      'Not Assigned': '#999999'
    };
    return colors[department] || '#667eea';
  }
}