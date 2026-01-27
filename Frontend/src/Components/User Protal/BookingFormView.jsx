import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuX, LuChevronRight, LuChevronLeft, LuUpload, LuUserCheck } from "react-icons/lu";
import { FaCheckCircle } from "react-icons/fa"; // Stable replacement for LuCheckCircle
import BookingSlide1 from './BookingSlide1';
import BookingSlide2 from './BookingSlide2';
import BookingSlide3 from './BookingSlide3';
import BookingSlide4 from './BookingSlide4';
import BookingContext from '../../Context/Booking/BookingContext';
import { loadRazorpay } from '../../utils/LoadRazorpay';
import { toast } from 'react-toastify';
import AuthContext from '../../Context/Authentication/AuthContext';
import { ImSpinner9 } from "react-icons/im";

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

const BookingFormView = ({ isOpen, onClose, destination, initialCheckIn, onBookingSuccess }) => {
    const [step, setStep] = useState(1);
    const { createBookingOrder, verifyPayment, isLoading } = useContext(BookingContext);
    const { userId } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        // Core References IDs
        userId: userId,
        destinationId: destination._id,
        destinationName: destination.place,

        // Personal Details
        fullName: '',
        email: '',
        phoneNumber: {
            countryCode: '',
            number: ''
        }, 
        alternateNumber: {
            countryCode: '',
            number: ''
        },
        age: '',
        gender: '',

        // Address Details
        address: '',
        city: '',
        state: '',
        country: '',
        pinCode: '',

        // Tour Details
        languages: '',
        checkIn: initialCheckIn || '',
        checkOut: '',
        adults: 1,
        children: 0,
        specialRequests: '',

        // Identification
        document: null,

        // Finance & Assignment
        totalAmount: 0,
        guideEarnings: 0,
        selectedGuideId: null
    });


    // set checkIn data
    useEffect(() => {
        if (initialCheckIn) {
            setFormData(prev => ({
                ...prev,
                checkIn: initialCheckIn
            }));
        }
    }, [initialCheckIn, isOpen]);

    // Reset form when modal is closed
    const resetForm = () => {
        setStep(1);
        setFormData({
            userId: userId,
            destinationId: destination._id,
            destinationName: destination.place,
            fullName: '',
            email: '',
            phoneNumber: { countryCode: '', number: '' },
            alternateNumber: { countryCode: '', number: '' },
            age: '',
            gender: '',
            address: '',
            city: '',
            state: '',
            country: '',
            pinCode: '',
            languages: '',
            checkIn: '',
            checkOut: '',
            adults: 1,
            children: 0,
            specialRequests: '',
            document: null,
            totalAmount: 0,
            guideEarnings: 0,
            selectedGuideId: null
        });
    };

    // Handle payment function
    const handlePayment = async () => {
        // Check if all required fields are filled or not
        if (!formData.fullName || !formData.email || !formData.checkIn || !formData.document) {
            return toast.error("Please complete all required fields");
        }

        // Calculate total and the guide's specific share (assuming a 10% platform fee for now)
        const totalAmount = destination.price * formData.adults;
        const platformFeePercent = 10;
        const calculatedGuideEarnings = totalAmount - (totalAmount * platformFeePercent / 100);

        // Load Razorpay Script
        const isRazorpayLoaded = await loadRazorpay();
        if (!isRazorpayLoaded) {
            return toast.error("Failed to load payment gateway. Please check your internet connection.");
        }

        const response = await createBookingOrder(totalAmount);

        if (response.success) {
            const orderData = response.result.order;

            const options = {
                key: RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: "INR",
                name: "TourGuy Travel",
                description: `Travel Booking for ${destination.place}`,
                order_id: orderData.id,

                handler: async (response) => {
                    try {
                        const data = new FormData();

                        // Razorpay signature details
                        data.append("razorpay_order_id", response.razorpay_order_id);
                        data.append("razorpay_payment_id", response.razorpay_payment_id);
                        data.append("razorpay_signature", response.razorpay_signature);

                        // Append the document file
                        data.append("document", formData.document);

                        // Core Booking Fields 
                        data.append("userId", userId);
                        data.append("destinationId", destination._id);
                        data.append("destinationName", destination.place);
                        data.append("fullName", formData.fullName);
                        data.append("email", formData.email);
                        data.append("age", formData.age);
                        data.append("gender", formData.gender);

                        // Contact Details
                        data.append("countryCode", formData.phoneNumber.countryCode);
                        data.append("number", formData.phoneNumber.number);

                        // Alternate Phone (Flat fields)
                        data.append("altCountryCode", formData.alternateNumber.countryCode);
                        data.append("altNumber", formData.alternateNumber.number);

                        // Address Details
                        data.append("address", formData.address);
                        data.append("city", formData.city);
                        data.append("state", formData.state);
                        data.append("country", formData.country);
                        data.append("pinCode", formData.pinCode);

                        // Tour Dates & People
                        data.append("checkIn", formData.checkIn);
                        data.append("checkOut", formData.checkOut);
                        data.append("adults", formData.adults);
                        data.append("children", formData.children);

                        // Array handling (Languages)
                        const langArray = typeof (formData.languages) === 'string'
                            ? formData.languages.split(',').map(l => l.trim()).filter(l => l !== "")
                            : formData.languages;

                        langArray.forEach(lang => data.append("languages", lang));

                        // Financial Details
                        data.append("totalAmount", totalAmount);
                        data.append("guideEarnings", calculatedGuideEarnings);

                        if (formData.selectedGuideId) {
                            data.append("selectedGuideId", formData.selectedGuideId);
                        }

                        console.log("Verifying payment with data:", [...data.entries()]);

                        // Verify the payment
                        const verification = await verifyPayment(data);

                        if (verification.success) {
                            toast.success(verification.msg, {
                                style: { borderRadius: '10px', background: '#03C203', color: '#fff' }
                            })

                            // Reset the form
                            resetForm();

                            // Close the modal
                            if(onClose) {
                                onClose();
                            }

                            // Callback on successful booking
                            if(onBookingSuccess) {
                                onBookingSuccess();
                            }
                        } else {
                            toast.error(verification.msg || "Payment verification failed. Please try again.", {
                                theme: "colored"
                            })
                        }
                    } catch (error) {
                        console.error("Error verifying payment:", error);
                        toast.error(error.message || "An error occurred during verification.", {
                            theme: "colored"
                        })
                    }
                },

                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.phoneNumber.number
                },
                theme: {
                    color: "#00C4CC"
                },
                modal: {
                    ondismiss: function () {
                        toast.info("Payment cancelled by user.");
                    }
                }
            }

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } else {
            toast.error(response.msg || "Could not initiate payment order.", {
                theme: "colored"
            })
        }
    }

    // To move to the next step
    const handleNext = () => {
        // For slide 1
        if (step === 1) {
            if (!formData.fullName || !formData.email || !formData.age || !formData.gender) {
                return toast.warn("Please fill in all personal information.");
            }

            // Basic email regex
            if (!/\S+@\S+\.\S+/.test(formData.email)) {
                return toast.error("Please enter a valid email address.");
            }

            // Age validation with Toast
            if (Number(formData.age) < 18) {
                console.log(formData.age);
                return toast.warning("Minimum age requirement is 18 years.");
            }
        }

        // For slide 2
        if (step === 2) {
            if (!formData.address || !formData.city || !formData.state || !formData.country || !formData.languages) {
                return toast.warn("Location and Language are required.");
            }
        }

        // For slide 3
        if (step === 3) {
            if (!formData.checkOut || !formData.document) {
                return toast.warn("Please fill Tour Details and upload your ID proof.");
            }
        }

        setStep(s => s + 1);
    }

    // Function to capitalize the first letter of each word
    const wordCapitalize = (words) => {
        return words.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    // Handle back step
    const handleBack = () => setStep(s => s - 1);

    // Close the modal
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-[88px] left-0 right-0 bottom-0 z-[100] flex items-center justify-center p-4 bg-[#05070c]/95 backdrop-blur-xl"
        >
            <motion.div
                initial={{ scale: 0.8, y: 100, rotateX: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, rotateX: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 50, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-6xl bg-[#141b2d] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_0_120px_rgba(0,196,204,0.4)] border border-white/10 flex flex-col md:flex-row max-h-[calc(100vh-120px)]"
            >
                {/* Left side */}
                <div className="hidden md:flex w-full md:w-[35%] bg-gradient-to-br from-[#00C4CC]/20 to-[#1A2437] py-6 px-6 lg:px-10 border-r border-gray-700 flex-col justify-between overflow-y-auto custom-scrollbar">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-4">Confirm Your Trip</h2>

                        <div className="space-y-5">
                            <img
                                src={destination.placeImage?.url || destination.backgroundImage?.url}
                                alt={destination.place}
                                className="w-full h-44 object-cover rounded-2xl border-2 border-[#00C4CC]/30 shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
                            />
                            <div className="mb-4">
                                <p className="text-[#00C4CC] font-bold text-xs uppercase tracking-widest">Destination</p>
                                <h3 className="text-2xl text-white font-extrabold">{wordCapitalize(destination.place)}</h3>
                            </div>

                            <div className="flex justify-between border-y border-gray-700/50 py-3">
                                <div>
                                    <p className="text-gray-400 text-xs uppercase">Check-in</p>
                                    <p className="text-white font-semibold">{formData.checkIn || 'Not selected'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400 text-xs uppercase">Est. Price</p>
                                    <p className="text-[#00C4CC] text-2xl font-black">₹ {destination.price * formData.adults}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step Indicators placed in a 2x2 Grid at the bottom of the left column */}
                    <div className="mt-4 bg-black/20 px-5 py-3 rounded-[2rem] border border-white/5 shadow-inner">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {[1, 2, 3, 4].map((num) => (
                                <div
                                    key={num}
                                    className={`flex flex-col items-center text-center gap-1 transition-all duration-500 ${step >= num ? 'opacity-100 scale-100' : 'opacity-30 scale-95'}`}
                                >
                                    {/* Step Circle */}
                                    <div className={`w-9 h-9 rounded-2xl border-2 flex items-center justify-center text-sm font-black transition-all duration-300 shadow-lg ${step >= num
                                        ? 'bg-[#00C4CC] border-[#00C4CC] text-[#0F172A] shadow-[#00C4CC]/20'
                                        : 'border-gray-600 text-gray-500'
                                        }`}>
                                        {step > num ? <FaCheckCircle size={18} /> : num}
                                    </div>

                                    {/* Step Label */}
                                    <span className={`font-black text-[10px] uppercase tracking-tighter leading-tight h-8 flex items-center ${step === num ? 'text-white' : 'text-gray-500'
                                        }`}>
                                        {num === 1 ? 'Personal Info' :
                                            num === 2 ? 'Location' :
                                                num === 3 ? 'Tour Details' :
                                                    'Guide Selection'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right side */}
                <div className="w-full md:w-[65%] py-6 px-4 md:px-8 relative flex flex-col bg-[#1A2437] overflow-hidden">
                    <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-50">
                        <LuX size={28} />
                    </button>

                    <div className="flex-1 overflow-y-auto pr-3 px-3 custom-scrollbar mt-8">
                        <AnimatePresence mode="wait" custom={step}>
                            <motion.div
                                key={step}
                                custom={step}
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -50, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="h-full"
                            >
                                {step === 1 && <BookingSlide1 formData={formData} setFormData={setFormData} />}
                                {step === 2 && <BookingSlide2 formData={formData} setFormData={setFormData} />}
                                {step === 3 && <BookingSlide3 formData={formData} setFormData={setFormData} destination={destination} />}
                                {step === 4 && <BookingSlide4 formData={formData} setFormData={setFormData} />}

                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer Navigation */}
                    <div className="mt-4 pt-6 border-t border-gray-800 flex justify-between items-center">
                        {step > 1 ? (
                            <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-white font-bold transition-all">
                                <LuChevronLeft size={20} /> Previous
                            </button>
                        ) : <div />}

                        {step < 4 ? (
                            <button onClick={handleNext} className="bg-[#00C4CC] text-[#0F172A] px-10 py-4 rounded-xl font-black flex items-center gap-2 hover:bg-cyan-400 transition-all transform hover:scale-105 shadow-xl shadow-cyan-900/20">
                                Next Step <LuChevronRight size={20} />
                            </button>
                        ) : (
                            <button
                                onClick={handlePayment}
                                className="bg-[#00C4CC] text-[#0F172A] px-14 py-4 rounded-xl font-black flex items-center gap-2 hover:bg-green-400 transition-all transform hover:scale-105 shadow-xl shadow-green-900/20"
                            >
                                {isLoading ? <ImSpinner9 className="animate-spin mx-auto" /> : "Confirm & Pay"}

                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

        </motion.div>
    )
}

export default BookingFormView
