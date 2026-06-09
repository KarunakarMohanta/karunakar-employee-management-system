import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-super-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './super-admin.html',
  styleUrls: ['./super-admin.css']
})
export class SuperAdmin implements OnInit {

  employees: any[] = [];
  allEmployees: any[] = [];
  searchTerm: string = '';
  
  showEditModal: boolean = false;
  selectedEmployee: any = null;
  showViewModal: boolean = false;
  viewEmployeeData: any = null;
  
  notificationMessage: string = '';
  showNotification: boolean = false;
  notificationType: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef  // ✅ ADDED
  ) {}

  ngOnInit() {
    console.log('🔵 Super Admin Component Initialized');
    this.loadEmployees();
    
    window.addEventListener('storage', () => {
      console.log('🔄 Storage changed');
      this.loadEmployees();
    });
    
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && this.router.url === '/super-admin') {
        console.log('🔄 Navigated back to Super Admin');
        this.loadEmployees();
      }
    });
    
    window.addEventListener('focus', () => {
      console.log('🔄 Page focused');
      this.loadEmployees();
    });
  }

  viewEmployeeProfile(id: number) {
    this.router.navigate(['/employee-profile', id]);
  }

  loadEmployees() {
    console.log('📡 Loading employees from API...');
    
    this.http.get<any[]>('http://localhost:8080/api/employees')
      .subscribe({
        next: (data) => {
          console.log('✅ Data received:', data?.length, 'employees');
          
          this.employees = data.map(emp => ({
            id: emp.id,
            firstName: emp.firstName,
            lastName: emp.lastName,
            name: `${emp.firstName || ''} ${emp.lastName || ''}`.trim(),
            email: emp.email || 'N/A',
            department: emp.department || 'Not Assigned',
            salary: emp.salary || 0,
            createdAt: emp.createdAt || 'N/A'
          }));
          
          this.allEmployees = [...this.employees];
          
          // ✅ FORCE CHANGE DETECTION - This will update the table
          this.cdr.detectChanges();
          
          console.log('✅ Mapped employees:', this.employees.length);
        },
        error: (err) => {
          console.error('❌ Error loading employees:', err);
          this.showNotificationMessage('Failed to load employees.', 'error');
          this.employees = [];
          this.allEmployees = [];
          this.cdr.detectChanges();
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
      (emp.firstName && emp.firstName.toLowerCase().includes(searchLower)) ||
      (emp.lastName && emp.lastName.toLowerCase().includes(searchLower))
    );
    
    this.cdr.detectChanges();  // ✅ Force update after search
  }

  viewEmployee(emp: any) {
    this.viewEmployeeData = emp;
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.viewEmployeeData = null;
  }

  editEmployee(id: number) {
    console.log('✏️ Edit button clicked for ID:', id);
    this.router.navigate(['/edit-employee', id]);
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedEmployee = null;
  }

  updateEmployee() {
    if (!this.selectedEmployee.name) {
      this.showNotificationMessage('Please enter employee name', 'error');
      return;
    }

    if (!this.selectedEmployee.department) {
      this.showNotificationMessage('Please enter department', 'error');
      return;
    }

    if (!this.selectedEmployee.salary) {
      this.showNotificationMessage('Please enter salary', 'error');
      return;
    }

    const nameParts = this.selectedEmployee.name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    const updateData = {
      firstName: firstName,
      lastName: lastName,
      email: this.selectedEmployee.email,
      department: this.selectedEmployee.department,
      salary: parseFloat(this.selectedEmployee.salary)
    };

    this.http.put(`http://localhost:8080/api/employees/${this.selectedEmployee.id}`, updateData)
      .subscribe({
        next: () => {
          this.showNotificationMessage(`${this.selectedEmployee.name} updated successfully!`, 'success');
          this.loadEmployees();
          this.closeEditModal();
        },
        error: (err) => {
          console.error('Error updating employee:', err);
          this.showNotificationMessage('Failed to update employee', 'error');
        }
      });
  }

  deleteEmployee(id: number, name: string) {
    const confirmDelete = confirm(`⚠️ Are you sure you want to delete ${name}?`);
    
    if (confirmDelete) {
      this.http.delete(`http://localhost:8080/api/employees/${id}`)
        .subscribe({
          next: () => {
            this.showNotificationMessage(`${name} deleted successfully!`, 'success');
            this.loadEmployees();
          },
          error: (err) => {
            console.error('Error deleting employee:', err);
            this.showNotificationMessage('Failed to delete employee', 'error');
          }
        });
    }
  }

  goToAddEmployee() {
    this.router.navigate(['/add-employee']);
  }

  refreshData() {
    console.log('🔄 Manual refresh clicked');
    this.loadEmployees();
    this.searchTerm = '';
    this.showNotificationMessage('Data refreshed successfully!', 'success');
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getTotalEmployees() {
    return this.employees.length;
  }

  getTotalSalary() {
    return this.employees.reduce((total, emp) => total + (Number(emp.salary) || 0), 0);
  }

  getAverageSalary() {
    if (this.employees.length === 0) return 0;
    return this.getTotalSalary() / this.employees.length;
  }

  getUniqueDepartments() {
    const departments = this.employees.map(emp => emp.department);
    return new Set(departments).size;
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

  showNotificationMessage(message: string, type: string) {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }
}