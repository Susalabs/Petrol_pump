import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CreateCompanyComponent } from '../create-company/create-company.component';
import { CompanyService } from '../service/company.service';
import { Company } from '../Modal/company';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-company',
  templateUrl: './view-company.component.html',
  styleUrls: ['./view-company.component.css']
})
export class ViewCompanyComponent implements AfterViewInit {
  companies: Company[] = [];

  displayedColumns: string[] = ['position', 'companyName', 'creditCardNumber', 'creditLimit','AvailableLimit', 'Action'];
  dataSource = new MatTableDataSource<Company>(this.companies);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public dialog: MatDialog, private companyService: CompanyService, private toastr: ToastrService,private router: Router) {}

  ngAfterViewInit() {
    this.getCompanies();
    this.dataSource.paginator = this.paginator;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateCompanyComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCompanies();  // Refresh the company list after adding a new company
      }
    });
  }

  getCompanies(): void {
    this.companyService.getCompanies().subscribe(
      (companies) => {
        this.companies = companies;
        this.dataSource.data = this.companies;  // Update the data source
      },
      (error) => {
        console.error('Error fetching companies:', error);
      }
    );
  }

  editCompany(company: Company): void {

    const dialogRef = this.dialog.open(CreateCompanyComponent, {
      width: '300px',
      data: { company: company, isViewMode: true } // Pass the company data and set view mode
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any actions after dialog closed (if needed)
    });
  }

  // Method to handle view action
  viewCompany(company: Company): void {
    const creditCardNumber = company.creditCardNumber; // Extract the credit card number
    this.router.navigate(['/view-company-wise', { creditCardNumber: creditCardNumber }]);
  }


  deleteCompany(company: Company | undefined): void {
    alert("Are you sure")
    if (!company || !company._id) {
      console.error('Invalid company data or missing _id.');
      return;
    }

    console.log('Delete company with ID:', company._id);
    this.companyService.deleteCompany(company._id).subscribe(
      (data) => {
        console.log('Company deleted successfully:', data);
        this.toastr.success('Deleted successfully');
        // Optionally, update the company list after deletion
        this.getCompanies();
      },
      (error) => {
        console.error('Error deleting company:', error);
      }
    );
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = value;
  }

}
