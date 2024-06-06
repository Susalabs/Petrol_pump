import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material-module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenubarComponent } from './component/menubar/menubar.component';

import { HttpClientModule } from '@angular/common/http';
import { CreateBillComponent } from './component/create-bill/create-bill.component';
import { ViewBillComponent } from './component/view-bill/view-bill.component';
import { ToastrModule } from 'ngx-toastr';
import { CreateCompanyComponent } from './component/create-company/create-company.component';
import { ViewCompanyComponent } from './component/view-company/view-company.component';
import { ShowCompanyWiseInvoiceComponent } from './component/show-company-wise-invoice/show-company-wise-invoice.component';


@NgModule({
  declarations: [
    AppComponent,


    MenubarComponent,
      CreateBillComponent,
      ViewBillComponent,
      CreateCompanyComponent,
      ViewCompanyComponent,
      ShowCompanyWiseInvoiceComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
