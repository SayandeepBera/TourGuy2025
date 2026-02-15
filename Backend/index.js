import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // dotenv package is used to load environment variables from a .env file

import { initSocket } from './socket.js';

import connectToMongo from './db.js';
import initCronTasks from './services/cronTasks.js';
import authRoutes from './router/auth.js';
import allDestinations from './router/dest.js';
import guideRoutes from './router/guides.js';
import bookingRoutes from './router/booking.js';
import userProfile from './router/userProfile.js';
import galleryRoutes from './router/gallery.js';
import conciergeRoutes from './router/concierge.js';
import chatRoutes from './Chat/conversation.js';

// Connect to MongoDB
connectToMongo();

// Initialize cron tasks
initCronTasks();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/destinations', allDestinations);
app.use('/api/guides', guideRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/userprofile', userProfile)
app.use('/api/gallery', galleryRoutes);
app.use('/api/concierge', conciergeRoutes);
app.use('/api/chat', chatRoutes);

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

server.timeout = 120000; // Set server timeout to 120 seconds

initSocket(server);