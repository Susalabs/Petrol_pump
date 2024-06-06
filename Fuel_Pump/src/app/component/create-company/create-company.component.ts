import { Component, AfterViewInit, ViewChild, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Company } from '../Modal/company';
import { CompanyService } from '../service/company.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.css']
})
export class CreateCompanyComponent implements AfterViewInit, OnInit {

  companyForm!: FormGroup;
  companies: Company[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<Company>(this.companies);
  isEditMode = false; // Track whether the form is in edit mode

  constructor(
    public dialogRef: MatDialogRef<CreateCompanyComponent>,
    private fb: FormBuilder,
    private companyService: CompanyService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: { company: Company, isViewMode: boolean }
  ) {}

  ngOnInit(): void {
    this.initForm();
    // Check if it's in edit mode based on provided data
    this.isEditMode = !!this.data.company?._id;
    console.log('Received data:', this.data);
    if (this.isEditMode) {
      this.populateFormInViewMode();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  onCancel(): void {
    // Add confirmation dialog logic here if needed
    this.dialogRef.close();
  }


  saveCompany(): void {
    if (this.companyForm.valid) {
      const formData = this.companyForm.value;
      if (this.isEditMode) {
        // Update existing company
        formData._id = this.data.company._id; // Ensure to send _id for update
        this.companyService.updateCompany(formData).subscribe(
          (data) => {
            this.toastr.success('Company updated successfully');
            this.dialogRef.close(data); // Close the dialog and pass the updated company data
          },
          (error) => {
            this.toastr.error('Failed to update company');
            console.error(error);
          }
        );
      } else {
        // Add new company
        this.companyService.addCompany(formData).subscribe(
          (data) => {
            this.toastr.success('Company created successfully');
            this.dialogRef.close(data); // Close the dialog and pass the new company data
          },
          (error) => {
            this.toastr.error('Failed to create company');
            console.error(error);
          }
        );
      }
    } else {
      // Display validation errors to the user
      this.toastr.error('Please fill in all required fields correctly');
    }
  }

  private initForm(): void {
    this.companyForm = this.fb.group({
      companyName: ['', Validators.required],
      companyEmail: ['', [Validators.required, Validators.email]],
      creditLimit: [0, [Validators.required, Validators.min(0)]],
      expiryDate: ['', Validators.required]
    });
  }

  private populateFormInViewMode(): void {
    this.companyForm.patchValue({
      companyName: this.data.company.companyName,
      companyEmail: this.data.company.companyEmail,
      creditLimit: this.data.company.creditLimit,
      expiryDate: this.data.company.expiryDate,
      // Populate other fields as needed
    });
  }
}
