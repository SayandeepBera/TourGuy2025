<div align="center">

# 🌍 TourGuy

### A Full-Stack Tour Booking Platform with Smart Guide Assignment

[![React](https://img.shields.io/badge/React.js-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)

</div>

## 🧭 Overview

**TourGuy** is a modern, full-stack tour booking platform that connects travelers with professional tour guides. It features a dual guide-assignment system — both automated (AI-driven matching) and manual (admin-controlled) — to ensure seamless tour management. With real-time updates via Socket.io, secure JWT authentication, and an intuitive UI, TourGuy delivers a smooth experience for travelers, guides, and administrators alike.
> 🌐 **Deployed & Live →** [tourguy-frontend.onrender.com](https://tourguy-frontend.onrender.com)
---

## ✨ Features

### 👤 For Travelers
- Browse and search available tours by destination, date, and category
- Secure booking workflow with real-time confirmation
- View assigned guide profiles and contact details
- Track booking status with live updates

### 🧑‍💼 For Tour Guides
- Manage personal availability and tour schedule
- Receive real-time booking notifications
- View and respond to assigned tour requests

### 🛠️ For Admins
- Dashboard to oversee all bookings and guide assignments
- **Automated Assignment** — system auto-matches guides based on availability and expertise
- **Manual Assignment** — override and assign guides directly from the admin panel
- Monitor platform activity with analytics overview

### 🔐 Core Platform
- JWT-based secure authentication & role-based access control
- Real-time WebSocket communication via Socket.io
- Optimized backend workflows for fast response times
- Fully responsive UI built with Tailwind CSS

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Real-Time** | Socket.io |
| **Auth** | JSON Web Tokens (JWT) |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│              React.js  +  Tailwind CSS                  │
└──────────────────────┬──────────────────────────────────┘
                       │  HTTP / WebSocket
┌──────────────────────▼──────────────────────────────────┐
│                      SERVER                             │
│              Node.js  +  Express.js                     │
│                                                         │
│  ┌──────────────┐   ┌───────────────┐   ┌───────────┐  │
│  │  REST API    │   │  Socket.io    │   │  Auth     │  │
│  │  (Bookings,  │   │  (Real-time   │   │  (JWT +   │  │
│  │   Tours,     │   │   Notifs)     │   │   RBAC)   │  │
│  │   Guides)    │   └───────────────┘   └───────────┘  │
│  └──────────────┘                                       │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                     DATABASE                            │
│                     MongoDB                             │
└─────────────────────────────────────────────────────────┘
```
---
<div align="center">
Made with ❤️ by Sayandeep Bera(https://github.com/SayandeepBera)
 
⭐ If you found this project helpful, please give it a star!
 
</div>
