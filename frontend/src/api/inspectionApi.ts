import http from '../services/http';


// GET Vehicle Types
export const getVehicleParts = async () => {
  const response = await http.get('inspection/GetVehicleParts');
  return response.data; 
};

// GET Vehicle Brands
export const getDamageCategory = async () => {
  const response = await http.get('inspection/GetDamageCategory');
  return response.data; 
};

// GET Vehicle Brands
export const getDamageLocations = async () => {
  const response = await http.get('inspection/GetDamageLocation');
  return response.data; 
};

// GET Vehicle Brands
export const getInspectionBrief = async (id: any) => {
  const response = await http.get(`inspection/GetInspectionBrief?id=${id}`);
  return response.data; 
};

