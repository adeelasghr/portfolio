import http from '../services/http';

// ADD a Booking
export const addBooking = async (bookingData: any) => {
  try{
    const response = await http.post('/booking/AddBooking', bookingData);
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

// GET New Booking Code
export const getNewCode = async () => {
  const response = await http.get('/booking/GetNewCode');
  return response.data;
};

// GET All Booking Brief
export const getBookingsBrief = async (id?: number) => {
  const url = id ? `/booking/GetBrief?id=${id}` : '/booking/GetBrief';
  const response = await http.get(url);
  return response.data;
};

// GET All Booking Calendar
export const getBookingsCalendar = async (startDate: string, endDate: string ) => {
  const response = await http.get(`/booking/GetCalendar?startDate=${startDate}&endDate=${endDate}`);
  return response.data;
};

// GET Booking Details by ID
export const getBookingDetails = async (id: any) => {
  const response = await http.get(`/booking/GetById?id=${id}`);
  return response.data;
};

// GET Booking by Code
export const getBookingByCode = async (code: any) => {
  const response = await http.get(`/booking/GetByCode?code=${code}`);
  return response.data;
};

// GET All Booking Codes
export const getAllCode = async (searchKey: any) => {
  const response = await http.get(`/booking/ActiveCodes?searchKey=${searchKey}`);
  return response.data;
};

// UPDATE Booking Details
export const updateBooking = async (bookingData: any) => {
   try{
    const response = await http.patch('/booking/UpdateBooking', bookingData);
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

// UPDATE Booking Status
export const updateBookingStatus = async (id: number, status: string) => {
        const response = await http.patch(`/booking/ChangeStatus?id=${id}&status=${status}`);
      return response.data;
};