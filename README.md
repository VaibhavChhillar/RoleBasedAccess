# Team Task Manager

A full-stack project management web application with **role-based access control**, built using modern web technologies.

---

## Live Demo

https://rolebasedaccess-1.onrender.com

## 🎯 Features

### 🔐 Authentication

* Secure **JWT-based login & signup**
* Password hashing using bcrypt

### 👥 Role-Based Access Control

* **Admin**

  * Create and manage projects
  * Add/remove members
  * Create and assign tasks
* **Member**

  * View assigned projects
  * Update task status

### 📁 Project Management

* Create projects
* Add team members
* View project details

### ✅ Task Management

* Create tasks with:

  * Title, Description
  * Due date
  * Status (Todo, In Progress, Done)
* Assign tasks to team members
* Update task status dynamically

### 📊 Dashboard

* Total tasks
* Completed tasks
* In-progress tasks
* Overdue tasks

### 🎨 UI/UX

* Modern **dark-themed UI**
* Built with Tailwind CSS
* Responsive design

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Deployment

* I USED RENDER BECAUSE ON RAILWAY LIMIT WAS EXCEEDED AND I WAS UNABLE TO COMPLETE. SO I CHOOSE RENDER

---

## 📁 Monorepo Structure

```
/
├── backend/     # Express API
├── frontend/    # React app
├── package.json # Root scripts
```

---

## ⚙️ Environment Variables

Create a `.env` file inside `/backend`:

```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
```

---

## ▶️ Running Locally

### 1. Install dependencies

```
npm install
```

### 2. Run the app

```
npm run dev
```



## ✨ Future Improvements

* Notifications system
* Real-time updates (WebSockets)
* File attachments
* Advanced analytics dashboard

---

## 👨‍💻 Author

Vaibhav Chhillar
