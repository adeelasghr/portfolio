import http from '../services/http';

// ADD a Customer
export const addCustomer = async (customerData: any) => {
  try{
    const response = await http.post('/customer/AddCustomer', customerData);
    return response.data;
  }
    catch (error: any) {
    if (error.response && error.response.data?.errors) {
      return {
        success: false,
        errors: error.response.data.errors,
      };
    }
  }
};

// GET New Customers Code
export const getNewCode = async () => {
  const response = await http.get('/customer/GetNewCode');
  return response.data;
};

// GET All Customers Brief
export const getCustomersBrief = async (id?: number) => {
  const url = id ? `/customer/GetBrief?id=${id}` : '/customer/GetBrief';
  const response = await http.get(url);
  return response.data;
};

// GET Customer Details by ID
export const getCustomerDetails = async (id: any) => {
  const response = await http.get(`/customer/GetCustomerDetails?id=${id}`);
  return response.data;
};

// UPDATE Customer Details
export const updateCustomer = async (customerData: any) => {
   try{
    const response = await http.patch('/customer/UpdateCustomer', customerData);
    return response.data;
  }
  catch (error: any) {
    if (error.response && error.response.data?.errors) {
      return {
        success: false,
        errors: error.response.data.errors,
      };
    }
  }
};

// DELETE a Customer
export const deleteCustomer = async (id: any) => {
  const response = await http.patch(`/customer/DeleteCustomer?id=${id}`);
  return response.data;
};