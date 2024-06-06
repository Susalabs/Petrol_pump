import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Invoice } from '../Modal/invoice';
@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private apiUrl = 'http://localhost:3000/Invoice/'; // Update this with your API base URL

  constructor(private http: HttpClient) { }

  // Create a new invoice
  createInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}invoices`, invoice)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get all invoices
  getAllInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}invoices`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get a single invoice by ID
  getInvoiceById(id: string): Observable<Invoice> {
    const url = `${this.apiUrl}invoices/${id}`;
    return this.http.get<Invoice>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  getInvoiceByCreditCardNo(creditCardNo: number): Observable<Invoice[]> {
    const url = `${this.apiUrl}/invoicesCreditCardNumber/${ creditCardNo}`;
    return this.http.get<Invoice[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update an invoice by ID
  updateInvoice(id: string, invoice: Invoice): Observable<Invoice> {
    const url = `${this.apiUrl}invoices/${id}`;
    return this.http.put<Invoice>(url, invoice)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete an invoice by ID
  deleteInvoice(id: string): Observable<void> {
    const url = `${this.apiUrl}invoices/${id}`;
    return this.http.delete<void>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Error handling
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    throw new Error('Something bad happened; please try again later.');
  }
}
