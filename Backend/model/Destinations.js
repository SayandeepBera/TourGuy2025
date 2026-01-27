import mongoose, { Schema } from "mongoose";

// Define a schema for images 
const imageSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    },
    format: { 
        type: String 
    }
}, {_id: false});

// Define a schema for key highlights
const keyHighlightSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: imageSchema,
        required: true
    }
}, {_id: false});

// Define the main destination schema
const destinationSchema = new Schema({
    place: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    placeImage: {
        type: imageSchema,
        required: true
    },
    city: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    country: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    type: {
        type: String,
        enum : ["National", "International"],
        default: "National",
        required: true,
    },
    duration: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        enum: ["Mountain", "History", "Forest", "Beach", "Desert", "Adventurous", "Other"],
        required: true,  
    },
    markings: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    keyHighlights: {
        type: [keyHighlightSchema],
        required: true,
    },
    backgroundImage: {
        type: imageSchema,
        required: true
    },
    mapTitle: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    mapLink: {
        type: String,
        required: true
    }
    
}, {timestamps: true});

export default mongoose.model('Destinations', destinationSchema);