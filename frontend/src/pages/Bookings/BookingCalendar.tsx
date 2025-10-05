import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import InnerHeader from "../../components/Shared/InnerHeader";
import reserve from "../../assets/images/reserve.png";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EmptyBlock from "../../components/Shared/EmptyBlock";
import { getBookingsCalendar } from "../../api/bookingApi";
import { BookingsCalendar } from "../../interfaces/Booking";
import loader from '../../assets/images/loader.gif'

const localizer = momentLocalizer(moment);

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
};

const today = new Date();
const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

const threeMonthsLater = new Date(startOfMonth);
threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);


const todayFormatted = formatDate(startOfMonth);
const threeMonthsLaterFormatted = formatDate(threeMonthsLater);

const CustomToolbar: React.FC<any> = (toolbar) => {
    
  const goToBack = () => toolbar.onNavigate("PREV");
  const goToNext = () => toolbar.onNavigate("NEXT");
  const goToToday = () => toolbar.onNavigate("TODAY");
  
 
  return (
    <div className="flex justify-between items-center mb-4 px-4 py-2 bg-gray-50 rounded-md shadow-sm">
      <div className="text-lg font-semibold text-gray-800">{toolbar.label}</div>
      <div className="flex gap-2">
        <button onClick={goToBack} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium flex items-center gap-1">
          <ChevronLeft size={16} /> Back
        </button>
        <button onClick={goToToday} className="px-3 py-1 bg-purple text-white rounded hover:bg-blue-600 text-sm font-medium flex items-center gap-1">
          Today
        </button>
        <button onClick={goToNext} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium flex items-center gap-1">
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

const BookingCalendar: React.FC = () => {
    const [bookings, setBookings] = useState<BookingsCalendar[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<BookingsCalendar | null>(null);

     const [loading, setLoading] = useState(true);

   //Fetching Bookings
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await getBookingsCalendar(todayFormatted, threeMonthsLaterFormatted);
        setBookings(data as BookingsCalendar[]);
      } catch (error) {
        console.error("Failed to fetch booking:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const handleSelectEvent = (event: BookingsCalendar) => {
    setSelectedEvent(event);
  };

  //Setting Up Loading
  if (loading) return(
    
     <div className="card rounded-lg shadow-md overflow-hidden">
            <p className="flex items-center justify-center h-full">
              <img className="mx-auto w-[20%]" src={loader}/>
            </p>
      </div>

  )

  return (

    <div className="flex-1 overflow-y-auto p-4 bg-gray-100 main-bg">
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
      <InnerHeader 
        title="Booking Calendar" 
        breadcrum="Bookings ➞ Calendar" 
        icon={reserve}
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
      <div className="lg:col-span-8 card float-left bg-white rounded-lg shadow-md overflow-hidden" style={{ minHeight: '75vh'}}>
        
      <Calendar
        localizer={localizer}
        events={bookings}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        views={['month', 'week']} 
        onSelectEvent={handleSelectEvent}
        components={{ toolbar: CustomToolbar }}
        eventPropGetter={(event) => {
          let backgroundColor = "";
            switch (event.status) {
              case "Paid":
                backgroundColor = "#3ec397";
                break;
              case "Cancelled":
                backgroundColor = "#f56565"; 
                break;
              default:
                backgroundColor = "rgb(172 130 215)"; 
            }
          return {
            style: {
              backgroundColor: backgroundColor,
              color: "#fff",
              borderRadius: "6px",
              border: "none",
              padding: "4px",
              fontSize: "12px",
            },
          };
        }}
      />
      </div>

      {/* <div className="lg:col-span-2 float-right rounded-lg shadow">
        <div className="mb-4">
            <EmptyBlock title="Paid Bookings:" value="10" />
        </div>
        <div className="mb-4">
            <EmptyBlock title="UnPaid Bookings:" value="15" />
        </div>
        <div className="mb-4">
            <EmptyBlock title="Booking Cancelled:" value="3" />
        </div>
        <div className="mb-4">
            <EmptyBlock title="Contract Conversion:" value="90%" />
        </div>
        <div className="mb-4">
            <EmptyBlock title="Most Popular Source:" value="Website" />
        </div>
      </div> */}
    </div>
  </div>
  );
};

export default BookingCalendar;
