import { motion } from "framer-motion";
import { X, Code, Check, User2, Car, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import MessageBox from "../Shared/MessageBox";
import { getBookingsBrief, updateBookingStatus } from "../../api/bookingApi";
import { BookingsBrief } from "../../interfaces/Booking";
import { formatBookingDates } from "../../utils/dateFormatter";

interface CustomerDetailsPopupProps {
  bookId: number;
  onClose: () => void;
}

const BookingCancelPopup: React.FC<CustomerDetailsPopupProps> = ({
  bookId: bookingId,
  onClose,
}) => {
  const [bookingData, setbookingData] = useState<BookingsBrief | null>(null);
 const [showSuccessModal, setShowSuccessModal] = useState(false);


  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const data = (await getBookingsBrief(bookingId)) as BookingsBrief[];
        setbookingData(data[0]);
        console.log("Results", data[0]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookingDetails();
  }, []);

   const handleUpdateStatus = () => {
      
        const result = updateBookingStatus(bookingId, "Cancelled");
        setShowSuccessModal(true);
        console.log(result);
        };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0, rotate: -10, y: 100 }}
          animate={{ scale: 1, rotate: 0, y: 0 }}
          exit={{ scale: 0, rotate: 10, y: -100 }}
          transition={{ type: "spring", damping: 15 }}
          className="bg-white rounded-xl overflow-hidden shadow-2xl popup-bg"
          onClick={(e) => e.stopPropagation()}
          style={{ minWidth: "300px" }}
        >
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              ></motion.div>
            </div>
          </div>
          <div className="p-8">
            <h3 className="card-header text-xl mb-6">Cancel Booking</h3>
            <div className="grid grid-cols-1 md:grid-cols-1">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4 mt-6"
              >
                {/* Left column with details */}
                <div className="flex-1 space-y-6">
                  {/* Booking Details */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Code className="text-blue-500" size={20} />
                      <span>{bookingData?.code}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Car className="text-blue-500" size={20} />
                      <span>{bookingData?.vehicle}</span>
                    </div>
                     <div className="flex items-center space-x-3">
                      <User2 className="text-blue-500" size={20} />
                      <span>{bookingData?.customer}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="text-blue-500" size={20} />
                      <span>{formatBookingDates(bookingData?.bookingFrom || "")}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="text-blue-500" size={20} />
                       <span>{formatBookingDates(bookingData?.bookingTo || "")}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="text-blue-500" size={20} />
                      <span>{bookingData?.status}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex space-x-4"
            >
              {bookingData?.status !== "Cancelled" && (
              <>
                <button
                  onClick={() => handleUpdateStatus()}
                  className="px-6 py-2 mx-auto border bg-purple-100 text-purple-800 border-purple-800 rounded-lg"
                >
                  Create Contract
                </button>
                <button
                  onClick={() => handleUpdateStatus()}
                  className="px-6 py-2 mx-auto bg-red-100 text-red-800 border border-red-800 rounded-lg"
                >
                  Cancel Booking
                </button>
              </>
            )}
            </motion.div>

          </div>
        </motion.div>
      </motion.div>

      {showSuccessModal && (
        <MessageBox
          onClose={()=>{}}
          code="green"
          title="Booking Cancelled"
          primaryAction={{ label: "View Customers", path: "/customers/" }}
          secondaryAction={{ label: "Go to Dashboard", path: "/dashboard" }}
        >The booking has been successfully cancelled</MessageBox>
      )}
    </>
  );
};
export default BookingCancelPopup;