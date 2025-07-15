E-Learning Platform (MEAN Stack)

An online learning platform built with Angular, Node.js, Express, and MongoDB, enabling users to browse, purchase, and enroll in courses. Features role-based dashboards for Admins, Instructors, and Students, including payment integration via Razorpay.

Features

Role-Based Access
- Admin: View overall stats, all courses, users.
- Instructor: Create/manage courses, view student progress.
- Student: Browse courses, enroll and track learning.

Core Functionality
- JWT-based Authentication
- Course creation with metadata (title, category, price, etc.)
- Role-specific dashboards
- Progress tracking and lesson completion
- Student notes and in-course quizzes
- Secure payments with Razorpay
- Admin & instructor analytics

Tech Stack

| Layer        | Technology                      |
|--------------|----------------------------------|
| Frontend     | Angular 16+, Bootstrap 5         |
| Backend      | Node.js, Express.js              |
| Database     | MongoDB Atlas                    |
| Auth         | JWT (JSON Web Token)             |
| Payment      | Razorpay API                     |
| Deployment   | Localhost      |

Setup Instructions

1. Clone the repo

git clone https://github.com/your-username/e-learning-platform.git
cd e-learning-platform

2. Backend Setup

cd backend
npm install

3. Create .env file:
PORT=5000
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

4. Run backend:

npm run dev

5. Frontend Setup
   
cd frontend
npm install
Create the environment.ts file in src/environments/:
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};

6. Run frontend:

npm run dev  # if using Vite
Note: If you're not using Vite, use ng serve.


🤝 Contributors
Aishika Majumdar and Soumavo Acharjee
