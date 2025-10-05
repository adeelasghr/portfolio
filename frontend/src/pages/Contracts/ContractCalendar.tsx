import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import InnerHeader from "../../components/Shared/InnerHeader";
import reserve from "../../assets/images/reserve.png";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EmptyBlock from "../../components/Shared/EmptyBlock";
import { getContractCalendar } from "../../api/contractApi";
import { ContractsCalendar } from "../../interfaces/Contract";
import loader from '../../assets/images/loader.gif'

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
};

const localizer = momentLocalizer(moment);

interface BookingEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description: string;
  allDay?: boolean;
  status: "Paid" | "Unpaid" | "Cancelled";
}

const sampleEvents: BookingEvent[] = [
  {
    id: 1,
    title: "CNT0023",
    start: new Date(2025, 3, 12, 9, 0),
    end: new Date(2025, 3, 15, 17, 0),
    description: "Annual business conference across 3 days.",
    status: "Unpaid"
  },
  {
    id: 2,
    title: "CNT019",
    start: new Date(2025, 3, 10, 14, 0),
    end: new Date(2025, 3, 13, 15, 0),
    description: "Meeting with potential client to discuss project.",
    status: "Paid"
  }
  ,
  {
    id: 2,
    title: "CNT005",
    start: new Date(2025, 3, 20, 14, 0),
    end: new Date(2025, 3, 21, 15, 0),
    description: "Meeting with potential client to discuss project.",
    status: "Cancelled"
  },
  {
    id: 2,
    title: "CNT001",
    start: new Date(2025, 3, 23, 14, 0),
    end: new Date(2025, 3, 26, 15, 0),
    description: "Meeting with potential client to discuss project.",
    status: "Paid"
  }
];

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

const today = new Date();
const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

const threeMonthsLater = new Date(startOfMonth);
threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);


const todayFormatted = formatDate(startOfMonth);
const threeMonthsLaterFormatted = formatDate(threeMonthsLater);

const ContractCalendar: React.FC = () => {
   const [bookings, setBookings] = useState<ContractsCalendar[]>([]);
   const [selectedEvent, setSelectedEvent] = useState<ContractsCalendar | null>(null);
  
       const [loading, setLoading] = useState(true);

     //Fetching Bookings
    useEffect(() => {
      const loadContracts = async () => {
        try {
          const data = await getContractCalendar(todayFormatted, threeMonthsLaterFormatted);
          setBookings(data as ContractsCalendar[]);
        } catch (error) {
          console.error("Failed to fetch contract:", error);
        } finally {
          setLoading(false);
        }
      };
  
      loadContracts();
    }, []);

  const handleSelectEvent = (event: ContractsCalendar) => {
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
        title="Contract Calendar" 
        breadcrum="Contract ➞ Calendar" 
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
                    case "Active":
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
            <EmptyBlock title="Active Contracts:" value="10" />
        </div>
        <div className="mb-4">
            <EmptyBlock title="Uplcoming Contracts:" value="15" />
        </div>
        <div className="mb-4">
            <EmptyBlock title="Completed Contracts:" value="39" />
        </div>
        <div className="mb-4">
            <EmptyBlock title="Contracts Cancelled:" value="2" />
        </div>
        <div className="mb-4">
            <EmptyBlock title="Booked Vehicles:" value="23" />
        </div>
      </div> */}
    </div>
  </div>
  );
};

export default ContractCalendar;
