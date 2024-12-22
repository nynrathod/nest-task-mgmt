# **Task Management System**

## **Project overview**:

This project is a Task Management System built using NestJS for the backend, React.js for the frontend, and uses
WebSocket for real-time notifications. The system allows users to create, assign, and track tasks with real-time
updates.

### **Tech Stack**:

- **Backend**:
    - **NestJS**
    - **TypeORM-MySQL**
    - **WebSocket**
    - **Socket.io**
    - **Bull**
- **Frontend**:
    - **Reactjs with vitejs**
    - **Socket.io**
    - **react-datepicker**
    - **tanstack/react-query**
    - **React hook form**

---

## **Setup and Run**:

### **Client**:

1. Create a `.env` file in the root of your client project.
2. Add the following line to the `.env` file:

```bash
VITE_API_BASE_URL=http://localhost:3000/
```

```bash
$ cd client
$ yarn install
$ npm run dev
```

### **Server**:

1. Create a `.env` file in the root of your server project.
2. Add the following line to the `.env` file:

```bash
JWT_SECRET=your-secret-key
```

```bash
$ cd server
$ yarn install
$ npm run start:dev
```
