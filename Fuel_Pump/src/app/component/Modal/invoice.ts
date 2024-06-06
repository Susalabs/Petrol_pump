export interface Invoice {
  _id?: string;
  invoiceNumber?: string;
  companyName: string;
  mobileNo: string;
  vehicleNo: string;
  invoiceDate: Date;
  creditCardNo:number;
  additionalChargesAmount?: number;

  dieselAmount: number;
  dieselQuantity: number;
  dieselRate: number;
  petrolAmount: number;
  petrolQuantity: number;
  petrolRate: number;
  taxAmount: number;
  totalAmount: number;

}
