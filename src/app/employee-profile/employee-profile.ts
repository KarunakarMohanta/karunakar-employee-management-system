import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-profile.html',
  styleUrls: ['./employee-profile.css']
})
export class EmployeeProfile implements OnInit {

  employee: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  
  currentUser: any = null;
  isAdmin: boolean = false;
  employeeId: number = 0;

  previousUrl: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) {}

  ngOnInit() {

    const navigation = this.router.getCurrentNavigation();
    this.previousUrl = navigation?.previousNavigation?.finalUrl?.toString() || '';
    
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.currentUser = JSON.parse(userData);
    this.isAdmin = this.currentUser.role === 'admin' || this.currentUser.role === 'SUPER_ADMIN';
    
    this.route.params.subscribe((params: any) => {
      
      if (params.id) {
        this.employeeId = params.id;
        this.loadEmployeeFromBackend(this.employeeId);
      } else {
        this.errorMessage = 'No employee ID provided';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadEmployeeFromBackend(id: number) {
    this.isLoading = true;
    
    this.http.get<any>(`http://localhost:8080/api/employees/${id}`)
      .subscribe({
        next: (data) => {
          
          this.employee = {
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
            email: data.email || 'N/A',
            mobileNumber: data.mobileNumber || 'N/A',
            joiningDate: data.joiningDate || 'N/A',
            department: data.department || 'Not Assigned',
            salary: data.salary || 0,
            createdAt: data.createdAt || 'N/A'
          };
          
          this.isLoading = false;
          this.cdr.detectChanges();  // Force change detection
        },
        error: (error) => { 
          this.errorMessage = `Failed to load employee: ${error.message}`;
          this.isLoading = false;
          this.cdr.detectChanges();  // Force change detection
        }
      });
  }

    goBack() {
    // Check if we came from Add Employee or Super Admin
    if (this.previousUrl.includes('add-employee')) {
      this.router.navigate(['/add-employee']);
    } else if (this.previousUrl.includes('super-admin')) {
      this.router.navigate(['/super-admin']);
    } else {
      // Default: use browser history
      this.location.back();
    }
  }

  getDepartmentColor(department: string) {
    const colors: any = {
      'IT': '#2196F3',
      'HR': '#4CAF50',
      'Finance': '#FF9800',
      'Marketing': '#9C27B0',
      'Sales': '#f44336',
      'Development': '#4CAF50',
      'Management': '#667eea',
      'Not Assigned': '#999999'
    };
    return colors[department] || '#764ba2';
  }

  formatSalary(salary: number) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(salary);
  }
}