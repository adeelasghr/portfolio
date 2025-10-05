import { LoginResponse } from '../interfaces/User';
import http from '../services/http';

// GET All Users
export const getAllUsers = async () => {
  const url = '/user/GetAll';
  const response = await http.get(url);
  return response.data;
};

// GET New User Code
export const getNewCode = async () => {
  const response = await http.get('/user/GetNewCode');
  return response.data;
};

// GET User By ID
export const getUserById = async (id?: number) => {
  const response = await http.get(`/user/GetById?id=${id}`);
  return response.data;
};

// UPDATE User Status
export const updateUserStatus = async (id: number, status: string) => {
        const response = await http.patch(`/user/ChangeStatus?id=${id}&status=${status}`);
      return response.data;
};

// ADD a User
export const addUser = async (userData: any) => {
  try{
    const response = await http.post('/user/AddUser', userData);
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

export const authLogin = async (loginData: { email: string; password: string }): Promise<LoginResponse> => {
  try {
     const response = await http.post<LoginResponse>('/user/Login', loginData);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return {
        success: false,
        message: error.response.data.message,
        errors: error.response.data.errors,
      };
    }
    return { success: false, message: "Something went wrong. Please contact the administrator or try again later." };
  }
};