# DineEase: Comprehensive Restaurant Ordering & Franchise Management Suite

**DineEase** is a robust platform designed to streamline restaurant franchise operations while delivering a seamless user experience. It empowers customers to browse multiple stores, manage orders, and interact with menus, while giving admins full control over store operations and analytics.

---

## Key Features

### For Users:
- Select and order from multiple stores within the franchise.
- View detailed item information, post reviews, and check reviews from other users.
- Add items to cart and place orders effortlessly.
- Manage multiple delivery addresses and update profile information.
- Track order status.
- Access and review past orders.
- Secure OTP-based user verification via email.
- Receive automated order confirmation emails for every purchase.

### For Admins:
- Independently manage pending orders for their registered store.
- View and track all past orders.
- Monitor sales performance with detailed analytics.
- Update profile and manage store details.
- Change order statuses and update menu item availability.
- Add new menu items by uploading images, with photos automatically processed and hosted via Cloudinary.

### Franchise Management:
- A unified solution allowing efficient management of multiple stores under a single franchise.
- Provides users with the flexibility to choose among various franchise locations with dynamic menus and real-time availability.

---

## Technology Stack

- **Frontend:** React, Tailwind CSS, Material UI  
- **Backend:** Express.js, Prisma ORM  
- **Database:** PostgreSQL  
- **Authentication:** JWT tokens combined with Email OTP verification  
- **Type Safety & Validation:** TypeScript for compile-time safety, Zod for runtime validation  
- **Deployment:** Render  
- **Third-Party Services:**  
  - Mailjet API for sending OTPs and order confirmation emails  
  - Cloudinary API for image uploads and URL generation  

---

## Installation without Docker

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` folder with the following environment variables:
   ```
   DATABASE_URL=
   API_SECRET=
   CLOUD_NAME=
   API_KEY=
   TAX_RATE=
   SHIPPING_COST=
   COD=
   JWT_SECRET=
   MAILJET_PUBLIC_KEY=
   MAILJET_PRIVATE_KEY=
   ```

4. Build the backend:
   ```bash
   npm run build
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

---

### Frontend Setup

1. Navigate to the frontend subfolder `DineEase`:
   ```bash
   cd frontend/DineEase
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `frontend/DineEase` folder with the following environment variables:
   ```
   VITE_TAX_RATE=
   VITE_SHIPPING_COST=
   VITE_COD=
   ```

4. Start the frontend in development mode:
   ```bash
   npm run dev
   ```

## Installation using Docker 

1. Create a `.env` file in the `backend` folder with the following environment variables:
   ```
   DATABASE_URL=
   API_SECRET=
   CLOUD_NAME=
   API_KEY=
   TAX_RATE=
   SHIPPING_COST=
   COD=
   JWT_SECRET=
   MAILJET_PUBLIC_KEY=
   MAILJET_PRIVATE_KEY=
   ```

2. Create a `.env` file in the `frontend/DineEase` folder with the following environment variables:
   ```
   VITE_TAX_RATE=
   VITE_SHIPPING_COST=
   VITE_COD=
   ```

3. Pull and run frontend and backend containers ( Frontend runs at port 5173 , Backend runs at port 3000 )
   ```bash
   docker compose pull
   docker compose up
   ```

---

> **Note:**  
> The `.env` files are **not included** in the repository and must be **created manually** with the required keys before running the application.

## Schema UML
![Schema UML Image](https://drive.google.com/uc?export=view&id=1ntsQM2ugJbvg1fB6tYHrfdFQ_Donm2Mm)









