import React, { useState, useMemo, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    FileText,
    UserCheck,
    CreditCard,
    ShieldQuestion,
} from 'lucide-react';
import AuthContext from '../Context/Authentication/AuthContext';

const FAQ = ({ searchQuery, activeTab, setActiveTab }) => {
    const [openFaq, setOpenFaq] = useState(null);
    const { userRole } = useContext(AuthContext);

    const categories = [
        { id: "bookings", icon: <FileText size={20} />, label: "Bookings" },
        { id: "guides", icon: <UserCheck size={20} />, label: "Guides" },
        { id: "payments", icon: <CreditCard size={20} />, label: "Payments" },
        { id: "safety", icon: <ShieldQuestion size={20} />, label: "Safety" },
    ];

    // ---- Tourist FAQs Data ----
    const touristFaqs = {
        bookings: [
            { q: "How do I cancel a confirmed booking?", a: "Navigate to 'Dashboard' > 'My Trips'. Select the booking and click 'Cancel'. Full refunds are issued if cancelled 48 hours prior to the start time." },
            { q: "Can I change my tour date after booking?", a: "Yes, date changes are possible if the guide is available on the new date. Use the 'Request Change' button in your booking details." },
            { q: "What happens if my guide cancels?", a: "If a guide cancels, our system automatically triggers a high-priority reassignment to find a replacement. If none is found, a 100% refund is processed immediately." },
            { q: "Can I book for a large group?", a: "Currently, our standard bookings support up to 10 people. For larger corporate groups, please contact our Concierge team." }
        ],
        guides: [
            { q: "How do I know my guide is qualified?", a: "Every TourGuy guide undergoes a manual 5-step vetting process including ID verification, criminal background checks, and local knowledge assessments." },
            { q: "Can I communicate with my guide before the trip?", a: "Yes, once a booking is 'Pending Confirmation' or 'Confirmed', a secure chat window opens in your dashboard." },
            { q: "What languages do the guides speak?", a: "Guides list their fluent languages on their profiles. Our 'Smart Match' system ensures you are paired with someone who speaks your preferred language." },
            { q: "Can I tip my guide through the app?", a: "Currently, tips are handled in person. 100% of the tip goes directly to your guide." }
        ],
        payments: [
            { q: "What payment methods do you accept?", a: "We process all major Credit/Debit cards, UPI, and Netbanking through our secure partner, Razorpay." },
            { q: "Is my payment information secure?", a: "TourGuy never stores your card details. All transactions are encrypted and handled by PCI-DSS compliant payment gateways." },
            { q: "How do refunds work?", a: "Refunds are credited back to the original payment source within 5-7 business days." },
            { q: "Are there any hidden service fees?", a: "No. The price you see during checkout is the final price, inclusive of all taxes and service charges." }
        ],
        safety: [
            { q: "What should I do in an emergency?", a: "Every active booking has an 'Emergency SOS' button. Clicking this alerts our 24/7 safety team and provides your GPS coordinates." },
            { q: "Is my phone number shared with the guide?", a: "No. We use an in-app calling and messaging system to keep your personal contact information private." },
            { q: "How are guides screened for safety?", a: "Beyond document checks, we maintain a strict rating system. Any guide falling below a 4.5-star safety rating is temporarily suspended for review." },
            { q: "Can I travel solo with these guides?", a: "Yes, we have a 'Solo-Traveler Certified' badge for guides who have specifically passed our safety training for solo tourists." }
        ]
    };

    // ---- Guide FAQs Data ----
    const guideFaqs = {
        bookings: [
            { q: "How do I accept a new tour request?", a: "New requests appear in your 'Guide Dashboard' and via email. You have 4 hours to 'Accept' or 'Decline'. Quick responses improve your profile ranking." },
            { q: "What if I need to cancel a booking?", a: "Cancellations impact your reliability score. If you must cancel, do so at least 24 hours in advance via the dashboard to allow our system to find a replacement guide for the tourist." },
            { q: "Can I suggest a different meeting point?", a: "Yes. Once a booking is confirmed, you can use the in-app chat to coordinate with the tourist and suggest a more convenient or safer meeting location." },
            { q: "What happens if a tourist is late?", a: "We advise waiting for 30 minutes. If the tourist hasn't arrived or responded to messages by then, you can mark the tour as a 'No-Show' via the app to receive partial compensation." }
        ],
        guides: [
            { q: "How long does the verification process take?", a: "Verification typically takes 24-48 business hours. Our team manually reviews your government ID, certifications, and language proficiency before granting 'Approved' status." },
            { q: "How do I improve my profile visibility?", a: "Ensure your bio is detailed, your profile photo is professional, and you maintain a high response rate. High ratings from previous tours also push your profile to the top of search results." },
            { q: "Can I work as a guide part-time?", a: "Absolutely. You can toggle your availability 'Online' or 'Offline' at any time. You are in full control of your schedule." },
            { q: "What certifications do I need to join?", a: "While local passion is key, we prioritize guides with valid regional tour guide licenses or specialized certifications (e.g., first aid, history, or trekking)." }
        ],
        payments: [
            { q: "When do I receive my earnings?", a: "Earnings are released 24 hours after a tour is marked as 'Completed' by both parties. Funds are usually visible in your linked bank account within 2-3 business days." },
            { q: "Does TourGuy take a commission?", a: "We charge a 15% platform fee. This covers insurance for your tours, marketing to bring you more tourists, and our 24/7 support infrastructure." },
            { q: "How can I see my total monthly earnings?", a: "Your 'Earnings' tab provides a detailed breakdown of completed tours, pending payments, and downloadable monthly statements for your records." },
            { q: "Are taxes deducted from my payouts?", a: "Guides are considered independent contractors. You are responsible for reporting and paying your own local taxes, though we provide the necessary summary documents." }
        ],
        safety: [
            { q: "What should I do if a tourist is disrespectful?", a: "Your safety is paramount. You have the right to end a tour immediately if a tourist becomes abusive or acts inappropriately. Report the incident through the 'Urgent Report' button for immediate investigation." },
            { q: "Does TourGuy provide insurance for guides?", a: "Yes, approved guides are covered under our 'Tour Protector' insurance policy during active bookings, covering accidental liability." },
            { q: "How do I report a safety concern about a location?", a: "If a suggested destination in the tour plan feels unsafe due to local conditions, notify the tourist and our support team immediately to suggest an alternative route." },
            { q: "Is my personal contact information shared?", a: "No. Our system uses masked calling and in-app messaging. Tourists never see your private phone number or personal address." }
        ]
    };

    // Check which FAQs to use based on user role
    const currentFaqs = userRole === "tourist" ? touristFaqs : guideFaqs;

    // Search Logic Implementation
    const filteredFaqs = useMemo(() => {
        if (!searchQuery) {
            return currentFaqs[activeTab];
        }

        // Search across ALL categories if searching
        const allFaqs = Object.values(currentFaqs).flat();
        return allFaqs.filter(faq =>
            faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.a.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, activeTab]);

    return (
        <div className="py-20 px-6 max-w-5xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-black italic mb-4 text-white/90">Frequently Asked Questions</h2>

                {/* Tabs */}
                {!searchQuery && (<div className="flex flex-wrap justify-center gap-2 mt-8">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === cat.id
                                ? "bg-[#00C4CC] text-[#0F172A]"
                                : "bg-white/5 text-gray-400 hover:bg-white/10"
                                }`}
                        >
                            {cat.icon} {cat.label}
                        </button>
                    ))}
                </div>)}
            </div>

            <motion.div layout className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <motion.div
                                layout
                                key={faq.q}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="mb-4"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full p-4 lg:p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-between hover:bg-white/[0.05] transition-all text-left"
                                >
                                    <span className="font-bold text-lg pr-4">{faq.q}</span>
                                    <motion.div
                                        animate={{ rotate: openFaq === index ? 180 : 0 }}
                                    >
                                        <ChevronDown className="text-[#00C4CC]" />
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                    {openFaq === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-6 lg:p-8 text-gray-400 leading-relaxed border-x border-b border-white/5 rounded-b-3xl -mt-4 bg-white/[0.01]">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <ShieldQuestion size={60} className="mx-auto text-gray-700 mb-4" />
                            <p className="text-gray-500 text-xl italic">No results found for "{searchQuery}"</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}

export default FAQ
