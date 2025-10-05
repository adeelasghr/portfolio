import http from '../services/http';

// GET Maintenance Types
export const getMaintenanceType = async () => {
  const response = await http.get('/maintenance/GetAllTypes');
  return response.data;
};

// GET All  Maintenance
export const getAllMaintenance = async (id?: number) => {
  const url = id ? `/maintenance/GetAll?id=${id}` : '/maintenance/GetAll';
  const response = await http.get(url);
  return response.data;
};

// GET  Maintenance By ID
export const getMaintenanceByID = async (id: number) => {
  const url = `/maintenance/GetMaintenance?id=${id}`;
  const response = await http.get(url);
  return response.data;
};

// UPDATE Maintenance Status
export const updateMaintenanceStatus = async (id: number, status: string) => {
        const response = await http.patch(`/maintenance/ChangeStatus?id=${id}&status=${status}`);
      return response.data;
};

export const addMaintenance = async (maintenanceData: any) => {
  try{
    const response = await http.post("/maintenance/AddMaintenance", maintenanceData,
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

export const addInspection = async (inspectionData: any) => {
  try{
    const response = await http.post("/maintenance/AddInspection", inspectionData,
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