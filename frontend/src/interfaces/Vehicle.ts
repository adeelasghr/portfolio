export interface MaintenanceScheduleItem {
  serviceType: number;
  serviceName: string;
  odometer: string;
  scheduleDate: string; 
  status: string;  
}

export interface VehicleImageItem {
  imagePath: string;
}

export interface InspectionItem {
  image: string;
  remarks: string;
  date: string;
}

export interface Vehicle {
    ID: string;
    code: string;
    plateNumber: string;
    year: string;
    dailyRate: string;
    AC: string;
    noOfSeats: number;
    color: string;
    features: string;
    mileage: string;
    group: string;
    luggage: string;
    showOnWebsite: number;
    type: string;
    brand: string;
    model: number;
    transmission: string;
    fuelType: string;
    createdOn: string;
    status: string;
    maintenanceSchedule: MaintenanceScheduleItem[];
    vehicleImages: VehicleImageItem[];
    inspections?: InspectionItem[];
  }

  export interface EditVehicleDetails {
    ID: string;
    vehicleCode: string;
    plateNumber: string;
    year: string;
    dailyRate: string;
    AC: string;
    noOfSeats: number;
    color: string;
    mileage: string;
    luggage: string;
    showOnWebsite: number;
    vehicleTypeID: number;
    brandID: number;
    model: number;
    transmissionID: number;
    fuelTypeID: number;
    createdOn: string;
    status: string;
  }

  export interface VehiclesBrief {
    id: string;
    vehicleCode: string;
    makeModel: string;
    plateNumber: string;
    vehicleType: string;
    dailyRate: string;
    group: string;
    status: string;
}

export interface VehiclePreview {
    id: string;
    name: string;
    plateNumber: string;
    type:  string;
    category: string;
    image: string;
    price: number;
    tag?: string;
    seats: string;
     group: string;
    bags: number;
    feul: string;
    transmission: string;
    hasAC: boolean;
    hasElectric?: boolean;
    features?: string[];
  }

  // Single history item
export interface VehicleHistoryItem {
  eventType: string;
  eventDescription: string;
  createdAt: string; // ISO string from API, convert to Date when needed
}

// Main vehicle history object
export interface VehicleHistoryI {
  vehicleID: string;
  vehicleCode: string;
  vehicleName: string;
  plateNumber: string;
  createdOn: string; // ISO string
  dailyRate: number;
  vehicleType: string;
  fuelType: string;
  group: string;
  status: string;
  vehicleImage: string;
  history: VehicleHistoryItem[];
}

export interface VehicleStats {
  vehicleID: number;
  vehicleCode: string,
  status: string,
  totalContracts: number,
  nextSchedule: string,
  totalIncome: number,
  totalExpense: number
}