export interface InvoiceBrief {
    invoiceID: number;
    invoiceCode: string;
    invoiceDate: string;
    totalAmount: string;
    taxAmount: string;
    discount: string;
    grossAmount: string;
    contractCode: string;
    clientName: string;
    createdAt: string;
}

export interface InvoiceDetails {
  invoiceCode: string;
  contractCode: string;
  invoiceDate: string; 
  netAmount: number;
  taxAmount: number;
  grossAmount: number;
  discount: number;
  customerName: string;
  email: string;
  phoneNumber: string;
  userInfo: string;
  signatures: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  itemName: string;
  amount: number;
}
