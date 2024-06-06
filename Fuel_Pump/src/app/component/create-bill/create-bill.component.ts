import { Component, OnInit } from '@angular/core';
import { Invoice } from '../Modal/invoice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceService } from '../service/invoice.service';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from '../service/company.service';
import { Subject, debounceTime, of, switchMap } from 'rxjs';
import { Company } from '../Modal/company';

@Component({
  selector: 'app-create-bill',
  templateUrl: './create-bill.component.html',
  styleUrls: ['./create-bill.component.css']
})
export class CreateBillComponent implements OnInit {
  companies!: Company;
  newInvoice: Invoice = {
    companyName: '',
    mobileNo: '',
    vehicleNo: '',
    invoiceDate: new Date(),
    creditCardNo:0,
    additionalChargesAmount: 0,
    dieselAmount: 0,
    dieselQuantity: 0,
    dieselRate: 0,
    petrolAmount: 0,
    petrolQuantity: 0,
    petrolRate: 0,
    taxAmount: 0,
    totalAmount: 0,

  };

  billForm!: FormGroup;
  totalAmount: number = 0;
  creditCardNo:number=0;
  SGST: number = 9;
  CGST: number = 9;
  taxAmount: number = 0;


  private creditCardNumberChanged = new Subject<string>();
  constructor(private fb: FormBuilder, private invoiceService: InvoiceService, private toastr: ToastrService,private company:CompanyService) {}

  ngOnInit(): void {
    this.initForm();
    this.subscribeToFormChanges();
    this.creditCardNumberChanged.pipe(
      debounceTime(1000) // Adjust debounce time as needed (in milliseconds)
    ).subscribe((creditCardNo) => {
      this.company.getBYCreditCardNumber(creditCardNo).subscribe(
        (data) => {
          this.companies=data
          console.log('Data received:', this.companies);
        },
        (error) => {
          console.log('Error:', error);
        }
      );
    });
  }

  initForm(): void {
    this.billForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      mobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      vehicleNo: ['', Validators.required],
      invoiceDate: ['', Validators.required],
      petrolQuantity: [''],
      petrolRate: [''],
      dieselQuantity: [''], // Diesel fields initially empty
      dieselRate: [''], // Diesel fields initially empty
      additionalChargesAmount: [''],
      SGST: [{ value: this.calculatePercentage(this.SGST), disabled: true }],
      CGST: [{ value: this.calculatePercentage(this.CGST), disabled: true }],
      creditCardNo: ['', Validators.required]
    });




  }



  calculatePercentage(value: number): string {
    return `${value}%`;
  }

  calculateAmount(quantity: number, rate: number): number {
    return (quantity || 0) * (rate || 0);
  }


  subscribeToFormChanges(): void {
    this.billForm.valueChanges.subscribe(() => {
      this.calculateTotalAmount();
    });

    this.billForm.get('creditCardNo')?.valueChanges.pipe(
      debounceTime(300) // Adjust debounce time as needed (in milliseconds)
    ).subscribe((value) => {
      this.onCreditCardNumberChange(value);
    });
  }

  onCreditCardNumberChange(creditCardNo: string): void {
    console.log('Credit card number changed:', creditCardNo);
    // Logic to execute when credit card number changes
    console.log('Credit card number changed');
    this.creditCardNumberChanged.next(creditCardNo);
  }




  calculateTotalAmount(): void {
    const petrolAmount = this.calculateAmount(this.billForm.get('petrolQuantity')?.value, this.billForm.get('petrolRate')?.value);
    const dieselAmount = this.calculateAmount(this.billForm.get('dieselQuantity')?.value, this.billForm.get('dieselRate')?.value);
    const additionalChargesAmount = parseFloat(this.billForm.get('additionalChargesAmount')?.value) || 0;

    this.totalAmount = petrolAmount + dieselAmount + additionalChargesAmount;
    this.taxAmount = this.calculateTaxAmount(this.totalAmount, this.SGST, this.CGST);
  }

  calculateTaxAmount(totalAmount: number, SGST: number, CGST: number): number {
    const totalTaxPercentage = SGST + CGST;
    return (totalAmount * totalTaxPercentage) / 100;
  }

  onSubmit(): void {
    if (this.billForm.valid) {
      console.log("foem",this.billForm.value);
      const formData = {
        ...this.billForm.value,
        petrolAmount: this.calculateAmount(this.billForm.get('petrolQuantity')?.value, this.billForm.get('petrolRate')?.value),
        dieselAmount: this.calculateAmount(this.billForm.get('dieselQuantity')?.value, this.billForm.get('dieselRate')?.value),
        totalAmount: this.totalAmount,
        taxAmount: this.taxAmount
      };

      if (this.totalAmount > this.companies.availableLimit) {
        this.toastr.error('Insufficient available credit. Please contact admin.');
        return;
      }

      // Chain the observables using switchMap
      this.invoiceService.createInvoice(formData).pipe(
        switchMap((invoiceResponse) => {
          const availableLimit = this.companies.availableLimit - this.totalAmount;
          if (this.companies && this.companies._id) {
            return this.company.updateAvailableLimitById(this.companies._id, availableLimit);
          } else {
            // If _id is not available, return a dummy observable to avoid errors
            return of(null);
          }
        })
      ).subscribe(
        (updateResponse) => {
          // Handle response from updateByCompany
          console.log('Update response:', updateResponse);
          this.toastr.success('Invoice created successfully');
          this.billForm.reset({
            invoiceDate: new Date(),
            SGST: this.calculatePercentage(this.SGST),
            CGST: this.calculatePercentage(this.CGST)
          });
        },
        (error) => {
          this.toastr.error('Error updating available credit', 'Error');
        }
      );
    } else {
      this.displayValidationErrors();
    }
  }


  displayValidationErrors(): void {
    Object.keys(this.billForm.controls).forEach(key => {
      const controlErrors = this.billForm.get(key)?.errors;
      if (controlErrors) {
        if (controlErrors['required']) {
          this.toastr.error(`${this.getFieldName(key)} is required`, 'Validation Error');
        }
        if (controlErrors['pattern']) {
          if (key === 'companyName') {
            this.toastr.error('Please enter a valid name (only letters and spaces allowed)', 'Validation Error');
          } else if (key === 'mobileNo') {
            this.toastr.error('Please enter a valid mobile number (10 digits only)', 'Validation Error');
          } else {
            this.toastr.error(`Please enter a valid ${this.getFieldName(key)}`, 'Validation Error');
          }
        }
      }
    });
  }

  getFieldName(key: string): string {
    switch (key) {
      case 'companyName': return 'Name';
      case 'mobileNo': return 'Mobile Number';
      case 'vehicleNo': return 'Vehicle Number';
      case 'invoiceDate': return 'Invoice Date';
      case 'creditCardNo': return 'creditCardNo';
      case 'petrolQuantity': return 'Petrol Quantity';
      case 'petrolRate': return 'Petrol Rate';
      case 'dieselQuantity': return 'Diesel Quantity';
      case 'dieselRate': return 'Diesel Rate';
      case 'additionalChargesAmount': return 'Additional Charges Amount';
      default: return key;
    }
  }



}
