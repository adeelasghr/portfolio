export interface Maintenance {
    id: string;
    date: string;
    odometer: number;
    type: "Oil Change" | "Engine Check" | "Tyre Inspection";
    remarks: string;
    vehicleId: number;
    vehicleName: string;
    platenumber: string;
    status: "Scheduled" | "Overdue" | "Done";
}

export interface MaintenanceBrief {
    mainId: string;
    vehicleName: string;
    plateNumber: string;
    serviceType: string;
    odometer: string;
    serviceDate: string;
    status: string;
}
