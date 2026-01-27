import React from 'react'

const TopReview = () => {
    const reviews = [
        { 
            name: 'Sarah K., New York', 
            quote: 'The security features are incredible. Seeing Guide **Jane** arrive on the map and using the OTP was far more reassuring than any other travel app.' 
        },
        { 
            name: 'David L., Berlin', 
            quote: 'Absolutely professional experience. Guide **Rahul** was excellent, and the ability to give feedback directly on the website afterward is a big plus.' 
        },
        { 
            name: 'Priya S., Singapore', 
            quote: 'The specialist matching worked perfectly—found a historical architecture guide instantly. It truly feels like a premium, trackable service.' 
        }
    ]
    return (
        <div className="py-16 md:py-18 lg:py-20 px-4">
            <div className="max-w-8xl mx-auto px-6 sm:px-10 lg:px-20">
                <h2 className="text-[1.65rem] md:text-[2rem] lg:text-[2.45rem] font-extrabold text-white text-center mb-12">Trusted by Travelers Worldwide</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review, index)=>(
                        <div key={index} className="bg-[#1A2437] rounded-xl p-8 border-l-4 border-[#00C4CC] shadow-xl group hover:shadow-2xl shadow-[#00C4CC]/30 transition duration-300">
                            <span className="mb-2 inline-block">⭐⭐⭐⭐⭐</span>
                            <p className="italic text-lg text-gray-300 mb-4" dangerouslySetInnerHTML={{ __html: review.quote.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                            <h3 className="text-xl font-bold text-white mb-1">- {review.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TopReview
