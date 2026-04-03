# Installation & Setup Guide

## 📋 System Requirements

### Minimum Requirements
- **Browser**: Any modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **RAM**: 512 MB
- **Storage**: 5 MB
- **Internet**: Required for first load (can work offline with cached files)

### Recommended
- **Browser**: Latest version of Chrome, Firefox, or Safari
- **RAM**: 2 GB+
- **Connection**: Stable internet (for Stockfish AI CDN)

### Device Support
- ✅ Desktop (Windows, macOS, Linux)
- ✅ Laptop
- ✅ Tablet (iPad, Android tablets)
- ✅ Smartphone (iOS, Android)

---

## 🔧 Installation Methods

### Method 1: Browser Direct (Simplest - No Setup)
Perfect for trying the game immediately without any setup.

1. **Open `index.html`** in your browser
   - Double-click the file, or
   - Drag & drop into browser, or
   - Right-click → Open with → Your browser

2. **Game loads immediately**
   - ⚡ Works offline (with fallback AI)
   - 🎮 Full game experience

⚠️ **Note**: Stockfish AI (strongest) requires internet. Game falls back to SimpleAI offline.

---

### Method 2: Python Built-in Server (Recommended)

**Why use a server?**
- Avoids CORS (Cross-Origin) issues
- Better performance
- Stockfish AI works properly
- Recommended for smooth experience

#### Windows:

**PowerShell:**
```powershell
# Navigate to game folder
cd "C:\Users\swift\.vscode\AI Chess"

# Start server (Choose one)
python -m http.server 8000          # Python 3
python3 -m http.server 8000         # Python 3 (alternative)
```

**Command Prompt:**
```cmd
cd C:\Users\swift\.vscode\AI Chess
python -m http.server 8000
```

**Git Bash:**
```bash
cd "/c/Users/swift/.vscode/AI Chess"
python -m http.server 8000
```

#### macOS/Linux:

```bash
cd ~/path/to/AI\ Chess
python3 -m http.server 8000

# Or if you have Python 2
python -m SimpleHTTPServer 8000
```

**Then open in browser:**
```
http://localhost:8000
```

✅ **Ctrl+C** to stop the server

---

### Method 3: Node.js HTTP Server

#### Step 1: Install Node.js (if not already installed)
- Download from: https://nodejs.org/
- Install the LTS (Long Term Support) version
- Verify: Open terminal and type `node --version`

#### Step 2: Install http-server globally (one-time)
```bash
npm install -g http-server
```

#### Step 3: Start the server
```bash
cd path/to/AI\ Chess
http-server
```

#### Step 4: Open in browser
```
http://localhost:8080
```

✅ The `-o` flag auto-opens browser: `http-server -o`

---

### Method 4: VS Code Live Server Extension

#### Step 1: Install Live Server
- Open VS Code
- Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
- Search for "Live Server"
- Install extension by Ritwick Dey

#### Step 2: Open with Live Server
- Right-click `index.html` in file explorer
- Select "Open with Live Server"
- Browser opens automatically at http://127.0.0.1:5500

#### Step 3: Auto-reload
- Page reloads automatically when you save files
- Perfect for development

---

### Method 5: Docker Container (Advanced)

#### Create Dockerfile:
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
```

#### Build and run:
```bash
docker build -t ai-chess .
docker run -p 8080:80 ai-chess
```

#### Open browser:
```
http://localhost:8080
```

---

## 🍃 Mac/Linux Terminal Setup

### Using Zsh or Bash:

```bash
# Clone or navigate to the directory
cd ~/.vscode/AI\ Chess

# Start Python server
python3 -m http.server 8000

# Output will show:
# Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

### Open in browser:
```
http://localhost:8000
```

---

## 🎯 Verifying Installation

### Check if game works:
1. ✅ Open the game URL
2. ✅ Chess board displays
3. ✅ Can select and move pieces
4. ✅ AI responds with moves
5. ✅ Move history updates

### Troublershoot if not working:
- **Game won't load**: Close browser cache (Ctrl+Shift+Delete)
- **Can't move pieces**: Check console (F12) for errors
- **AI not responsive**: Check internet connection
- **Board looks wrong**: Refresh page (Ctrl+R)

---

## 📂 File Structure

```
AI Chess/
├── index.html          # Main game file (open this)
├── styles.css          # Game appearance
├── chess-engine.js     # Chess logic
├── ai.js              # AI opponent
├── main.js            # Game controller
├── config.js          # Settings (optional)
├── package.json       # Project info
├── README.md          # Full documentation
├── QUICK_START.md     # Quick reference
└── INSTALLATION.md    # This file
```

