# Finance Dashboard Backend

## Overview

This is a Finance Data Processing and Access Control backend built using Node.js, Express.js and MongoDB.
It supports role-based access control, financial records management and dashboard analytics.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

---

## Base URL (Deployed)

```
https://finance-dashboard-backend-14g2.onrender.com
```

---

## Default Admin Credentials

When the server starts for the first time, a default admin user is automatically created.

Email: admin@test.com
Password: Amit@1234

Use these credentials to login and create other users.

---

## Authentication

### Login API

```
POST /api/auth/login
```

### Request Body

```
{
  "email":"admin@test.com",
  "password":"Amit@1234"
}
```

### Headers

```
Authorization: Bearer <token>
```

---

## User Roles

- Admin -> Full access
- Analyst -> View records and dashboard
- Viewer -> View dashboard only

---

## User APIs

### Create User (Admin only)

```
POST /api/users
```

#### Request Body

```
{
  "name":"Amit",
  "email":"amit@test.com",
  "password":"123456",
  "role":"analyst"
}
```

---

### Get users

```
GET /api/users
```

---

### Update Role

```
PATCH /api/users/:id/role
```

#### Request Body

```
{
  "role":"viewer"
}
```

---

### Update Status

```
PATCH /api/users/:id/status
```

#### Request Body

```
{
  "status":"inactive"
}
```

---

### Delete User (Soft Delete)

```
DELETE /api/users/:id
```

---

## Record APIs

### Create Record

```
POST /api/records
```

#### Request Body

```
{
  "amount":5000,
  "type":"income",
  "category":"Salary",
  "note":"Monthly salary"
}
```

---

### Get Records

```
GET /api/records
```

#### Query Params

- type
- category
- startDate
- endDate
- search
- page
- limit

#### Example

```
GET /api/records?type=expense&category=Food&page=1&limit=10
```

---

### Update Record

```
PATCH /api/records/:id
```

#### Request Body

```
{
  "amount": 4500,
  "note": "Updated amount"
}
```

---

### Delete Record (Soft Delete)

```
DELETE /api/records/:id
```

---

## Dashboard API

### Get Summary

```
GET /api/dashboard/summary
```

### Returns

- total income
- total expense
- net balance
- category totals
- recent activity
- monthly trends

---

## Features

- Role-based access control
- Soft delete support
- Pagination
- Filtering
- Dashboard analytics
- JWT authentication
- Input validation

---

## Assumptions

- Admin has full control over users and records
- Analyst can view financial records and dashboard summaries
- Viewer can access dashboard data in read-only mode
- Soft delete is implemented to avoid permanent data loss

---

## Setup (Local Development)

### Install dependencies

```
npm install
```

### .env file

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

### Run server

```
npm run dev
```
