# CS602 Term Project — Agile Market E-Commerce Application

**Student:** Battal Cevik
**Course:** CS602 — Server-Side Web Development with JavaScript
**Semester:** Spring 2026

---

## Project Description

Agile Market is a full-stack e-commerce web application. The idea behind this project is to build a real online store where people can browse products, add them to a cart, and place orders — similar to how Amazon works. The application has two different types of users. The first type is a Customer who can shop, manage their cart, and track their orders. The second type is an Admin who can manage the entire store including adding products, updating orders, and viewing customer activity.
The store sells 20 products across four categories: Electronics, Clothing, Books, and Home & Kitchen.

---

## Features

### Customer Features
- Browse 20+ products on the home page
- Search products by name/description (live search)
- Filter products by category (Electronics, Clothing, Books, Home & Kitchen)
- Sort by newest, price, or name
- View product detail pages with quantity selector
- Add/remove items from a persistent shopping cart
- Place orders with real-time stock validation
- View order history in profile page

### Admin Features
- Separate Admin Dashboard with store stats
- Add new products with image upload
- Edit existing products
- Delete products
- View and update order statuses (pending → processing → shipped → delivered → cancelled)
- Delete orders
- View all customers and their complete order histories

### Technical Features
- REST API (11+ endpoints, Postman-tested)
- GraphQL API with Apollo Server (queries + mutations)
- PassportJS Local Strategy authentication (session-based)
- Role-based access control (Customer vs Admin)
- Multer image upload
- Mongoose one-to-many and many-to-many relationships

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Runtime      | Node.js                             |
| Framework    | Express.js with Router              |
| Database     | MongoDB with Mongoose ODM           |
| Auth         | PassportJS (Local Strategy)         |
| Sessions     | express-session + connect-mongo     |
| GraphQL      | Apollo Server 3 + graphql           |
| File Uploads | Multer                              |
| Frontend     | React 18 + React Router v6          |
| HTTP Client  | Axios (withCredentials)             |

---

## Database Relationships

- **One-to-Many**: User → Orders (one user places many orders)
- **One-to-One**: User → Cart
- **Many-to-Many**: Orders ↔ Products (via OrderItem embedded documents — one order references many products; one product appears in many orders)

---

## Authentication — Why PassportJS with React

Although the rubric allows JWT authentication when using React,
this project uses PassportJS with session-based authentication 
for stronger security.

How it works:
1. User submits email + password via React login form
2. Axios sends POST /api/auth/login to Express server
3. PassportJS Local Strategy verifies password using bcryptjs
4. Session is created and stored in MongoDB via connect-mongo
5. Session cookie is returned to React (withCredentials: true)
6. All subsequent requests include the cookie automatically
7. isAuth and isAdmin middleware protect server-side routes
8. React ProtectedRoute component protects client-side routes

---

## Prerequisites

- Node.js v18+
- MongoDB running locally on `mongodb://localhost:27017`
- npm

---

## Setup & Installation

### Step 1: Clone / Extract the project

```bash
unzip CS602_Project_Cevik_Battal.zip
cd CS602_Project_Cevik_Battal
```

### Step 2: Install server dependencies

```bash
cd server
npm install
```

### Step 3: Install client dependencies

```bash
cd ../client
npm install
```

### Step 4: Seed the database

```bash
cd ../server
node seed.js
```

Expected output:
```
Connected to MongoDB...
Cleared existing data...
Created users...
Created 20 products...

✅ Database seeded successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Test Credentials:
  Admin:    admin@agilemarket.com  /  AdminTest34!
  Customer: bcevik@agilemarket.com   /  BcevikTest34!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 5: Start the server

```bash
# From the /server directory
npm start
```

Server will run on: `http://localhost:5001`
GraphQL endpoint: `http://localhost:5001/graphql`

### Step 6: Start the React client

Open a new terminal:

```bash
cd client
npm start
```

Client will run on: `http://localhost:3000`

---

## Test Credentials

