# 🚀 CBSE Recheck & Re-evaluation Advisor

An enterprise-grade educational guidance web application designed to help CBSE Class 10 & 12 students strategically evaluate their board exam answer sheets, identify grading & step-marking anomalies, and assess exact rechecking feasibility before submitting official board applications.

---

## ✨ Features

* **Expert Double-Mark Evaluation**: Analyzes subject answer keys for missing marks, incorrect additions, and omitted step marking.
* **Razorpay Real-time Checkout**: Fully integrated live payment flows validating secure transaction callbacks.
* **Educational Disclaimer Banner**: Standard prominent inline banner complying with educational guidance policies.
* **120+ Searchable Autocomplete Subjects**: Deep data-rich searchable inputs showing candidate populations and course codes on subject selection.
* **Interactive Admin Dashboard**: Full admin portal to review uploaded mark sheets, add expert advice, change application states, and manage communication threads.
* **Helmet & Rate-Limited Security**: Core security filters and brute-force restrictions built in at the API level.

---

## 🛠️ Tech Stack

* **Frontend**: React.js, Vite, TailwindCSS (for modern layouts), Framer Motion (for premium writing animations).
* **Backend**: Node.js, Express, Mongoose (MongoDB Atlas multi-tenant driver).
* **Services**: Cloudinary (Secure document hosting), Nodemailer (Gmail SMTP transactional notification engine), Razorpay API.

---

## 🚀 Getting Started

### 1. Prerequisites
* Node.js (v18)
* MongoDB Atlas Cluster

### 2. Local Setup
Clone the repository:
```bash
git clone https://github.com/rezosnd/cbse-recheck.git
cd cbse-recheck
```

#### Frontend Configuration (`client/.env`):
```ini
VITE_RAZORPAY_KEY_ID=your_live_key
VITE_GOOGLE_CLIENT_ID=your_google_id
```

#### Backend Configuration (`server/.env`):
```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
SMTP_EMAIL=your_email
SMTP_PASSWORD=your_app_password
RAZORPAY_KEY_ID=your_live_key
RAZORPAY_KEY_SECRET=your_live_secret
```

### 3. Run Dev Server
Launch both clients simultaneously or independently:
```bash
# In client directory
npm run dev

# In server directory
npm run dev
```

---

## ☁️ Deployment

* **Frontend**: Hosted on **Vercel** (`recheck.veritasco.tech`) utilizing dynamic API rewrites (`vercel.json`).
* **Backend**: Hosted on **AWS EC2** behind an **Nginx** reverse proxy, managed by **PM2** process controllers with let's encrypt **SSL certificates**.
