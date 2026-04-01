# 🎯 EventCore — Multi-Event Admin Dashboard

A full-stack web application for managing multiple events from a single dashboard. Admins have full control while managers can view and manage their assigned events.

---
## 🔗 Live Demo

- **Frontend:** [mulit-event-admin-dashboard.vercel.app](https://mulit-event-admin-dashboard.vercel.app)
- **Backend:** Deployed on Railway

---
## ✨ Features

- 🔐 **Role-Based Access Control** — Admin and Manager roles with different permissions
- 📅 **Event Management** — Create, edit, delete, and assign events to managers
- 👥 **User Management** — Admin can create and manage team members
- 📊 **Analytics** — Engagement metrics, fill rates, and attendance tracking
- 💰 **Revenue Tracking** — Per-event revenue with ticket type breakdown
- 📈 **Dashboard** — Role-specific dashboard with charts and recent events
- 🎫 **Ticket Types** — General and VIP pricing per event
- 🌙 **Dark Theme** — Modern dark UI with smooth animations

---
## 🛠️ Tech Stack
### Frontend
| Technology | Purpose |
|---|---|
| React.js | UI Framework |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Recharts | Charts & Visualizations |
| Axios | HTTP Client |
| React Router | Client-Side Routing |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web Framework |
| Sequelize | ORM |
| MySQL | Database |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Helmet | Security |

## 🏗️ Architecture
```
Admin_Dashboard/
├── client/                   # React frontend
│   ├── src/
│   │   ├── api/              # Axios instance
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # Auth context
│   │   └── pages/            # Page components
│   └── public/
│
└── server/                   # Node.js backend
    ├── config/               # Database config
    ├── controllers/          # Business logic
    ├── middleware/           # Auth middleware
    ├── models/               # Sequelize models
    ├── routes/               # API routes
    └── __tests__/            # Test files
```

---
## 🔑 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/users/login` | Public | Login and get JWT token |

### Users
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/uers/` | Admin | Get all users |
| POST | `/users/add-user` | Admin | Create new user |
| PUT | `/users/:id` | Admin | Update user |
| DELETE | `/users/:id` | Admin | Delete user |

### Events
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/events/` | All roles | Get events (filtered by role) |
| GET | `/events/:id` | All roles | Get single event |
| POST | `/events/create-event` | Admin | Create event |
| PUT | `/events/update/:id` | Admin | Update event |
| DELETE | `/events/delete/:id` | Admin | Delete event |
| POST | `/events/:id/assign` | Admin | Assign manager to event |
| DELETE | `/events/:id/assign/:managerId` | Admin | Remove manager from event |

### Dashboard
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/dashboard/` | All roles | Get dashboard stats |

### Analytics
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/analytics/stats` | Admin | Global stats |
| GET | `/analytics/engagement` | Admin + Manager | Engagement metrics |
| GET | `/analytics/attendance` | Admin + Manager | Attendance stats |

### Revenue
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/revenue/` | Admin | Total revenue |
| GET | `/revenue/:id` | Admin | Revenue by event |

### Attendance
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/attendence/` | Admin + Manager | Attendance data |
| PUT | `/attendence/:id` | Admin + Manager | Update attendance |

---

## 👥 Role Permissions

| Feature | Admin | Manager |
|---|---|---|
| Dashboard (full stats) | ✅ | ✅ (assigned events only) |
| View Events | ✅ All | ✅ Assigned only |
| Create/Edit/Delete Events | ✅ | ❌ |
| Revenue Data | ✅ | ❌ |
| Analytics | ✅ | ✅ (assigned events only) |
| Attendance | ✅ | ✅ (assigned events only) |
| Manage Users | ✅ | ❌ |
| Assign Managers | ✅ | ❌ |

---
## 🔒 Security

- Passwords hashed with **bcryptjs** (salt rounds: 10)
- JWT tokens expire after **7 days**
- **Helmet.js** for HTTP security headers
- Role-based middleware on every protected route
- `.env` file excluded from version control
---
## 📸 Screenshots

![alt text](<Screenshot (5826).png>)
![alt text](<Screenshot (5829).png>)

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@mennahassan0101](https://github.com/mennahassan0101)
- LinkedIn: [Menna Hassan](https://www.linkedin.com/in/menna-hassan-660230221/)

---