| Role     | Email              | Password  |
|----------|--------------------|-----------|
| Admin    | admin@agilemarket.com    | AdminTest34! |
| Customer | bcevik@agilemarket.com     | BcevikTest34!  |

---

## REST API Endpoints

Base URL: `http://localhost:5001/api`

### Auth
| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| POST   | /auth/register     | Register new user    |
| POST   | /auth/login        | Login                |
| POST   | /auth/logout       | Logout               |
| GET    | /auth/me           | Get current user     |

### Products
| Method | Endpoint           | Description                                         |
|--------|--------------------|-----------------------------------------------------|
| GET    | /products          | Get all products (?search=, ?category=, ?minPrice=, ?maxPrice=) |
| GET    | /products/:id      | Get single product                                  |
| POST   | /products          | Create product (multipart/form-data)                |
| PUT    | /products/:id      | Update product                                      |
| DELETE | /products/:id      | Delete product                                      |

### Orders
| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| GET    | /orders            | Get orders           |
| GET    | /orders/:id        | Get single order     |
| POST   | /orders            | Create order         |
| PUT    | /orders/:id        | Update order status  |
| DELETE | /orders/:id        | Delete order         |

### Cart
| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| GET    | /cart              | Get user cart        |
| POST   | /cart              | Add item to cart     |
| PUT    | /cart/:itemId      | Update item quantity |
| DELETE | /cart/:itemId      | Remove cart item     |
| DELETE | /cart              | Clear cart           |

### Admin
| Method | Endpoint                        | Description                  |
|--------|---------------------------------|------------------------------|
| GET    | /admin/stats                    | Dashboard stats              |
| GET    | /admin/customers                | All customers                |
| GET    | /admin/customers/:id/orders     | Orders for a customer        |

---

## GraphQL Endpoints

Playground URL: `http://localhost:5001/graphql`

### Sample Queries

**Get all products:**
```graphql
query {
  products {
    _id
    name
    price
    stock
    category
    imageUrl
  }
}
```

**Search products:**
```graphql
query {
  products(search: "apple", minPrice: 50, maxPrice: 500) {
    _id
    name
    price
    category
  }
}
```

**Get all orders:**
```graphql
query {
  orders {
    _id
    totalAmount
    status
    user {
      username
      email
    }
    items {
      quantity
      priceAtOrder
      product {
        name
      }
    }
  }
}
```

**Get all customers:**
```graphql
query {
  customers {
    _id
    username
    email
    createdAt
  }
}
```

### Sample Mutations

**Add a product:**
```graphql
mutation {
  addProduct(input: {
    name: "Test Product"
    description: "A test product description"
    price: 49.99
    stock: 25
    category: "Electronics"
    imageUrl: "https://via.placeholder.com/300"
  }) {
    _id
    name
    price
  }
}
```

**Update order status:**
```graphql
mutation {
  updateOrderStatus(id: "ORDER_ID_HERE", status: "shipped") {
    _id
    status
  }
}
```

---

## Video Demo

**[Include your YouTube Unlisted link or MyMedia link here]**

The video demo includes:
- Full walkthrough of the working site (home page, product detail, cart, checkout, order confirmation)
- Admin dashboard, add/edit product, manage orders, manage customers
- 1-2 REST API endpoints tested in Postman
- 1-2 GraphQL queries/mutations tested in Apollo Studio

---



## Project Structure

```
CS602_Project/
├── server/
│   ├── config/         # DB connection, Passport setup
│   ├── models/         # User, Product, Order, Cart schemas
│   ├── routes/         # Express Router files
│   ├── graphql/        # Schema and resolvers
│   ├── middleware/     # isAuth, isAdmin
│   ├── public/uploads/ # Uploaded product images
│   ├── seed.js         # Database seeder
│   ├── app.js          # Express app
│   └── server.js       # Entry point
└── client/
    └── src/
        ├── context/    # AuthContext, CartContext
        ├── components/ # Navbar, ProductCard, ProtectedRoute
        ├── pages/      # All page components
        │   └── admin/  # Admin-only pages
        └── services/   # Axios API instance
```
