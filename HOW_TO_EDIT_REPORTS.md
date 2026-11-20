# How to Edit Fake Reports

## 📝 Overview

All fake test reports are now stored in **`backend/seedReports.js`** in an easy-to-edit format. Each report includes all fields with image URLs!

## 📍 Location

File: `backend/seedReports.js`

Look for the `fakeReports` array (starts around line 14)

## ✏️ How to Edit Reports

### 1. Open the File

```
backend/seedReports.js
```

### 2. Find the Report You Want to Edit

Each report looks like this:

```javascript
{
  title: 'Broken streetlight on Tahrir Street',
  description: 'The streetlight near the metro station has been broken for 2 weeks...',
  suggested_solution: 'Replace the broken bulb and check the electrical wiring.',
  category: 'infrastructure',
  governorate: 'Cairo',
  city: 'Downtown',
  address: 'Tahrir Street, near Metro Station',
  latitude: 30.0444,
  longitude: 31.2357,
  status: 'open',
  image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'
}
```

### 3. Edit Any Field You Want

**You can change:**

| Field | What It Is | Example Values |
|-------|------------|----------------|
| `title` | Report headline | Any text |
| `description` | Problem details | Any text |
| `suggested_solution` | How to fix it | Any text (or `null`) |
| `category` | Type of problem | `infrastructure`, `cleanliness`, `safety`, `utilities`, `other` |
| `governorate` | Egyptian governorate | `Cairo`, `Alexandria`, `Giza`, etc. (see list below) |
| `city` | City/District | Any text |
| `address` | Street address | Any text |
| `latitude` | GPS latitude | Decimal number (e.g., `30.0444`) |
| `longitude` | GPS longitude | Decimal number (e.g., `31.2357`) |
| `status` | Current status | `open`, `in_progress`, `resolved` |
| `image_url` | Image link | Any image URL |

### 4. Apply Changes

After editing, run:

```bash
node backend/seedReports.js
```

This will:
- Delete the old database
- Create new tables
- Add all your edited reports

### 5. Restart the Server

```bash
# Stop the server (Ctrl+C)
# Then start it again
node backend/server.js
```

## 🖼️ Changing Images

### Current Images

All reports currently use Unsplash images:
- Infrastructure: Construction/road photos
- Cleanliness: Waste/cleanup photos
- Safety: Security/warning photos
- Utilities: Electricity/water photos
- Other: General urban photos

### How to Change Images

**Option 1: Use Your Own Image URL**
```javascript
image_url: 'https://your-image-hosting.com/photo.jpg'
```

**Option 2: Use Unsplash (Free)**
1. Go to https://unsplash.com
2. Search for a photo
3. Right-click → Copy image address
4. Paste in `image_url` field

**Option 3: Use Local Images**
```javascript
image_url: '/images/my-photo.jpg'
```
(You need to add the image to `frontend/images/` folder)

**Option 4: No Image**
```javascript
image_url: null
```

## 📋 Valid Governorates

Use exactly one of these 27 governorates:

```
Cairo, Alexandria, Giza, Qalyubia, Sharqia, Dakahlia, Beheira, 
Kafr El Sheikh, Gharbia, Monufia, Damietta, Port Said, Ismailia, 
Suez, North Sinai, South Sinai, Fayoum, Beni Suef, Minya, Assiut, 
Sohag, Qena, Luxor, Aswan, Red Sea, New Valley, Matrouh
```

## 🎯 Examples

### Add a New Report

Add to the array before the closing `];`:

```javascript
  {
    title: 'Park needs playground equipment',
    description: 'Children have no safe place to play in this neighborhood.',
    suggested_solution: 'Install swings, slides, and safety surfacing.',
    category: 'other',
    governorate: 'Cairo',
    city: 'Heliopolis',
    address: 'Merghany Street Park',
    latitude: 30.0808,
    longitude: 31.3272,
    status: 'open',
    image_url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600'
  },
```

### Delete a Report

Remove the entire `{ ... },` block including the comma.

### Change Report Status

```javascript
status: 'resolved'  // Was 'open', now fixed!
```

### Update Location

Find coordinates on Google Maps:
1. Right-click location
2. Click the coordinates
3. Copy latitude and longitude

```javascript
latitude: 30.1234,
longitude: 31.5678,
```

## 🔍 Finding GPS Coordinates

### Method 1: Google Maps
1. Go to https://maps.google.com
2. Right-click on location
3. Click on the coordinates (they'll copy)
4. First number = latitude
5. Second number = longitude

### Method 2: OpenStreetMap
1. Go to https://www.openstreetmap.org
2. Right-click location → Show address
3. Use the coordinates shown

## ⚠️ Important Notes

1. **Always use commas** between reports (except the last one)
2. **Use single quotes** for text: `'like this'`
3. **Numbers don't need quotes**: `latitude: 30.0444`
4. **Status must be exact**: `open`, `in_progress`, or `resolved`
5. **Category must be exact**: `infrastructure`, `cleanliness`, `safety`, `utilities`, or `other`
6. **Save the file** before running the seed script!

## 🚀 Quick Workflow

```bash
# 1. Edit backend/seedReports.js
# 2. Save the file
# 3. Re-seed the database
node backend/seedReports.js

# 4. Restart server (if running)
# Press Ctrl+C to stop, then:
node backend/server.js

# 5. Refresh browser
# Your changes will appear!
```

## 📊 Current Reports

- **Total**: 30 reports
- **Cairo**: 4 reports
- **Alexandria**: 3 reports
- **Giza**: 3 reports
- **Other Governorates**: 20 reports (1-2 each)

All reports include:
✅ Image URLs
✅ Suggested solutions
✅ GPS coordinates
✅ Full Egyptian governorate coverage

## 💡 Tips

- **Start small**: Edit one report first to test
- **Keep backups**: Copy the file before making big changes
- **Test often**: Run seed script after each change
- **Be creative**: Make reports realistic for your demo!

## 📞 Need Help?

Check `README.md` for full project documentation.

---

**Happy Editing! 🎉**
