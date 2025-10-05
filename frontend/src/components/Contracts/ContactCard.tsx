import React from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  User,
  Phone,
  Mail,
  CheckCircle2,
} from "lucide-react";

interface BookingCardProps {
  contract: {
    id: string;
    vehicle: {
      name: string;
      category: string;
      image: string;
    };
    customer: {
      name: string;
      email: string;
      phone: string;
    };
    pickupLocation: string;
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    returnTime: string;
    totalAmount: number;
    status: "confirmed" | "pending" | "completed";
  };
}

const ContractCard: React.FC<BookingCardProps> = ({ contract }) => {
  const qrCodeData = JSON.stringify({
    bookingId: contract.id,
    vehicle: contract.vehicle.name,
    customer: contract.customer.name,
    pickupDate: contract.pickupDate,
    pickupTime: contract.pickupTime,
  });

  return (
    <></>
  );
};

export default ContractCard;
