import { Component, ElementRef, ViewChild } from '@angular/core';
import { Invoice } from '../Modal/invoice';
import { InvoiceService } from '../service/invoice.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-show-company-wise-invoice',
  templateUrl: './show-company-wise-invoice.component.html',
  styleUrls: ['./show-company-wise-invoice.component.css']
})
export class ShowCompanyWiseInvoiceComponent {
  @ViewChild('invoiceTable') invoiceTable!: ElementRef;
  invoices: Invoice[] = [];
  displayedInvoices: Invoice[] = [];
  pageIndex: number = 0;
  pageSize: number = 5;
  searchTerm: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  creditCardNumber:number=0;
  constructor(private invoiceService: InvoiceService,private route: ActivatedRoute) {}

  ngOnInit(): void {

    this.route.params.subscribe(params => {
       this.creditCardNumber = params['creditCardNumber'];
      console.log(this.creditCardNumber);

      // Now you have the credit card number, you can use it as needed
    });
    this.getAllInvoices();
  }

  getAllInvoices(): void {
    this.invoiceService.getInvoiceByCreditCardNo(this.creditCardNumber).subscribe(
      (data) => {
        this.invoices = data;
        this.updateDisplayedInvoices();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  updateDisplayedInvoices(): void {
    const filteredInvoices = this.filterInvoices();
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedInvoices = filteredInvoices.slice(startIndex, endIndex);
  }

  filterInvoices(): Invoice[] {
    return this.invoices.filter(invoice =>
      (invoice.companyName.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (!this.startDate || new Date(invoice.invoiceDate) >= this.startDate) &&
      (!this.endDate || new Date(invoice.invoiceDate) <= this.endDate)
    );
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedInvoices();
  }

  onSearch(event: any): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.updateDisplayedInvoices();
  }

  onDateChange(type: string, event: any): void {
    const date = new Date(event.target.value);
    if (type === 'start') {
      this.startDate = date;
    } else {
      this.endDate = date;
    }
    this.updateDisplayedInvoices();
  }

  getTotalSubtotal(): number {
    return this.displayedInvoices.reduce((total, invoice) => {
      const dieselAmount = invoice?.dieselAmount ?? 0;
      const petrolAmount = invoice?.petrolAmount ?? 0;
      const additionalChargesAmount = invoice?.additionalChargesAmount ?? 0;
      return total + dieselAmount + petrolAmount + additionalChargesAmount;
    }, 0);
  }

  generatePDF(): void {
    const pdf = new jspdf.jsPDF();
    const options = {
      background: 'white',
      scale: 2
    };

    // Create a temporary container for the combined content
    const contentContainer = document.createElement('div');
    contentContainer.innerHTML = `
      <div class="container" style="width: 80%; max-width: 800px; margin: 20px auto; background-color: #fff; padding: 20px; border: 1px solid #ddd; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div class="header" style="display: flex; align-items: center; border-bottom: 2px solid #f0c14b; padding-bottom: 10px; margin-bottom: 20px;">
          <img src="../../../assets/pump.jpg" alt="Bharat Petroleum" style="width: 80px; margin-right: 20px;">
          <div>
            <h1 style="font-size: 24px; color: #0056b3; margin: 0;">Sai Sangam Petroleum</h1>
            <p>Dealers: Bharat Petroleum Corporation Ltd.</p>
            <p class="gstin" style="font-size: 12px; color: #555;">GSTIN: 29AEYFS9708R1ZE</p>
          </div>
        </div>
        <div class="content" style="font-size: 14px; color: #333;">
          <p>Sy No. 150/4, Near Chandkapur, on NH 65 (9), Towards Hyderabad, Basavakalyan</p>
          <p>Dist Bidar Karnataka - 585419</p>
          <p>Cell: 9448488001</p>
          <p>Email: saisangampetroleum@gmail.com</p>
        </div>
      </div>
    `;

    // Clone the invoice table and append it to the temporary container
    const tableClone = this.invoiceTable.nativeElement.cloneNode(true);
    contentContainer.appendChild(tableClone);

    // Append the temporary container to the body for rendering
    document.body.appendChild(contentContainer);

    html2canvas(contentContainer, options).then((canvas) => {
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(canvas.toDataURL('image/jpeg', 0.5), 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.5), 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('invoice.pdf');
      document.body.removeChild(contentContainer); // Clean up temporary container
    }).catch((error) => {
      console.error('Error generating PDF:', error);
      document.body.removeChild(contentContainer); // Ensure clean up even on error
    });
  }

}
