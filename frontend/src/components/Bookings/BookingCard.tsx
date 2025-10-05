import { 
  Calendar,
  Clock,
  MapPin,
  Car,
  User,
  CreditCard,
  Phone,
  Mail,
  CheckCircle2
} from 'lucide-react';
import { VehiclePreview } from '../../interfaces/Vehicle';
import { CustomersBrief } from '../../interfaces/Customer';

interface BookingFormData {
  PickUpLocID: string;
  DropOffLocID: string;
  PickUpDate: string;
  PickUpTime: string;
  DropOffDate: string;
  DropOffTime: string;
  vehicleID: string;
  vehicleTypeID: string;
  ClientID?: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  DOB: string;
  passportNo: string;
  address: string;
  city: string;
  country: string;
  licenseNo: string;
  licenseExpiry: string;
  Payment: string;
}


interface BookingCardProps {
  booking: BookingFormData;
  vehicle?: VehiclePreview;
  customer?: CustomersBrief;
}

const locations = [
  { id: "1", label: "Tempelhof Office" },
  { id: "3", label: "Berlin Airport" },
];

const getLocationLabel = (id: string) => {
  const loc = locations.find((l) => l.id === id);
  return loc ? loc.label : "--";
};


const BookingCard: React.FC<BookingCardProps> = ({ booking, vehicle, customer }) => {
  return (
    <div className="max-w-2xl mx-auto rounded-xl overflow-hidden">
       <h3 className="card-header text-xl mb-4 p-4">Booking Details</h3>
      <div className="p-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column with details */}
          <div className="flex-1 space-y-6">
            {/* Vehicle Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Car className="text-purple" size={24} />
                <div>
                  <h3 className="font-semibold text-gray-900">{vehicle?.name} - ({vehicle?.plateNumber})</h3>
                  <p className="text-sm text-gray-500">{vehicle?.group}</p>
                </div>
              </div>
            </div>

            {/* Pickup & Return Details */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="text-purple" size={20} />
                <span>{getLocationLabel(booking.PickUpLocID)}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="text-purple" size={20} />
                <div>
                  <p>Pickup Date: {booking.PickUpDate}</p>
                  <p>Pickup Time: {booking.PickUpTime}</p>
                </div>
              </div>
               <div className="flex items-center space-x-3">
                <MapPin className="text-purple" size={20} />
                <span>{getLocationLabel(booking.DropOffLocID)}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="text-purple" size={20} />
                <div>
                  <p>Drop Off Date: {booking.DropOffDate}</p>
                  <p>Drop Off Time: {booking.DropOffTime}</p>
                </div>
              </div>
            </div>
              {/* Customer Details */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="text-purple" size={20} />
                <span className="font-medium">{customer?.fullName || "--"}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-purple" size={20} />
                <span>{customer?.email || "--"}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-purple" size={20} />
                <span>{customer?.phone || "--"}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CreditCard className="text-purple" size={20} />
                <span>€ </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="text-purple" size={20} />
                <span>{booking.Payment}</span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;