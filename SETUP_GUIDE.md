# Quick Setup Guide for Team Members

## 🎯 Step-by-Step Setup (5 minutes)

### Step 1: Get the Code
```bash
# Clone from GitHub (after owner pushes)
git clone <repository-url>
cd "Project (Dr Mona)"
```

**OR if receiving as ZIP file:**
1. Extract the ZIP file
2. Open terminal in the extracted folder

### Step 2: Install Node.js
If you don't have Node.js:
1. Go to https://nodejs.org
2. Download LTS version (recommended)
3. Install and restart your computer

### Step 3: Install Dependencies
```bash
npm install
```

This will install all required packages (~50MB)

### Step 4: Create Test Data
```bash
node backend/seedReports.js
```

You should see:
- ✅ Database synced
- ✅ Default users created
- ✅ Successfully created 30 fake reports!

### Step 5: Start the Server
```bash
node backend/server.js
```

You should see:
```
✅ Decide Together server is running!
🌐 Open your browser and go to: http://localhost:3000
```

### Step 6: Test Everything
1. Open browser: http://localhost:3000
2. Click "Browse" to see 30 fake reports
3. Login with test account:
   - Email: `user@test.com`
   - Password: `user123`
4. Try creating a new report
5. Test voting and commenting

## ✅ You're All Set!

---

## 🔄 Daily Workflow

### Before Starting Work:
```bash
git pull origin main
```

### After Making Changes:
```bash
git add .
git commit -m "What I changed"
git push origin main
```

### If Server Stops Working:
```bash
# Stop any running servers
Get-Process -Name node | Stop-Process -Force

# Restart
node backend/server.js
```

---

## 📞 Common Issues

### "Port 3000 already in use"
```bash
Get-Process -Name node | Stop-Process -Force
node backend/server.js
```

### "Cannot find module"
```bash
npm install
```

### "Database error"
```bash
node backend/seedReports.js
```

### Changes not showing?
- **Backend changes:** Restart server (Ctrl+C, then run again)
- **Frontend changes:** Refresh browser (F5 or Ctrl+R)
- **CSS changes:** Hard refresh (Ctrl+Shift+R)

---

## 🎓 Understanding the Project

### File Organization:
- `backend/` → Server code (Node.js)
- `frontend/` → Website pages (HTML/CSS/JS)
- `package.json` → List of dependencies

### Main Files to Know:
- `backend/server.js` → Starts the server
- `backend/models/` → Database structure
- `frontend/index.html` → Homepage
- `frontend/browse.html` → Browse all reports
- `frontend/js/` → Website functionality

### When You Edit:
- **HTML files** → See changes immediately (refresh browser)
- **CSS files** → See changes immediately (refresh browser)
- **JavaScript (frontend)** → Refresh browser
- **JavaScript (backend)** → Must restart server

---

## 💡 Testing Checklist

Before pushing changes, test:

- [ ] Homepage loads (http://localhost:3000)
- [ ] Browse page shows reports (http://localhost:3000/browse.html)
- [ ] Can login (user@test.com / user123)
- [ ] Can create a report (when logged in)
- [ ] Can vote on reports
- [ ] Can add comments
- [ ] Language toggle works (EN ↔ AR)
- [ ] Map displays correctly
- [ ] No errors in browser console (F12)

---

## 🚀 Quick Commands Reference

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Create test data | `node backend/seedReports.js` |
| Start server | `node backend/server.js` |
| Stop server | Ctrl + C |
| Kill all Node processes | `Get-Process -Name node \| Stop-Process -Force` |
| Pull latest code | `git pull origin main` |
| Push your changes | `git add . && git commit -m "message" && git push` |

---

## 📧 Need Help?

- Check the main README.md for detailed documentation
- Ask in team chat
- Create an issue on GitHub
- Contact project lead

**Good luck! 🎉**
