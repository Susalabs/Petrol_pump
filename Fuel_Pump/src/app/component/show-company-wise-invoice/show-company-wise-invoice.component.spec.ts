import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCompanyWiseInvoiceComponent } from './show-company-wise-invoice.component';

describe('ShowCompanyWiseInvoiceComponent', () => {
  let component: ShowCompanyWiseInvoiceComponent;
  let fixture: ComponentFixture<ShowCompanyWiseInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowCompanyWiseInvoiceComponent]
    });
    fixture = TestBed.createComponent(ShowCompanyWiseInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
