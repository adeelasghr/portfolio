import http from '../services/http';

// ADD a Vehicle
export const addVehicle = async (vehicleData: any) => {
  try{
    const response = await http.post("/vehicle/AddVehicle", vehicleData,
       {
        headers: { "Content-Type": "multipart/form-data" }
      }
    );
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

// GET New Vehicle Code
export const getNewCode = async () => {
  const response = await http.get('/vehicle/GetNewCode');
  return response.data;
};

// GET All Vehicles
export const GetAllVehicleNames = async () => {
  const response = await http.get('/vehicle/GetAllVehicleNames');
  return response.data;
};

// GET All Vehicle Brief
export const getVehiclesBrief = async (id?: number) => {
  const url = id ? `/vehicle/GetBrief?id=${id}` : '/vehicle/GetBrief';
  const response = await http.get(url);
  return response.data;
};

// GET Vehicle Details by ID
export const getvehicleDetails = async (id?: any) => {
  const response = await http.get(`/vehicle/GetVehicleDetails?id=${id}`);
  return response.data;
};

// GET Edit Vehicle Details by ID
export const getEditVehicleDetails = async (id?: any) => {
  const response = await http.get(`/vehicle/GetById?id=${id}`);
  return response.data;
};

// GET Edit Vehicle History by ID
export const getVehicleHistory = async (id?: any) => {
  const response = await http.get(`/vehicle/GetVehicleHistory?id=${id}`);
  return response.data;
};

// GET Edit Vehicle Stats by ID
export const getVehicleStats = async (id?: any) => {
  const response = await http.get(`/vehicle/GetStats?id=${id}`);
  return response.data;
};

// UPDATE Vehicle Details
export const updateVehicle = async (vehicleData: any) => {
   try{
    const response = await http.patch('/vehicle/UpdateVehicle', vehicleData);
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

// UPDATE Vehicle Status
export const updateVehicleStatus = async (id: number, status: string) => {
        const response = await http.patch(`/vehicle/ChangeStatus?id=${id}&status=${status}`);
      return response.data;
};

// DELETE a Vehicle
export const deleteVehicle = async (id: any) => {
  const response = await http.patch(`/vehicle/DeleteVehicle?id=${id}`);
  return response.data;
};

// GET Vehicle Types
export const getVehicleTypes = async () => {
  const response = await http.get('vehicle/types');
  return response.data; 
};

// GET Vehicle Brands
export const getVehicleBrand = async () => {
  const response = await http.get('vehicle/brands');
  return response.data; 
};

// GET Vehicle Models By Brands
export const getModelsByBrandId = async (brandId: number | string) => {
  const response = await http.get(`vehicle/models?brandId=${brandId}`);
  return response.data;
};

// GET Vehicle Transmission
export const getVehicleTransmission = async () => {
  const response = await http.get('vehicle/transmissions');
  return response.data; 
};

// GET Vehicle Fuel
export const getVehicleFuel = async () => {
  const response = await http.get('vehicle/fuels');
  return response.data; 
};

// GET Vehicle Group
export const getVehicleGroup = async () => {
  const response = await http.get('vehicle/groups');
  return response.data; 
};

// GET Vehicle Details by ID
export const getvehiclePreview = async (id: any) => {
  const response = await http.get(`/vehicle/GetVehicleByType?id=${id}`);
  return response.data;
};