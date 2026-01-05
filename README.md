# Library Management System

A robust, full-stack library management solution built with the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS v4.

## 🚀 Working Features

### 1. User Authentication
*   Secure login system for Admin and Student.
*   Role-based access control (Admin/Librarian vs Student).
*   Encrypted password storage using bcrypt.
*   Session handling with JWT.

### 2. Dashboard
*   **Overview Stats**: View total books, active members, and active loans.
*   **Recent Activity**: Live feed of the last 5 transactions (Issue/Return).
*   **Personalized Greeting**: Shows user name and role context.

### 3. Book Management
*   **CRUD Operations**: Add, Edit, Delete, and View books.
*   **Advanced Filtering**: Filter books by category.
*   **Smart Search**: Real-time search by title, author, or ISBN.
*   **Availability Tracking**: Automatically updates stock when books are issued/returned.

### 4. Member Management
*   **Admin Controls**: Admins can add new members (Students/Librarians) directly.
*   **Search & Listing**: View and search all registered members.
*   **Role Management**: Assign specific roles during creation.

### 5. Circulation (Issue & Return)
*   **Issue Book**: Assign books to members with a due date.
*   **Return Book**: Process returns and update inventory.
*   **Fine Calculation**: Automatically calculates late fees (10 units/day) upon return.
*   **History**: Full transaction logs for admins; personal history for students.

### 6. Technical Highlights
*   **Modern UI**: Glassmorphism design with gradients and `Inter` typography.
*   **Responsive**: Fully responsive layout for mobile and desktop.
*   **Security**: Protected API routes and frontend components.

## 🛠️ Tech Stack
*   **Frontend**: React, Vite, Tailwind CSS v4, Lucide React (Icons), Axios.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (Mongoose).

## 📦 Installation

1.  **Backend**:
    ```bash
    cd server
    npm install
    npm run dev
    ```
2.  **Frontend**:
    ```bash
    cd client
    npm install
    npm run dev
    ```
