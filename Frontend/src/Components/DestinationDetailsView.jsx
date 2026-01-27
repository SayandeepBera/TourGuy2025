import React, { useContext, useMemo, useState } from 'react'
import { LuCircleArrowLeft } from "react-icons/lu";
import BookingFormView from './User Protal/BookingFormView';
import { toast } from 'react-toastify';
import AuthContext from '../Context/Authentication/AuthContext';
import { useNavigate } from 'react-router-dom';

const DestinationDetailsView = ({ selectedDestination, showDestinationsList }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const { authToken, userRole } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!selectedDestination) {
    return null;
  }

  // Data mapping from selectedDestination
  const place = selectedDestination.place;
  const city = selectedDestination.city;
  const mapTitle = selectedDestination.mapTitle;
  const mapLink = selectedDestination.mapLink;
  const description = selectedDestination.description;
  const markings = selectedDestination.markings;
  const price = selectedDestination.price;
  const duration = selectedDestination.duration;
  const backgroundImage = selectedDestination.backgroundImage;
  const keyHighlights = selectedDestination.keyHighlights;

  // Calculate tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Logic to prevent entering invalid dates
  const handleDateChange = (e) => {
    setBookingDate(e.target.value);
  };

  // Logic to prevent entering invalid dates
  const validateDate = () => {
    if (!bookingDate) return;

    const selectedDateObj = new Date(bookingDate);
    const minDateObj = new Date(minDate);

    // Check if the date is actually valid and if it's in the past
    if (!isNaN(selectedDateObj.getTime())) {
      if (selectedDateObj < minDateObj) {
        toast.warning("Check-in is only available from tomorrow onwards.");
        setBookingDate("");
      }
    }
  };

  const handleBooking = () => {
    // Check user is login or not
    if (authToken && userRole === "tourist") {
      if (!bookingDate) {
        return toast.error("Please select a date first");
      }

      setIsModalOpen(true);
    } else {
      // toast.info();
      navigate('/login');
    }

  }

  const accommodationRatings = useMemo(() => {
    return keyHighlights.map(() => {
      return Math.floor(Math.random() * 2) + 4; // 4 or 5
    });
  }, [keyHighlights]);

  // Function to capitalize the first letter of each word
  const wordCapitalize = (words) => {
    return words.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="relative">
      {/* Back Button */}
      <div className="px-4 py-2 md:px-7 lg:px-9 lg:py-3">
        <button onClick={showDestinationsList} className="flex items-center font-semibold text-lg gap-2 text-gray-400 hover:text-white transition-colors duration-200">
          <LuCircleArrowLeft className="w-6 h-6" />
          Back to Destinations
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative w-full overflow-hidden mb-12">
        <img
          src={backgroundImage.url}
          className="w-full object-cover rounded-2xl"
          alt={city}
          style={{ height: "550px" }}
        />
        {/* <div className="absolute inset-0 bg-black/40"></div> */}
        <div className="absolute bottom-12 left-12 text-white z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold">{wordCapitalize(place)}, {wordCapitalize(city)}</h1>
          <h4 className="text-xl md:text-2xl font-semibold mt-2">{markings}</h4>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 mt-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Left Column (About & Highlights) - 8/12 = 2/3 width */}
          <div className="md:col-span-8">
            {/* About Section */}
            <h2 className="text-4xl font-bold mb-4 text-[#E2E8F0]">About {city}</h2>
            <p className="text-justify text-gray-300 mb-6 leading-relaxed pr-9">
              {description}
            </p>

            {/* Key Highlights List */}
            <ul className="list-disc text-[17px] list-inside space-y-3 mb-10">
              <li className="text-gray-300">
                <span className="font-semibold text-white">Duration:</span> {duration} Days
              </li>
              <li className="text-gray-300">
                <span className="font-semibold text-white">Best Price:</span> ₹ {price}
              </li>
              <li className="text-gray-300">
                <span className="font-semibold text-white">Key Highlights:</span>
                <ul className="list-unstyled fw-semibold space-y-1 ml-4 mt-2">
                  {keyHighlights.map((_, index) => (
                    <li key={index} className="flex items-center gap-2 text-lg text-[#00C4CC]">
                      <span className="text-2xl">💫</span> {keyHighlights[index].title}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>

          {/* Right Column (Booking Form) - 4/12 = 1/3 width */}
          <div className="md:col-span-4">
            <div className="p-6 rounded-xl bg-[#1A2437] shadow-2xl border border-gray-700">
              <h5 className="text-xl font-bold text-white mb-4">Book Your Journey</h5>

              {/* Check-in Date */}
              <label className="text-sm font-semibold text-gray-300 mb-1 block">Check-in Date</label>
              <div className='relative'>
                <input
                  type="date"
                  value={bookingDate}
                  min={minDate}
                  onChange={handleDateChange}
                  onBlur={validateDate}
                  className="w-full p-3 mb-3 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-accent-teal focus:border-accent-teal transition"
                />
                <span className="absolute right-3 top-2/5 -translate-y-1/2 text-white pointer-events-none">
                  📅
                </span>
              </div>

              {/* Booking Button (Simulated Link) */}
              <button
                className="w-full py-3 font-bold text-lg bg-[#00C4CC] rounded-xl shadow-lg hover:shadow-xl hover:bg-cyan-400 transform hover:scale-[1.01] transition-all duration-200 text-slate-900 cursor-pointer"
                onClick={handleBooking}
              >
                Book Now
              </button>

              <p className="text-[11px] text-[#00C4CC] my-3 ml-1 italic font-medium">
                * Bookings must be made at least 24 hours in advance.
              </p>

              <hr className="my-6 border-gray-700" />

              {/* Key Booking Highlights */}
              <h6 className="text-lg font-bold text-white mb-3">What's Included</h6>
              <ul className="list-unstyled space-y-2">
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-lg text-[#00C4CC]">🍴</span> Daily Lunch & Dinner
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-lg text-[#00C4CC]">🏨</span> Stay in Prime Locations
                </li>
                {keyHighlights.map((_, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-300">
                    <span className="text-lg text-[#00C4CC]">🔥</span> {keyHighlights[index].title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Accommodation Section */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 mt-16">
        <h3 className="text-center text-4xl text-[#E2E8F0] font-extrabold mb-8">Explore on This Tour</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {keyHighlights.map((_, index) => (
            <div key={index}>
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={keyHighlights[index].image.url}
                  className="w-full rounded-2xl object-cover hover:scale-105 transition-all duration-300"
                  alt={`keyHighlight${index + 1}`}
                  style={{ height: "260px" }}
                />
              </div>

              <div className="p-5">
                <h5 className="text-xl font-bold mb-1 text-white">{keyHighlights[index].title}</h5>
                <p className="text-yellow-500 mb-3">{"⭐".repeat(accommodationRatings[index])}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-20">
        <h3 className="text-center text-4xl text-[#E2E8F0] font-extrabold mb-8">{mapTitle}</h3>
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
          <iframe
            className="w-full"
            title={mapTitle}
            src={mapLink}
            allowFullScreen=""
            loading="lazy"
            style={{ height: "600px", border: 0 }}
          ></iframe>
        </div>
      </div>

      <BookingFormView
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        destination={selectedDestination}
        initialCheckIn={bookingDate}
        onBookingSuccess={() => setBookingDate("")}
      />
    </div>
  )
}

export default DestinationDetailsView
