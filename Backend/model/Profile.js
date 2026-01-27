import mongoose, { Schema } from "mongoose";

const userProfileSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    avatar: {
        url: {
            type: String,
            default: ""
        },
        public_id: {
            type: String,
            default: ""
        },
    },
    fullName: { 
        type: String, 
        trim: true 
    },
    phoneNumber: { 
        countryCode: {
            type: String,
        },
        number: {
            type: String,
        }
    },
    bio: { 
        type: String,  
    },
    gender: { 
        type: String, 
        enum: ['Male', 'Female', 'Other'] 
    },
    address: { 
        type: String 
    },
    state: { 
        type: String 
    },
    country: { 
        type: String 
    },
    pinCode: { 
        type: String 
    },
    languages: {
        type: [String],
    },
    socialLinks: {
        instagram: { type: String, default: "" },
        twitter: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        facebook: { type: String, default: "" }
    }
}, { timestamps: true });

export default mongoose.model('UserProfile', userProfileSchema);