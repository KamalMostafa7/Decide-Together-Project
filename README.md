# Decide Together 🇪🇬# Decide Together



A civic engagement platform for Egyptian citizens to report and track local community issues across all 27 governorates of Egypt.Interactive platform for Egyptian citizens to report local issues and monitor their status.



## 🌟 Features## Features



- 📍 Interactive map with Egypt boundaries- Report creation with location, photos/videos, category

- 🗺️ All 27 Egyptian governorates support- Interactive map with issue markers

- 🌐 Full bilingual support (Arabic/English)- Voting and commenting

- 📝 Report creation with location picker- Dashboard for admins to manage reports

- 💡 Suggested solutions from citizens- Notifications for status updates

- 🗳️ Voting system (upvote/downvote)- Bilingual support (Arabic/English)

- 💬 Comments on reports

- 👤 User authentication (JWT)## Tech Stack

- 👨‍💼 Admin dashboard

- 🖼️ Auto-assigned category images- **Frontend:** HTML, CSS, JavaScript, Bootstrap, Leaflet.js

- 📱 YouTube-style browse interface- **Backend:** Node.js + Express.js

- **Database:** SQLite + Sequelize ORM

## 🚀 Getting Started for New Team Members- **Authentication:** JWT + bcrypt



### Prerequisites## Installation

- Node.js (v14 or higher)

- npm (comes with Node.js)1. Install dependencies:

- Git```bash

npm install

### Installation Steps```



1. **Clone the repository:**2. Start the server:

```bash```bash

git clone <repository-url>npm start

cd "Project Decide Together"```

```

3. Open your browser and navigate to:

2. **Install dependencies:**```

```bashhttp://localhost:3000

npm install```

```

## Default Admin Credentials

3. **Seed the database with test data:**

```bash- Email: admin@decidetogether.com

node backend/seedReports.js- Password: admin123

```

This creates:## Project Structure

- Default admin and user accounts

- 30 fake reports across Egyptian governorates```

sharek/

4. **Start the server:** ├── backend/

```bash │   ├── server.js

node backend/server.js │   ├── routes/

``` │   ├── controllers/

 │   ├── models/

5. **Open your browser:** │   ├── database/

- Homepage: http://localhost:3000 │   └── auth/

- Browse Reports: http://localhost:3000/browse.html ├── frontend/

- Create Report: http://localhost:3000/report.html │   ├── index.html

 │   ├── login.html

### 🔑 Default Login Credentials │   ├── register.html

 │   ├── dashboard.html

**Admin Account:** │   ├── css/

- Email: `admin@decidetogether.com` │   ├── js/

- Password: `admin123` │   └── lang/

 └── package.json

**User Account:**```

- Email: `user@test.com`

- Password: `user123`## Usage



## 📁 Project Structure1. Register a new account or login

2. Click on the map to select a location

```3. Submit a report with details and photos

├── backend/4. Vote and comment on existing reports

│   ├── server.js              # Express server5. Admins can manage report status from the dashboard

│   ├── seedReports.js         # Database seeder
│   ├── auth/                  # JWT authentication
│   ├── controllers/           # API controllers
│   ├── database/              # Database config
│   ├── models/                # Sequelize models
│   └── routes/                # API routes
├── frontend/
│   ├── index.html             # Homepage with map
│   ├── browse.html            # Browse all reports
│   ├── report.html            # Create new report
│   ├── dashboard.html         # Admin dashboard
│   ├── login.html             # Login page
│   ├── register.html          # Registration page
│   ├── css/                   # Stylesheets
│   ├── js/                    # JavaScript files
│   └── lang/                  # Translations (ar.json, en.json)
└── package.json               # Dependencies
```

## 🛠️ Technology Stack

### Backend
- Node.js
- Express.js
- SQLite3
- Sequelize ORM
- JWT for authentication
- bcrypt for password hashing

### Frontend
- HTML5, CSS3, JavaScript
- Bootstrap 5
- Leaflet.js (maps)
- Font Awesome icons

## 🔧 Development Workflow

