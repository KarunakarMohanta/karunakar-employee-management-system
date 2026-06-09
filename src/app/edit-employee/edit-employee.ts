import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-employee.html',
  styleUrls: ['./edit-employee.css']
})
export class EditEmployee implements OnInit {
  
  employee: any = {
    id: 0,
    firstName: '',
    lastName: '',
    name: '',
    email: '',
    mobileNumber: '',
    joiningDate: '',
    department: '',
    salary: 0
  };
  
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit() {
    console.log('EditEmployee Component Loaded');
    
    this.route.params.subscribe((params: any) => {
      console.log('Route params:', params);
      
      if (params.id) {
        this.loadEmployeeFromBackend(params.id);
      } else {
        const data = localStorage.getItem('selectedEmployee');
        if (data) {
          const emp = JSON.parse(data);
          this.loadEmployeeFromBackend(emp.id);
        } else {
          this.errorMessage = 'No employee selected';
          this.isLoading = false;
          this.cdr.detectChanges();  // Force change detection
        }
      }
    });
  }
  
  loadEmployeeFromBackend(id: number) {
    this.isLoading = true;
    this.cdr.detectChanges();  //  Force change detection
    
    console.log(`Loading employee from API: http://localhost:8080/api/employees/${id}`);
    
    this.http.get<any>(`http://localhost:8080/api/employees/${id}`)
      .subscribe({
        next: (data) => {
          console.log('Employee data received:', data);
          
          this.employee = {
            id: data.id,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
            email: data.email || '',
            mobileNumber: data.mobileNumber || '',
            joiningDate: data.joiningDate || '',
            department: data.department || '',
            salary: data.salary || 0
          };
          
          console.log('Employee loaded for edit:', this.employee);
          
          // Set isLoading to false
          this.isLoading = false;
          this.cdr.detectChanges();  //  Force change detection
          
          console.log('isLoading set to:', this.isLoading);
        },
        error: (error) => {
          console.error('Error loading employee:', error);
          this.errorMessage = 'Failed to load employee data';
          this.isLoading = false;
          this.cdr.detectChanges();  //  Force change detection
        }
      });
  }
  
  updateEmployee(event: Event) {
    event.preventDefault();
    
    if (!this.employee.name) {
      alert('Please enter employee name');
      return;
    }
    
    if (!this.employee.email) {
      alert('Please enter email address');
      return;
    }
    
    if (!this.employee.department) {
      alert('Please enter department');
      return;
    }
    
    if (!this.employee.salary) {
      alert('Please enter salary');
      return;
    }
    
    const nameParts = this.employee.name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';
    
    const updateData = {
      firstName: firstName,
      lastName: lastName,
      email: this.employee.email,
      mobileNumber: this.employee.mobileNumber,
      joiningDate: this.employee.joiningDate,
      department: this.employee.department,
      salary: parseFloat(this.employee.salary)
    };
    
    console.log('Updating employee:', this.employee.id, updateData);
    
    this.http.put(`http://localhost:8080/api/employees/${this.employee.id}`, updateData)
      .subscribe({
        next: (response) => {
          console.log('Update successful:', response);
          alert(`${this.employee.name} has been updated successfully!`);
          this.router.navigate(['/super-admin']);
        },
        error: (err) => {
          console.error('Error updating employee:', err);
          alert('Failed to update employee. Please try again.');
        }
      });
  }
  
  cancel() {
    this.router.navigate(['/super-admin']);
  }
}