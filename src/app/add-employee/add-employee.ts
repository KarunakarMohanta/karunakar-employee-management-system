import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-employee.html',
  styleUrls: ['./add-employee.css']
})
export class AddEmployee implements OnInit {

  // For Add Employee Form
  employeeName = '';
  email = '';
  mobileNumber = '';
  joiningDate = '';
  department = '';
  salary = '';
  
  // For View Section
  employees: any[] = [];
  showViewSection: boolean = true;
  
  // For Search
  searchTerm: string = '';
  allEmployees: any[] = [];
  
  // For View Modal
  showViewModal: boolean = false;
  selectedEmployee: any = null;
  
  userRole: string = '';  // ✅ ADD THIS LINE
  userType: string = ''; 
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    console.log('Current User from localStorage:', currentUser);
    
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadEmployees();

    const user = JSON.parse(currentUser);
    this.userRole = user.role;  // ✅ Set userRole
     this.userType = user.userType || 'registered';
    console.log('Current user role:', this.userRole);
    
    if (this.userRole === 'user') {
      this.showViewSection = true;  // Users see employee list
    } else {
      this.showViewSection = false; // Admins see add form
    }

    const today = new Date().toISOString().split('T')[0];
    this.joiningDate = today;
  }
  
  loadEmployees() {
  console.log('1. Loading started, isLoading =', this.isLoading);
  this.isLoading = true;
  this.cdr.detectChanges();
  console.log('2. Set isLoading to true');
  
  this.http.get<any[]>('http://localhost:8080/api/employees')
    .subscribe({
      next: (data) => {
        console.log('3. Data received, before mapping');
        
        this.employees = data.map(emp => ({
          id: emp.id,
          firstName: emp.firstName,
          lastName: emp.lastName,
          name: `${emp.firstName || ''} ${emp.lastName || ''}`.trim(),
          email: emp.email || 'N/A',
          mobileNumber: emp.mobileNumber || 'N/A',
          joiningDate: emp.joiningDate || 'N/A',
          department: emp.department || 'Not Assigned',
          salary: emp.salary || 0,
          createdAt: emp.createdAt || new Date().toLocaleDateString()
        }));
        
        this.allEmployees = [...this.employees];
        console.log('4. Before setting isLoading = false');
        this.isLoading = false;
        this.cdr.detectChanges();
        console.log('5. After setting isLoading =', this.isLoading);
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
}

  // Add Employee Function
  addEmployee() {
    if (!this.employeeName) {
      alert('Please enter employee name');
      return;
    }

    if (!this.email) {
      alert('Please enter email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      alert('Please enter valid email address');
      return;
    }

    if (!this.mobileNumber) {
      alert('Please enter mobile number');
      return;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(this.mobileNumber)) {
      alert('Please enter valid 10-digit mobile number');
      return;
    }

    if (!this.joiningDate) {
      alert('Please enter joining date');
      return;
    }

    if (!this.department) {
      alert('Please enter department');
      return;
    }

    if (!this.salary) {
      alert('Please enter salary');
      return;
    }

    const nameParts = this.employeeName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    const employeeData = {
      firstName: firstName,
      lastName: lastName,
      email: this.email,
      mobileNumber: this.mobileNumber,
      joiningDate: this.joiningDate,
      department: this.department,
      salary: parseFloat(this.salary)
    };

    console.log('Sending to backend:', employeeData);

    this.http.post('http://localhost:8080/api/employees', employeeData)
      .subscribe({
        next: (response: any) => {
          console.log('Added successfully:', response);
          alert(`${this.employeeName} has been added successfully!`);
          
          this.employeeName = '';
          this.email = '';
          this.mobileNumber = '';
          this.joiningDate = new Date().toISOString().split('T')[0];
          this.department = '';
          this.salary = '';
          
          this.loadEmployees();
          
          if (!this.showViewSection) {
            this.showViewSection = true;
          }
        },
        error: (err) => {
          console.error('Error adding employee:', err);
          
          if (err.status === 400) {
            alert('Invalid data. Please check all fields.');
          } else if (err.status === 0) {
            alert('Cannot connect to backend. Is it running on port 8080?');
          } else {
            alert('Failed to add employee. Check console for details.');
          }
        }
      });
  }

  toggleView() {
    this.showViewSection = !this.showViewSection;
    if (this.showViewSection) {
      this.loadEmployees();
    }
  }

  searchEmployees() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.employees = [...this.allEmployees];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.employees = this.allEmployees.filter((emp: any) => {
      return (emp.name && emp.name.toLowerCase().includes(searchLower)) ||
             (emp.department && emp.department.toLowerCase().includes(searchLower)) ||
             (emp.email && emp.email.toLowerCase().includes(searchLower)) ||
             (emp.firstName && emp.firstName.toLowerCase().includes(searchLower)) ||
             (emp.lastName && emp.lastName.toLowerCase().includes(searchLower)) ||
             (emp.mobileNumber && emp.mobileNumber.includes(searchLower));
    });
  }

  viewEmployeeProfile(id: number) {
    console.log('View button clicked from Add Employee, ID:', id);
    this.router.navigate(['/employee-profile', id]);
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedEmployee = null;
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

  getTotalEmployees() {
    return this.employees.length;
  }
}