### Making Changes

1. **Pull latest changes:**
```bash
git pull origin main
```

2. **Create a new branch:**
```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes and test**

4. **Commit your changes:**
```bash
git add .
git commit -m "Description of your changes"
```

5. **Push to repository:**
```bash
git push origin feature/your-feature-name
```

6. **Create a Pull Request** on GitHub

### Testing Changes

1. **Restart the server** after backend changes:
```bash
# Stop the server (Ctrl+C)
node backend/server.js
```

2. **Refresh browser** after frontend changes

3. **Re-seed database** if you change the models:
```bash
node backend/seedReports.js
```

## 📋 Common Tasks

### Adding a New Feature
1. Update the appropriate controller in `backend/controllers/`
2. Update routes in `backend/routes/`
3. Update frontend JavaScript in `frontend/js/`
4. Add translations to `frontend/lang/en.json` and `frontend/lang/ar.json`

### Modifying the Database
1. Edit models in `backend/models/`
2. Re-run the seed script to recreate tables
3. Test with fake data

### Adding Translations
1. Add key-value pairs to both `frontend/lang/en.json` and `frontend/lang/ar.json`
2. Use `data-key` attribute in HTML elements
3. The language toggle will automatically update

## 🐛 Troubleshooting

**Port 3000 already in use:**
```bash
# Windows PowerShell
Get-Process -Name node | Stop-Process -Force
```

**Database errors:**
```bash
# Delete the database and re-seed
Remove-Item database.db -ErrorAction SilentlyContinue
node backend/seedReports.js
```

**Missing dependencies:**
```bash
npm install
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Reports
- `GET /api/reports` - Get all reports (with filters)
- `GET /api/reports/:id` - Get single report
- `POST /api/reports` - Create report (auth required)
- `PUT /api/reports/:id` - Update report (admin only)
- `DELETE /api/reports/:id` - Delete report (admin only)

### Comments
- `GET /api/comments?report_id=X` - Get comments for report
- `POST /api/comments` - Add comment (auth required)

### Votes
- `POST /api/votes` - Vote on report (auth required)

### Notifications
- `GET /api/notifications` - Get user notifications (auth required)
- `PUT /api/notifications/:id/read` - Mark as read (auth required)

## 🌍 Egyptian Governorates Supported

Cairo, Alexandria, Giza, Qalyubia, Sharqia, Dakahlia, Beheira, Kafr El Sheikh, Gharbia, Monufia, Damietta, Port Said, Ismailia, Suez, North Sinai, South Sinai, Fayoum, Beni Suef, Minya, Assiut, Sohag, Qena, Luxor, Aswan, Red Sea, New Valley, Matrouh

## 🤝 Team Collaboration Guide

### For the Project Owner

1. **Create GitHub repository:**
   - Go to https://github.com/new
   - Name it "decide-together-egypt" or similar
   - Make it private or public
   - Don't initialize with README (we have one)

2. **Push your code:**
```bash
cd "g:\College\Thrid Grade\Project (Dr Mona)"
git init
git add .
git commit -m "Initial commit - Decide Together platform"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/REPO-NAME.git
git push -u origin main
```

3. **Invite your teammate:**
   - Go to repository Settings → Collaborators
   - Click "Add people"
   - Enter their GitHub username or email
   - Send invitation

### For Your Teammate

1. **Accept invitation** (check email or GitHub notifications)

2. **Clone the repository:**
```bash
git clone https://github.com/OWNER-USERNAME/REPO-NAME.git
cd REPO-NAME
```

3. **Install and test:**
```bash
npm install
node backend/seedReports.js
node backend/server.js
```

4. **Start working:**
   - Always pull before starting: `git pull`
   - Create feature branches: `git checkout -b feature/my-feature`
   - Test everything before pushing
   - Push and create pull request

## 📞 Support

For issues or questions, contact the development team or create an issue in the repository.

---

**Project Status:** ✅ Production Ready  
**Last Updated:** October 2025  
**Team:** Dr. Mona's Third Grade Project
