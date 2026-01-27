import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    destinationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destinations',
        required: true
    },
    guideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GuideProfile',
        required: true
    },
    destinationName: {
        type: String,
        required: true,
        trim: true
    },

    // Personal details from booking slides
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phoneNumber: {
        countryCode: {
            type: String,
            required: true
        },
        number: {
            type: String,
            required: true
        }
    },
    alternateNumber: {
        countryCode: {
            type: String,
            required: true
        },
        number: {
            type: String,
            required: true
        }
    },
    age: {
        type: Number,
        required: true,
        min: 18
    },
    gender: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    pinCode: {
        type: String,
        required: true,
        trim: true
    },
    languages: {
        type: [String],
        required: true
    },

    // Tour details
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    adults: {
        type: Number,
        required: true
    },
    children: {
        type: Number,
        required: true
    },
    document: {
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    specialRequests: {
        type: String
    },

    // Payment & Status
    totalAmount: {
        type: Number,
        required: true
    },
    // plan to take a platform fee later
    guideEarnings: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    bookingStatus: {
        type: String,
        enum: ['pending_guide_confirmation', 'confirmed', 'cancelled', 'completed', 'rejected_by_guide'],
        default: 'pending_guide_confirmation'
    },

    // Track which guide was originally assigned if reassignment happens
    originalGuideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GuideProfile'
    },
    transactionId: {
        type: String
    },
    completionPin: {
        type: String,
        required: true
    },

    // Activity Logs Status
    activityLog: [
        {
            type: {
                type: String,
                required: true
            },
            message: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]

}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
