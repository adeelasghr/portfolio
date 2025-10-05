export interface ContractBrief {
    id: string;
    contractCode: string;
    vehicle: string;
    client: string;
    start: string;
    end: string;
    status: string;
    amount: number;
}

export interface ContractsCalendar {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description: string;
  allDay?: boolean;
  status: "Active" | "Confirmed" | "Cancelled";
}

export interface AddOn {
  addOnName: string;
  price: number;
  addOnDetail: string;
}

export interface ContractDetails {
  vehicleID: number;
  contractCode: string;
  vehiclCode: string;
  vehicleName: string;
  petrolType: string;
  fuelReading: number;
  group: string;
  customerCode: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  pickupLocID: number;
  pickDateTime: string;     
  dropOffLocID: number;
  dropDateTime: string;     
  dailyRent: number;
  totalDays: number;
  totalRentals: number;
  additionalCharges?: number | null;
  otherCharges?: number | null;
  totalAmount: number;
  discount: number;
  securityDeposit?: number | null;
  taxAmount?: number | null;
  signature?: string | null;
  createdOn: string;
  status: string;
  userName: string;
  userCode: string;
  addOns: AddOn[];
}

export interface ContractOverview {
  pickupLocID: number;
  dropOffLocID: number;
  contractCode: string;
  pickupDateTime: string;
  dropOffDateTime: string;
  totalAmount: string;
  vehicleName: string;
  customerName: string;
  vehicleCode: string;
  customerCode: string;
}

export interface ContractClosing {
  contractCode: string;
  dropOffDateTime: string;
  fuelCoverage: string;
  startMileage: string;
  kmAllowed: string;
  totalAmount: string;
  taxAmount: string;
  securityDeposit: string;
}

export interface EditClosedContract {
    contractID: number,
    contractCode: string;
    securityDeposit: string,
    discount: string,
    totalAmount: string,
    taxAmount: string,
    excessiveCleaning: string,
    damageCharges: string,
    missingAccessory: string,
    excessMilage: string,
    lateReturn: string,
    fuelAdjustment: string;
    additionalCharges: string;
}