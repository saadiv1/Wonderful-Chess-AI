# 🎮 AI CHESS GAME - START HERE

Welcome to your complete AI Chess game! This guide will get you playing in minutes.

---

## ⚡ Quick Start (3 Steps)

### 1️⃣ Start a Server
Choose ONE method:

**Option A - Python (Easiest):**
```bash
# Open PowerShell/Terminal in this folder, then:
python -m http.server 8000
```

**Option B - Node.js:**
```bash
npm install -g http-server
http-server
```

**Option C - VS Code:**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

### 2️⃣ Open Game
Go to your browser:
```
http://localhost:8000
```

### 3️⃣ Play!
- Click white pieces to move
- AI responds automatically
- Enjoy! ♟♚

---

## 📚 Documentation

| Document | For... |
|----------|--------|
| **README.md** | Full features & technical info |
| **QUICK_START.md** | How to play & controls |
| **INSTALLATION.md** | Detailed setup for all platforms |
| **config.js** | Customization settings |

---

## 🎯 First Time Players

1. Read: **QUICK_START.md** (5 min read)
2. Open: **http://localhost:8000** in browser
3. Click pieces and start playing
4. Try "Undo" button if you make a mistake

---

## 🛠️ Troubleshooting

**Problem: Game won't load**
→ See **INSTALLATION.md** "Troubleshooting" section

**Problem: Can't move pieces**
→ Check if it's your turn (white indicator shows)
→ Legal moves must be highlighted

**Problem: AI not responding**
→ Game uses fallback AI if Stockfish unavailable
→ Check internet connection for fastest AI

---

## 📱 On Mobile Device

1. **Get computer IP:**
   ```bash
   # Windows: ipconfig
   # Mac/Linux: ifconfig
   ```
2. **On your phone/tablet browser:**
   ```
   http://YOUR_COMPUTER_IP:8000
   ```
3. **Play!** Board auto-resizes for your device

---

## 🎮 Game Features

✨ **Complete Chess**
- All 6 piece types with correct rules
- Castling, en passant, pawn promotion
- Check, checkmate, stalemate detection

🤖 **AI Opponent**
- 3 difficulty levels: Easy, Medium, Hard
- Stockfish engine (strongest chess AI)
- Fallback AI for offline play

📊 **Game Tracking**
- Move history display
- Captured pieces counter
- Game status indicator
- Undo moves feature

📱 **Responsive Design**
- Works on desktop, tablet, phone
- Touch-friendly interface
- Auto-scales to screen size

---

## 🎯 Controls

| Action | How |
|--------|-----|
| **Select Piece** | Click on it |
| **Move Piece** | Click destination |
| **Deselect** | Click same piece again or press ESC |
| **Legal Moves** | Shown as dots/rings |
| **New Game** | Click "New Game" button |
| **Undo Move** | Click "Undo" button |
| **Reset** | Click "Reset" button |

---

## ⚙️ Customization

### Change Difficulty
In browser console (F12):
```javascript
game.setDifficulty('easy')     // 'easy', 'medium', 'hard'
```

### Change Board Colors
Edit `styles.css`:
```css
--primary-light: #f0e6d2;     /* Light squares */
--primary-dark: #b58863;      /* Dark squares */
--highlight: #baca44;         /* Highlights */
```

### More Options
See `config.js` file for all settings

---

## 🧪 Testing & Debug

### In Browser Console (F12):
```javascript
// Show help
GameTester.showHelp()

// Quick diagnostics
GameTester.checkCompatibility()

// Test game
GameTester.runAllTests()

// View stats
game.getGameStats()

// Get current position
engine.getFEN()
```

---

## 📖 File Structure

```
├── index.html          ← OPEN THIS IN BROWSER
├── styles.css          ← Visual appearance
├── main.js             ← Game controller
├── chess-engine.js     ← Chess rules
├── ai.js              ← AI opponent
├── config.js          ← Settings
├── test-utilities.js  ← Debug tools
├── package.json       ← Project info
├── README.md          ← Full docs
├── QUICK_START.md     ← How to play
├── INSTALLATION.md    ← Setup guide
└── START_HERE.md      ← You are here!
```

---

## 🚀 Next Steps

1. **Get it running:** Follow "Quick Start" above (2 minutes)
2. **Learn to play:** Read QUICK_START.md (5 minutes)
3. **Customize it:** Edit colors/settings in files
4. **Share it:** Upload to Netlify/Vercel for online play

---

## 🌐 Play Online

Want to share with friends?

**Free Hosting Options:**
1. **Netlify** (netlify.com) - Drag & drop folder
2. **Vercel** (vercel.com) - Connect GitHub
3. **GitHub Pages** (github.com) - Free static hosting

---

## 💡 Tips for Better Play

**Opening**
- Control the center (e4, d4, etc.)
- Develop pieces early (knights, bishops)
- Don't move queen too early

**Middle Game**
- Look for checks and captures
- Protect your pieces
- Attack opponent's weak points

**Endgame**
- Promote pawns for new pieces
- Use king actively
- Simplify when ahead material

---

## 🎓 Learn Chess

Wanting to improve? Try:
- **Chess.com** - Online lessons & puzzles
- **Lichess.org** - Free chess platform
- **Chesstempo** - Hundreds of tactics
- **YouTube** - Chess channels & strategies

---

## 📝 Notes

- **Internet required** for Stockfish AI (CDN download)
- **Works offline** with fallback AI
- **No data collected** - all game data in-browser
- **Open source** - modify as you like!

---

## ❌ Still Having Issues?

1. **Read** INSTALLATION.md troubleshooting section
2. **Check** browser console (F12) for errors
3. **Try** different browser (Chrome, Firefox, Safari)
4. **Update** your browser to latest version
5. **Do** hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)

---

## 🎉 Ready?

1. Open terminal/PowerShell in this folder
2. Run: `python -m http.server 8000`
3. Go to: `http://localhost:8000`
4. **Play!** ♟♚

---

## 📧 Questions?

- See **README.md** for detailed features
- Check **QUICK_START.md** for gameplay questions
- Review **INSTALLATION.md** for setup issues
- Open browser console (F12) to see error messages

---

**Enjoy your chess game!** 🎮♟♚

Next: → Open a terminal and start the server (see Quick Start above)
