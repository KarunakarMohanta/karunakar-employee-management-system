import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private baseURL = "http://localhost:8080/api/employees";

  constructor(private httpClient: HttpClient) { }

  getEmployeesList(): Observable<any> {
    return this.httpClient.get(`${this.baseURL}`);
  }
}