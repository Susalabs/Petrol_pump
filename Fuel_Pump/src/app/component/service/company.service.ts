import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Company } from '../Modal/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private apiUrl = 'http://localhost:3000/Company/'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  // Handle HTTP errors
  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(error);
  }

  // Add a new company
  addCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(`${this.apiUrl}companies`, company, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get all companies
  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}companies`).pipe(
      catchError(this.handleError)
    );
  }

  // Get a company by ID
  getCompanyById(id: string): Observable<Company> {
    const url = `${this.apiUrl}companies/${id}`;
    return this.http.get<Company>(url).pipe(
      catchError(this.handleError)
    );
  }

  updateAvailableLimitById(id: string, newLimit: number): Observable<any> {
    const url = `${this.apiUrl}companiesUpdated/${id}`;
    const data = { availableLimit: newLimit };
    return this.http.put<any>(url, data);
  }


  getBYCreditCardNumber(creditCardNumber: string): Observable<Company> {
    const url = `${this.apiUrl}companiesNumber/${creditCardNumber}`;
    return this.http.get<Company>(url).pipe(
      catchError(this.handleError)
    );
  }
  // Update a company
  updateCompany(company: Company): Observable<Company> {
    const url = `${this.apiUrl}companies/${company._id}`;
    return this.http.put<Company>(url, company, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a company
  deleteCompany(id: string): Observable<{}> {
    const url = `${this.apiUrl}companies/${id}`;
    return this.http.delete(url, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      catchError(this.handleError)
    );
  }

}
