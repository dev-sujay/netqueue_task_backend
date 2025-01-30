Here's the updated version of your README:

---

# 🏠 The Luxury Hut - Node.js Backend Server

![Node.js](https://img.shields.io/badge/Node.js-16.x-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-4.x-black?style=for-the-badge&logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue?style=for-the-badge&logo=typescript)

## 🚀 About the Project

**The Luxury Hut Backend Server** is a high-performance, scalable API built using **TypeScript** and **Express.js**. It efficiently manages product operations, file uploads, and logging while maintaining a modular architecture.

---

## 📂 Project Structure

```
src/
│── controllers/        # Business logic for API endpoints
│── middleware/         # Error handling & middleware functions
│── models/             # Database models & schemas
│── routes/             # API route definitions
│── services/           # Business logic services
│── utils/              # Utility functions (logging, helpers)
│── app.ts              # Main application entry point
uploads/                # Storage for uploaded files
.env                    # Environment variables
.gitignore              # Files ignored by Git
package.json            # Project dependencies
tsconfig.json           # TypeScript configuration
```

---

## ⚙️ Features

✅ **RESTful API** with well-defined routes  
✅ **TypeScript Support** for maintainability and scalability  
✅ **Modular Structure** for better code organization  
✅ **Robust Middleware** for error handling and authentication  
✅ **Product Management** with CRUD operations  
✅ **File Upload Handling** via `multer`  
✅ **Centralized Logging System** for debugging & monitoring  

---

## 🔧 Installation & Setup

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/your-username/luxury-hut-backend.git
cd luxury-hut-backend
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file and add the necessary configurations:

```sh
touch .env
```

### 4️⃣ Run the Server

#### 🚀 Development Mode

```sh
npm run dev
```

#### 🚀 Production Mode

```sh
npm start
```

---

## 🛠 API Endpoints

| Method | Endpoint               | Description            |
|--------|------------------------|------------------------|
| GET    | `/api/products`        | Retrieve all products |
| POST   | `/api/products`        | Create a new product  |
| POST   | `/api/products/import` | import products from csv |
| GET    | `/api/products/:id`    | Retrieve a single product |
| PUT    | `/api/products/:id`    | Update a product      |
| DELETE | `/api/products/:id`    | Delete a product      |

📌 **More endpoints and features coming soon!**

---

## 🤝 Contributing

We welcome contributions! Follow these steps to contribute:

1. **Fork** the repository
2. **Create a feature branch** (`git checkout -b feature-name`)
3. **Commit your changes** (`git commit -m "Add new feature"`)
4. **Push to your branch** (`git push origin feature-name`)
5. **Submit a Pull Request** 🚀

---

## 🔥 Author

👤 **Your Name**  
📧 paulsujay999@gmail.com  
🔗 [LinkedIn Profile](https://www.linkedin.com/in/dev-sujay/)