---

## 🚀 Running on Different Devices

### Desktop/Laptop
1. **Easiest**: Use Python server (Method 2)
2. **Alternative**: VS Code Live Server (Method 4)

### iPad/iPhone
1. **On same WiFi**: Get computer IP (ipconfig / ifconfig)
2. **In browser**: http://YOUR_IP:8000
3. **Or**: Use VS Code's Live Server preview URL

### Android Phone/Tablet
1. **On same WiFi**: Get computer IP
2. **In Chrome**: http://YOUR_IP:8000
3. **Full responsive**: Game adapts to screen

### How to get your computer's IP address:

**Windows (PowerShell):**
```powershell
ipconfig | findstr "IPv4"
```

**Mac/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Then on mobile device:
```
http://YOUR_IP:8000
```

---

## 🔌 Network Access

### Local Network Only (Most Secure)
```bash
python -m http.server 8000
# Only accessible on your network or localhost
```

### Public Internet (Less Secure)
```bash
# Not recommended for security reasons
# But if needed, use cloud hosting (Heroku, Netlify, Vercel)
```

### Recommended: Use a Game Streaming Service
- Upload to Netlify (free): https://netlify.com
- Upload to Vercel (free): https://vercel.com
- Upload to GitHub Pages: https://pages.github.com

---

## 🐛 Troubleshooting Common Issues

### Issue: "Cannot GET /"
**Cause:** Server not started or wrong URL
**Solution:** 
- Make sure you ran `python -m http.server 8000`
- Open http://localhost:8000 (not http://localhost:8000/)
- Check server is running in terminal

### Issue: "CORS error" or "Failed to fetch"
**Cause:** Opening file directly without server
**Solution:**
- Use one of the server methods above
- Don't double-click index.html directly

### Issue: Page loads but board is blank
**Cause:** Likely JavaScript error
**Solution:**
- Open Browser DevTools: F12
- Check Console tab for red errors
- Try refreshing: Ctrl+R or Cmd+R
- Clear cache: Ctrl+Shift+Delete

### Issue: AI won't move after 30 seconds
**Cause:** Stockfish API timeout
**Solution:**
- Game uses fallback AI automatically
- Continue playing normally
- Check your internet connection

### Issue: Board looks zoomed out/in on mobile
**Cause:** Browser zoom level
**Solution:**
- Mobile: Pinch to zoom normally
- Reset zoom: Ctrl+0 / Cmd+0
- Refresh page: Ctrl+R

### Issue: Pieces look weird or show as boxes
**Cause:** Unicode font issue
**Solution:**
- Update browser to latest version
- Try different browser
- Clear cache and reload

---

## ⚙️ Configuration After Installation

### Change Default Difficulty
Edit `main.js`, find the line:
```javascript
game.setDifficulty('medium');
```
Change to: `'easy'`, `'medium'`, or `'hard'`

### Change Colors
Edit `styles.css` `:root` section:
```css
--primary-light: #f0e6d2;    /* Light squares */
--primary-dark: #b58863;     /* Dark squares */
```

### Enable Debug Mode
Edit `config.js`:
```javascript
debug: {
    enabled: true         // For development help
}
```

---

## 📱 Mobile-Specific Setup

### iOS (iPhone/iPad):
1. Get computer IP: Open Terminal
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
2. On iPad Safari: Type `http://YOUR_IP:8000`
3. Add to Home Screen for app-like experience

### Android:
1. Get computer IP: Open PowerShell/Terminal
2. On Android Chrome: Type `http://YOUR_IP:8000`
3. Add to Home Screen for shortcut

### Both:
- Game automatically detects phone/tablet
- Board resizes to fit screen
- Touch controls work perfectly

---

## 🆘 Getting Help

1. **Check README.md** for detailed features
2. **See QUICK_START.md** for gameplay tips
3. **Browser Console (F12)** for error messages
4. **Update browser** to latest version
5. **Try different browser** if issues persist

---

## ✅ Installation Checklist

After setup, verify:
- [ ] Server is running
- [ ] Browser opens http://localhost:8000
- [ ] Board displays correctly
- [ ] Can click/move pieces
- [ ] AI responds to your moves
- [ ] Move history shows moves
- [ ] Game works on mobile device

---

## 🎉 Ready to Play!

Your chess game is now set up and ready to enjoy. Start playing against the AI and have fun! ♟♚

For questions or issues, refer to README.md or check browser console (F12) for error details.

**Good luck!** 🎮
