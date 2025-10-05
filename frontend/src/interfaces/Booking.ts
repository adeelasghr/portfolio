
export interface BookingsBrief {
    id: string;
    code: string;
    vehicle: string;
    customer: string;
    bookingFrom: string;
    bookingTo: string;
    status: string;
    source: string;
}

export interface BookingsCalendar {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description: string;
  allDay?: boolean;
  status: "Paid" | "Pending" | "Cancelled" | "Completed";
}
