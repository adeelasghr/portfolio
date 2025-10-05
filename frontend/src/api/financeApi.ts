import http from '../services/http';

// GET All Users
export const getAllInvoices = async () => {
  const url = '/Invoice/GetAll';
  const response = await http.get(url);
  return response.data;
};

// GET All Users
export const getInvoiceDetails = async (id: any) => {
  const url = `/Invoice/GetDetails?invoiceID=${id}`;
  const response = await http.get(url);
  return response.data;
};

