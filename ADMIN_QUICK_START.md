# 🚀 Admin Panel - Quick Start Guide

## Access the Admin Panel

### URL
```
http://localhost:4200
```

### Login Credentials
- **Username**: `admin`
- **Password**: `admin123`

---

## Features Overview

### 📅 Planning (Planning Hebdomadaire)
Schedule your team's weekly activities

**How to use:**
1. Click on any day card on the right to select it
2. Fill in the form on the left:
   - Select the day
   - Set start time
   - Set end time
   - Add description
3. Click "Enregistrer" to save

**Tips:**
- Your schedule is saved in browser localStorage
- All 7 days are visible at once
- Click a day card to quickly edit it

---

### 📋 Objectives (Objectifs)
Set and track weekly team goals

**How to use:**
1. Click on the "OBJECTIFS" tab
2. Write your weekly objectives in the text area
3. Click "Enregistrer les objectifs"

**Features:**
- Auto-save to localStorage
- Persistent across sessions
- Can be edited anytime

---

### 🎮 Events (Événements)
Manage tournaments, scrims, trainings, and meetings

**How to use:**
1. Click "ÉVÉNEMENTS" tab
2. Fill in the form:
   - **Title**: Event name
   - **Type**: Tournament, Scrim, Training, or Meeting
   - **Date**: When it happens
   - **Time**: Start time
   - **Description**: Optional details
3. Click "Ajouter l'événement"

**View events:**
- Events are listed in chronological order
- Click the trash icon to delete
- Type badges show event category

---

### ⚔️ Matches (Matchs)
Schedule team matches and tournaments

**How to use:**
1. Click "MATCHS" tab
2. Fill in the form:
   - **Tournament**: Name of tournament
   - **Format**: Bo1, Bo3, or Bo5
   - **Team 1**: First team name
   - **Team 2**: Opponent team name
   - **Date**: Match date
   - **Time**: Match time
3. Click "Ajouter le match"

**Manage matches:**
- Click eye icon to hide/show on public schedule
- Click trash icon to delete
- Matches are sorted by date

**Status indicators:**
- No icon = Match is visible to public
- Eye-slash icon = Match is hidden from public

---

### 🤝 Scrims (Scrims)
Manage scrim requests from other teams

**How to use:**
1. Click "SCRIMS" tab
2. Use filter buttons to view:
   - **TOUTES**: All requests
   - **EN ATTENTE**: Pending requests
   - **ACCEPTÉES**: Accepted requests
   - **REFUSÉES**: Rejected requests

**Actions:**
- **Accepter**: Accept a pending scrim request
- **Refuser**: Reject a pending scrim request
- Buttons are disabled for non-pending requests

**Scrim Information:**
- Team name and email
- Preferred team level
- Available dates
- Additional details

---

## Design Features

### Navigation
- **Header**: Shows KJX branding and site navigation
- **Tabs**: Click any tab to switch sections
- **Active indicator**: Red underline shows current section

### Color Scheme
- **Red (#E2012D)**: Primary action and highlights
- **Dark backgrounds**: Easy on the eyes (#0F0F11, #1A1A1A)
- **Gray borders**: Separates content areas

### Interactions
- **Hover effects**: Cards highlight when you hover
- **Focus states**: Form inputs show red border when selected
- **Toast notifications**: Green popup confirms actions
- **Smooth transitions**: All animations are smooth (0.2-0.3s)

---

## Tips & Tricks

### 1. Data Persistence
All data is automatically saved to your browser's localStorage. Your data persists even after closing the browser.

### 2. Quick Navigation
- Use the top tab navigation to switch sections
- In Planning section, click any day card to select and edit it

### 3. Bulk Actions
While there's no bulk action feature, you can quickly add multiple items by:
1. Fill in the form
2. Click add
3. Form clears automatically
4. Fill in next item and repeat

### 4. Sort Order
- **Events**: Automatically sorted by date and time
- **Matches**: Automatically sorted by date and time
- **Scrims**: Can be filtered by status

### 5. Viewing Public Schedule
To see how your schedule appears on the public website:
1. Open the public site in another tab
2. Check which matches are visible (hidden ones won't show)
3. Use the eye icon to control visibility

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Submit form | `Enter` (in form fields) |
| Clear field | `Ctrl+A` then `Delete` |
| Quick hide/show match | Click eye icon |
| Delete item | Click trash icon |

---

## Troubleshooting

### Data Not Saving?
- Check if localStorage is enabled in your browser
- Clear browser cache and refresh
- Make sure you clicked the "Enregistrer" button

### Forms Not Working?
- Make sure all required fields are filled
- Check that dates are in valid format (YYYY-MM-DD)
- Refresh the page if form appears stuck

### Can't Login?
- Default credentials: `admin` / `admin123`
- Check Caps Lock is off
- Clear browser cookies and try again

### Changes Not Showing?
- Click the "Enregistrer" button
- Refresh the page (F5)
- Check localStorage isn't full

---

## Browser Requirements
- Chrome/Edge (latest) ✅
- Firefox (latest) ✅
- Safari (latest) ✅
- Mobile browsers ✅

---

## File Storage Locations

All data is stored in your browser under localStorage:
- `cgk_weekly_schedule` - Weekly planning
- `cgk_weekly_objectives` - Weekly objectives
- `cgk_events` - Events list
- `cgk_matches` - Matches list
- `cgk_scrim_requests` - Scrim requests
- `adminName` - Logged in username

---

## Getting Help

If you encounter issues:
1. Check the troubleshooting section above
2. Clear your browser cache
3. Make sure JavaScript is enabled
4. Try in a different browser
5. Check if the backend server is running (localhost:8080)

---

## Version Information
- **Admin Panel Version**: 2.0.0
- **Last Updated**: 2025-12-09
- **Angular Version**: 21.0.0
- **Tailwind CSS**: 4.1.12

---

**Enjoy managing your team! 🎮🏆**
