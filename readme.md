# 🚗 CarConnect: Vehicle Rental System API

**CarConnect** is a robust and secure backend API for managing a vehicle rental service. It handles everything from user authentication and vehicle inventory management to booking creation, price calculation, and role-based access control.

## 🎯 Project Overview

The system is designed to provide a comprehensive management solution for a vehicle rental business. It features a modular architecture with a clear separation of concerns, supporting two main user roles: **Admin** and **Customer**.

### Key Features

- **Secure Authentication:** User registration and JWT-based login.
- **Role-Based Access Control (RBAC):** Restricts administrative actions (vehicle and user management) to **Admin** users.
- **Vehicle Management:** CRUD operations for the vehicle inventory, including availability tracking.
- **Booking Management:** Create, view, cancel, and mark bookings as returned, with automatic price calculation.
- **Data Integrity:** Constraints on deletion (users/vehicles cannot be deleted with active bookings).

---

## 🛠️ Technology Stack

The CarConnect API is built with a modern and scalable stack:

| Category           | Technology                   | Purpose                                            |
| :----------------- | :--------------------------- | :------------------------------------------------- |
| **Backend**        | **Node.js** + **TypeScript** | Runtime environment and primary language.          |
| **Web Framework**  | **Express.js**               | Minimalist and flexible web application framework. |
| **Database**       | **PostgreSQL**               | Reliable and scalable relational database.         |
| **Authentication** | **jsonwebtoken (JWT)**       | Secure token-based authentication.                 |
| **Security**       | **bcrypt**                   | Hashing for secure password storage.               |

---

## 📊 Database Schema

The system uses a relational database structure with three primary tables: `Users`, `Vehicles`, and `Bookings`.

### Users Table

| Field      | Notes                               |
| :--------- | :---------------------------------- |
| `id`       | Auto-generated                      |
| `name`     | Required                            |
| `email`    | Required, unique, lowercase         |
| `password` | Required, min 6 characters (hashed) |
| `phone`    | Required                            |
| `role`     | `'admin'` or `'customer'`           |

### Vehicles Table

| Field                 | Notes                                  |
| :-------------------- | :------------------------------------- |
| `id`                  | Auto-generated                         |
| `vehicle_name`        | Required                               |
| `type`                | `'car'`, `'bike'`, `'van'`, or `'SUV'` |
| `registration_number` | Required, unique                       |
| `daily_rent_price`    | Required, positive                     |
| `availability_status` | `'available'` or `'booked'`            |

### Bookings Table

| Field             | Notes                                      |
| :---------------- | :----------------------------------------- |
| `id`              | Auto-generated                             |
| `customer_id`     | Links to Users table                       |
| `vehicle_id`      | Links to Vehicles table                    |
| `rent_start_date` | Required                                   |
| `rent_end_date`   | Required, must be after start date         |
| `total_price`     | Required, positive (calculated)            |
| `status`          | `'active'`, `'cancelled'`, or `'returned'` |

---

## 🔐 Authentication & Authorization

Protected endpoints require a **JSON Web Token (JWT)** passed in the `Authorization` header.

**Header Format:**
Authorization: Bearer <your_jwt_token>

### Business Rules for Access Control:

- **Admin Role:** Has **full system access** to manage vehicles, users, and all bookings.
- **Customer Role:** Can register, view vehicles, create/manage their own bookings.
- **Password Storage:** Passwords are hashed using **bcrypt** before being saved to the database.

---

## 🚀 Live Deployment

The CarConnect API is deployed and can be accessed via the following base URL:

**Base URL:** `https://car-connect-five.vercel.app/`

You can test the endpoints by appending the paths from the [API Endpoints Reference](#-api-endpoints-reference) to the Base URL (e.g., `https://car-connect-five.vercel.app/api/v1/vehicles`).

---

## 🌐 API Endpoints Reference

All endpoints are prefixed with `/api/v1`.

### 1. Authentication Endpoints

| Method | Endpoint       | Access | Description                                    |
| :----- | :------------- | :----- | :--------------------------------------------- |
| `POST` | `/auth/signup` | Public | Register a new user account.                   |
| `POST` | `/auth/signin` | Public | Login and receive an authentication JWT token. |

### 2. Vehicle Endpoints

| Method   | Endpoint               | Access         | Description                                          |
| :------- | :--------------------- | :------------- | :--------------------------------------------------- |
| `POST`   | `/vehicles`            | **Admin only** | Add a new vehicle to the inventory.                  |
| `GET`    | `/vehicles`            | Public         | Retrieve a list of all vehicles.                     |
| `GET`    | `/vehicles/:vehicleId` | Public         | Retrieve details for a specific vehicle.             |
| `PUT`    | `/vehicles/:vehicleId` | **Admin only** | Update vehicle details, price, or status.            |
| `DELETE` | `/vehicles/:vehicleId` | **Admin only** | Delete a vehicle (only if no active bookings exist). |

### 3. User Endpoints

| Method   | Endpoint         | Access         | Description                                                                                 |
| :------- | :--------------- | :------------- | :------------------------------------------------------------------------------------------ |
| `GET`    | `/users`         | **Admin only** | Retrieve a list of all users in the system.                                                 |
| `PUT`    | `/users/:userId` | Admin or Own   | Update user details or role (Admin can update any user, Customer updates own profile only). |
| `DELETE` | `/users/:userId` | **Admin only** | Delete a user (only if no active bookings exist).                                           |

### 4. Booking Endpoints

| Method | Endpoint               | Access         | Description                                                                      |
| :----- | :--------------------- | :------------- | :------------------------------------------------------------------------------- |
| `POST` | `/bookings`            | Customer/Admin | Create a new booking, validates availability, and calculates total price.        |
| `GET`  | `/bookings`            | Role-based     | **Admin** views all bookings; **Customer** views only their own.                 |
| `PUT`  | `/bookings/:bookingId` | Role-based     | **Customer** can cancel (before start date); **Admin** can mark as `"returned"`. |

---

## 💡 Business Logic Notes

- **Booking Price Calculation:** The total price is calculated by multiplying the vehicle's daily rent price by the number of rental days.
  $$total\_price = daily\_rent\_price \times (rent\_end\_date - rent\_start\_date)$$
- **Vehicle Availability Updates:**
  - Vehicle status changes to `"booked"` upon **new booking creation**.
  - Vehicle status changes back to `"available"` when a booking is marked as **`"returned"`** or **`"cancelled"`**.
- **Auto-Return:** The system automatically marks bookings as `"returned"` when the `rent_end_date` has passed.
- **Deletion Constraints:** Users and Vehicles cannot be deleted if they are associated with any active bookings (status: `"active"`).

## ⚙️ Project Setup

### 1. Prerequisites

Ensure you have **Node.js** (LTS version) and **npm/yarn** installed.

### 2. Clone the Repository

```bash
git clone [https://github.com/ShaharearSabbir/CarConnect](https://github.com/ShaharearSabbir/CarConnect)
cd CarConnect
```

### Install Dependencies

```
npm install
# or
yarn install
```

### 4. Environment Variables (.env)

Create a file named .env in the root directory and configure it with the following:
| Variable | Description |
| :--- | :--- |
| `APP_NAME` | The name of the application. |
| `VERSION` | Current API version. |
| `PORT` | The port the server will run on (e.g., `5000`). |
| `CONNECTION_STR` | Your PostgreSQL database connection string. |
| `JWT_SECRET` | A long, secure secret key for JWT signing. |

The API will be accessible locally at http://localhost:<PORT>/api/v1.
