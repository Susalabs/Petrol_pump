import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateBillComponent } from './component/create-bill/create-bill.component';
import { ViewBillComponent } from './component/view-bill/view-bill.component';
import { CreateCompanyComponent } from './component/create-company/create-company.component';
import { ViewCompanyComponent } from './component/view-company/view-company.component';
import { ShowCompanyWiseInvoiceComponent } from './component/show-company-wise-invoice/show-company-wise-invoice.component';



const routes: Routes = [
  {
    path:'invoice',component:CreateBillComponent
  },
  {
    path:'view-invoice',component:ViewBillComponent
  },
  {
    path:'Create-company',component:CreateCompanyComponent
  },

  {
    path:'view-company',component:ViewCompanyComponent
  },

  {
    path:'view-company-wise',component:ShowCompanyWiseInvoiceComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
