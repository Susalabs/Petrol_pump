export interface Company {
  _id?: string;
  companyName: string;
  companyEmail: string;
  creditLimit: number;
  expiryDate: Date;
  creditCardNumber?: string;
  availableLimit:number;
}
