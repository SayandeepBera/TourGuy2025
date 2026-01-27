import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarDay, FaCheckCircle, FaRupeeSign, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import BookingContext from '../../Context/Booking/BookingContext';
import BookingLogsTable from './BookingLogsTable';

const AdminBookingHistory = ({ onBack }) => {
  const { getAllBookings, getTodayBookings, getRevenueStats, isLoading } = useContext(BookingContext);

  const [allBookings, setAllBookings] = useState([]);
  const [todayCount, setTodayCount] = useState(0);
  const [revenueData, setRevenueData] = useState({ totalRevenue: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState('all');

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Function to load dashboard data  
  const loadDashboardData = async () => {
    try {
      const [resAll, resToday, resStats] = await Promise.all([
        getAllBookings(),
        getTodayBookings(),
        getRevenueStats()
      ]);

      // set data
      if (resAll.success) setAllBookings(resAll.result.bookings);
      if (resToday.success) setTodayCount(resToday.result.count);
      if (resStats.success) setRevenueData(resStats.result.stats);
    } catch (error) {
      toast.error("Critical error loading administrative data.");
    }
  };

  // Filter data based on search term
  const filteredData = allBookings.filter(booking => {
    const matchesSearch =
      booking.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());

    if (viewMode === 'today') {
      const isToday = new Date(booking.createdAt).toDateString() === new Date().toDateString();
      return matchesSearch && isToday;
    }

    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-4 md:p-8 font-[fangsong]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="flex items-center gap-5">
          <button onClick={onBack} className="p-3 bg-slate-800 rounded-2xl hover:bg-[#00C4CC] transition-all group">
            <FaArrowLeft className="group-hover:text-[#0F172A]" />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight italic">Booking Ledger</h1>
            <p className="text-gray-400 text-sm">Real-time synchronization with BookingAPI</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search Name or ID..."
              className="bg-[#1E293B] border border-gray-700 rounded-2xl py-3 pl-12 pr-4 w-full focus:border-[#00C4CC] outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { id: 'all', label: "Lifetime Bookings", val: allBookings.length, icon: <FaCheckCircle />, color: "text-green-400", bg: "from-green-500/10" },
          { id: 'today', label: "Bookings (Today)", val: todayCount, icon: <FaCalendarDay />, color: "text-blue-400", bg: "from-blue-500/10" },
          { id: 'revenue', label: "Net Platform Revenue", val: `₹${(revenueData?.totalRevenue || 0).toLocaleString()}`, icon: <FaRupeeSign />, color: "text-[#00C4CC]", bg: "from-cyan-500/20" },
        ].map((stat, i) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            onClick={() => stat.id !== 'revenue' && setViewMode(stat.id)}
            className={`bg-gradient-to-br ${stat.bg} to-[#1E293B] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl cursor-pointer hover:scale-[1.03] transition-all relative overflow-hidden group ${viewMode === stat.id ? 'ring-2 ring-[#00C4CC]' : ''}`}
          >
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-2">{stat.label}</p>
                <h3 className="text-4xl font-black group-hover:text-[#00C4CC] transition-colors">{stat.val}</h3>
              </div>
              <div className={`${stat.color} text-5xl opacity-30 group-hover:opacity-100 transition-opacity`}>{stat.icon}</div>
            </div>
            <div className="absolute -right-6 -bottom-6 text-9xl opacity-5 transform rotate-12">{stat.icon}</div>
          </motion.div>
        ))}
      </div>

      {/* Booking Table Component */}
      <BookingLogsTable
        data={filteredData}
        isLoading={isLoading}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
    </div>
  );
};

export default AdminBookingHistory;