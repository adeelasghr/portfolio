import http from '../services/http';

// GET Add On Brief
export const getAllAddOns = async () => {
  const url = '/addons/GetAll';
  const response = await http.get(url);
  return response.data;
};

// GET New AddOns Code
export const getNewCode = async () => {
  const response = await http.get('/addons/GetNewCode');
  return response.data;
};

// ADD an AddOn
export const addAddOn = async (addOnData: any) => {
  try{
    const response = await http.post('/addons/AddAddOns', addOnData);
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