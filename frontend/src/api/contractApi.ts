import http from '../services/http';

// Get New Contract Code
export const getNewCode = async () => {
  const response = await http.get('/contract/GetNewCode');
  return response.data;
};

// ADD a Contract
export const addContract = async (contractData: any) => {
  try{
    const response = await http.post("/contract/AddContract", contractData,
       {
        headers: { "Content-Type": "multipart/form-data" }
      });
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

// GET All Contract Brief
export const getContractsBrief = async (id?: number) => {
  const url = id ? `/contract/GetBrief?id=${id}` : '/contract/GetBrief';
  const response = await http.get(url);
  return response.data;
};

// GET All Contract Calendar
export const getContractCalendar = async (startDate: string, endDate: string ) => {
  const response = await http.get(`/contract/GetCalendar?startDate=${startDate}&endDate=${endDate}`);
  return response.data;
};

// GET All Contact Print Details
export const getContractDetails = async (id: number) => {
  const url = `/contract/Print?id=${id}`;
  const response = await http.get(url);
  return response.data;
};

// GET Contract Overview
export const getContractOverview = async (id: number) => {
  const url = `/contract/Overview?id=${id}`;
  const response = await http.get(url);
  return response.data;
};

// GET Contract Details for Edit
export const getContractDetailsForEdit = async (id: number) => {
  const url = `/contract/GetDetailsForEdit?id=${id}`;
  const response = await http.get(url);
  return response.data;
};

// GET Contract Details For Closing
export const getContractClose = async (id: number) => {
  const url = `/contract/GetClose?id=${id}`;
  const response = await http.get(url);
  return response.data;
};

// GET Contract Details For Edit Closing
export const getContractEditClose = async (id: number) => {
  const url = `/contract/GetEditClose?id=${id}`;
  const response = await http.get(url);
  return response.data;
};


// Close a Contract
export const closeContract = async (contractData: any) => {
  try{
    const response = await http.post("/contract/Close", contractData,
       {
        headers: { "Content-Type": "multipart/form-data" }
      });
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

//Updating a Contract
export const updateContract = async (contractData: any) => {
   try{
    const response = await http.patch('/contract/UpdateContract', contractData);
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

// UPDATE Vehicle Details
export const cancelContract = async (id: string, remarks: string ) => {
   try{
    const response = await http.get(`/contract/CancelContract?id=${id}&remarks=${remarks}`);
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

// UPDATE Closed Contract
export const updateClosedContract = async (contractData: any) => {
  try{
    const response = await http.patch("/contract/ChangeClosedContract", contractData,
       {
        headers: { "Content-Type": "multipart/form-data" }
      });
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