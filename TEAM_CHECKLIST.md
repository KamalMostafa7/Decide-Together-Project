# 📋 New Team Member Checklist

## ✅ Before You Start

### Software Installation
- [ ] Node.js installed (https://nodejs.org)
  - Run `node --version` to verify
  - Should show v14 or higher
- [ ] npm installed (comes with Node.js)
  - Run `npm --version` to verify
- [ ] Git installed (if using GitHub)
  - Download from https://git-scm.com
  - Run `git --version` to verify
- [ ] VS Code installed (optional but recommended)
  - Download from https://code.visualstudio.com

---

## ✅ Getting the Project

### Option A: From GitHub
- [ ] Received GitHub repository invitation
- [ ] Accepted the invitation
- [ ] Cloned the repository:
```bash
git clone <repository-url>
cd <project-folder>
```

### Option B: From ZIP File
- [ ] Downloaded ZIP file
- [ ] Extracted to a folder
- [ ] Opened folder in terminal/VS Code

---

## ✅ First-Time Setup

### Automated Setup (Recommended)
- [ ] Run the setup script:
```powershell
.\setup.ps1
```

### Manual Setup (Alternative)
- [ ] Install dependencies: `npm install`
- [ ] Create database: `node backend/seedReports.js`
- [ ] Test server: `node backend/server.js`

---

## ✅ Verify Everything Works

- [ ] Server starts without errors
- [ ] Browser opens to http://localhost:3000
- [ ] Homepage displays with map
- [ ] Browse page shows 30 reports
- [ ] Can login with test account (user@test.com / user123)
- [ ] Can create new report (when logged in)
- [ ] Can vote on reports
- [ ] Can add comments
- [ ] Language toggle works (EN ↔ AR)
- [ ] All 27 governorates appear in dropdown
- [ ] Map is restricted to Egypt

---

## ✅ Understanding the Project

### Read These Files
- [ ] README.md - Full project documentation
- [ ] SETUP_GUIDE.md - Quick setup instructions
- [ ] COLLABORATION_GUIDE.md - How to work together
- [ ] package.json - See what libraries we use

### Explore the Code
- [ ] backend/server.js - Main server file
- [ ] backend/models/ - Database structure
- [ ] frontend/index.html - Homepage
- [ ] frontend/browse.html - Browse reports page
- [ ] frontend/js/ - Frontend functionality
- [ ] frontend/lang/ - Translation files

---

## ✅ First Tasks (To Learn the Code)

### Easy Tasks to Get Started
- [ ] Change the website title in HTML files
- [ ] Modify a color in css/style.css
- [ ] Add a new translation to lang/en.json and lang/ar.json
- [ ] Create a test report through the interface
- [ ] Look at the database (database.db) with a SQLite viewer

### Medium Tasks
- [ ] Add a new category to reports
- [ ] Change the default map zoom level
- [ ] Modify the number of reports shown on browse page
- [ ] Add a new field to the registration form

---

## ✅ Daily Workflow

### Before Starting Work
- [ ] Pull latest changes (if using Git): `git pull`
- [ ] Start server: `node backend/server.js`
- [ ] Open browser: http://localhost:3000

### While Working
- [ ] Make small changes and test frequently
- [ ] Check browser console (F12) for errors
- [ ] Restart server if changing backend code
- [ ] Refresh browser if changing frontend code

### After Making Changes
- [ ] Test everything still works
- [ ] Check no errors in console
- [ ] Commit changes (if using Git):
```bash
git add .
git commit -m "Description of what you changed"
git push
```

---

## ✅ Testing Checklist

### Basic Functionality
- [ ] Homepage loads
- [ ] Browse page loads
- [ ] Login works
- [ ] Register new user works
- [ ] Create report works
- [ ] View report details works
- [ ] Voting works
- [ ] Commenting works

### Bilingual Support
- [ ] All text translates when toggling language
- [ ] Governorate names show in selected language
- [ ] Categories translate
- [ ] Status badges translate
- [ ] Form placeholders translate

### Admin Features (login as admin)
- [ ] Dashboard accessible
- [ ] Can see all reports
- [ ] Can filter reports
- [ ] Can change report status
- [ ] Can delete reports

---

## ✅ Common Issues - Solutions

### Port 3000 already in use
```bash
Get-Process -Name node | Stop-Process -Force
node backend/server.js
```

### Module not found errors
```bash
npm install
```

### Database errors
```bash
node backend/seedReports.js
```

### Changes not showing
- Backend changes: Restart server (Ctrl+C, then run again)
- Frontend changes: Hard refresh (Ctrl+Shift+R)
- CSS changes: Clear browser cache

---

## ✅ Communication with Team

### Before Making Big Changes
- [ ] Discuss with team
- [ ] Make sure no one else is working on same file
- [ ] Create a new branch (if using Git)

### When You're Stuck
- [ ] Check the README.md
- [ ] Look at existing similar code
- [ ] Check browser console for errors
- [ ] Ask teammate for help
- [ ] Google the error message

---

## ✅ Code Quality

### Before Pushing Code
- [ ] Code works without errors
- [ ] Tested all affected features
- [ ] Removed debug console.log() statements
- [ ] Code is readable and commented
- [ ] Follows existing code style
- [ ] No sensitive data in code (passwords, API keys)

---

## ✅ Learning Goals

### Week 1
- [ ] Understand project structure
- [ ] Can run server locally
- [ ] Can make simple HTML/CSS changes
- [ ] Understand the database models

### Week 2
- [ ] Can add new features
- [ ] Understand API endpoints
- [ ] Can fix bugs
- [ ] Comfortable with Git workflow

### Week 3
- [ ] Can work independently
- [ ] Can review teammate's code
- [ ] Can plan new features
- [ ] Ready for presentation

---

## 📞 Need Help?

1. Check README.md for documentation
2. Check COLLABORATION_GUIDE.md for workflow
3. Ask your teammate
4. Create a QUESTIONS.txt file with your questions
5. Google error messages

---

## 🎉 You're Ready!

Once you've checked all the items above, you're fully set up and ready to contribute!

**Welcome to the team! 🚀**

---

**Date Started:** _______________  
**Completed Setup:** _______________  
**First Contribution:** _______________
