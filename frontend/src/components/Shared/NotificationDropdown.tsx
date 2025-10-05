import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const NotificationDropdown = () => {

// Notification type
interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
  }
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  
   // Sample notifications
   const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'New Booking', message: 'You have a new booking from John Doe', time: '5 min ago', read: false },
    { id: '2', title: 'Payment Received', message: 'Payment of $350 received from Sarah Smith', time: '1 hour ago', read: false },
    { id: '3', title: 'Booking Cancelled', message: 'Booking #12457 has been cancelled', time: '3 hours ago', read: true },
    { id: '4', title: 'System Update', message: 'System will be updated on 25th Dec', time: '1 day ago', read: true },
  ]);

     // Count unread notifications
  const unreadNotificationsCount = notifications.filter(notification => !notification.read).length;
  
  const markAllNotificationsAsRead = () => {};

  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {

      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setNotificationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (

    <div className="relative" ref={notificationDropdownRef}>
                <button 
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative"
                  onClick={toggleNotificationDropdown}
                >
                  <Bell size={20} />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}
                </button>
                
                {/* Notification Dropdown with modern animation */}
                <div 
                  className={`
                    absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50
                    transition-all duration-300 ease-in-out origin-top-right
                    ${notificationDropdownOpen 
                      ? 'opacity-100 scale-100 translate-y-0' 
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
                  `}
                >
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {unreadNotificationsCount} new
                      </span>
                    </div>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/30' : ''}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800">{notification.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <span className="text-xs text-gray-500 mt-2 block">{notification.time}</span>
                            </div>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 bg-gray-50 text-center">
                    <button 
                      onClick={markAllNotificationsAsRead}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>
              </div>
  )
}

export default NotificationDropdown