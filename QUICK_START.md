# Quick Start Guide - AI Chess Game

## 🚀 Getting Started (Choose One Method)

### Method 1: Direct Browser (Easiest)
1. Open `index.html` directly in your web browser
2. Game loads immediately
3. Start playing against the AI!

**Note:** Works best with a local server to avoid CORS issues.

---

### Method 2: Python Local Server (Recommended)

**Windows (PowerShell):**
```powershell
cd "path\to\AI Chess"
python -m http.server 8000
```

**Windows (Command Prompt):**
```cmd
cd path\to\AI Chess
python -m http.server 8000
```

**macOS/Linux:**
```bash
cd path/to/AI\ Chess
python3 -m http.server 8000
```

Then open: **http://localhost:8000**

---

### Method 3: Node.js Local Server

**Install http-server (one time):**
```bash
npm install -g http-server
```

**Run the server:**
```bash
cd path/to/AI\ Chess
http-server
```

Then open: **http://localhost:8080**

---

### Method 4: VS Code Live Server Extension

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. Browser opens automatically

---

## 🎮 How to Play

### Starting the Game
- Board appears with all pieces in starting position
- You are **White** (bottom of board)
- AI is **Black** (top of board)

### Making Your Move
1. **Click** a white piece to select it
2. Legal moves highlighted:
   - Small dots (●) = move to empty square
   - Rings (◯) = capture an opponent piece
3. **Click** destination to move

### AI Makes Its Move
- Watch the "AI is thinking..." indicator
- AI responds automatically
- Move appears on board and in move history

### Game Controls
| Button | Action |
|--------|--------|
| New Game | Start fresh game |
| Reset | Clear board to start position |
| Undo | Take back last move |

---

## 📊 Understanding the Interface

### Left Side - Chess Board
- Standard 8x8 chess board
- Light and dark squares
- Coordinates for reference

### Right Side - Game Info Panel

#### Move History
- Records all moves in chess notation
- Scrollable for long games
- Last move highlighted

#### Captured Pieces
- Shows pieces taken by each player
- White captures displayed for you
- Black captures displayed for AI

#### Game Controls
- **Current Turn**: Who's moving
- **Difficulty**: AI skill level
- **Your Color**: Confirms you play White
- Control buttons at bottom

---

## ⚙️ Customization

### Change Difficulty Before Game
Add this to the browser console (F12):
```javascript
game.setDifficulty('easy');     // 'easy', 'medium', 'hard'
```

### Change Starting Color
In `main.js`, find line with `this.playerColor = 'w';` and change to:
```javascript
this.playerColor = 'b';  // Play as Black
```

### Customize Board Colors
Edit `styles.css` `:root` section:
```css
:root {
    --primary-light: #f0e6d2;    /* Light squares */
    --primary-dark: #b58863;     /* Dark squares */
    --highlight: #baca44;        /* Selection highlight */
    /* ... other colors ... */
}
```

---

## 📱 Mobile Play

The game is fully responsive!

### On Mobile Device
- Open `index.html` URL on phone/tablet
- Touch pieces to select
- Tap destination to move
- All UI adapts to screen size
- Pinch-zoom disabled for better gameplay

### Recommended Mobile Browsers
- Chrome Mobile (Android)
- Safari (iPhone/iPad)
- Firefox Mobile
- Edge Mobile

---

## 🆘 Troubleshooting

### "Game not loading"
- ✅ Solution: Use a local server (Method 1-4 above)
- ✅ Check: Browser console (F12) for errors
- ✅ Try: Different browser (Chrome/Firefox/Safari)

### "AI not responding"
- ✅ Solution: Game uses fallback AI if Stockfish unavailable
- ✅ Check: Internet connection (Stockfish downloads from CDN)
- ✅ Try: Reloading page

### "Board looks stretched on mobile"
- ✅ Solution: Automatic - refresh page
- ✅ Try: Rotation lock off, rotate device
- ✅ Check: Browser zoom is 100%

### "Can't move pieces"
- ✅ Solution: Wait for AI to finish thinking
- ✅ Check: It's your turn (indicator shows "White")
- ✅ Try: Valid moves only (highlighted squares)

### "Game freezes on Hard difficulty"
- ✅ Solution: AI thinks longer on hard - be patient (up to 30 seconds)
- ✅ Try: Medium difficulty instead
- ✅ Check: Browser not using excessive CPU (other tabs open?)

---

## 💻 Browser Requirements

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full Support |
| Firefox | 88+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |
| Edge | 90+ | ✅ Full Support |
| Mobile Browsers | Latest | ✅ Full Support |

---

## 📚 Learn More

See **README.md** for:
- Detailed feature list
- Chess rules explanation
- Technical architecture
- Advanced customization options
- Future enhancements

---

## 🎯 Tips for Better Play

1. **Opening**: Develop pieces early, control center
2. **Middle Game**: Look for checks and captures
3. **Endgame**: Use pawns and position advantage
4. **Watch AI**: Learn from opponent's moves

Good luck! ♟♚

---

**Questions?** Check README.md or browser console (F12) for errors.
