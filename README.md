# ♟ AI Chess Game ♟

A fully-featured chess game with AI opponent, built for web and mobile browsers. Play against an intelligent AI using the Stockfish engine with fallback support.

## Features

✨ **Complete Chess Implementation**
- All original chess pieces with correct movement rules
- Full support for castling, en passant, and pawn promotion
- Check, checkmate, and draw detection (stalemate, insufficient material)
- Move validation and legal move highlighting

🤖 **Advanced AI Opponent**
- Powered by Stockfish chess engine
- Three difficulty levels: Easy, Medium, Hard
- Smart fallback AI with strategic move evaluation
- Smooth AI thinking with visual feedback

📱 **Responsive Design**
- Fully responsive layout for desktop and mobile
- Touch-friendly interface for tablets and phones
- Optimized board size based on screen dimensions
- Flexible sidebar for move history and game info

🎮 **Game Experience**
- Real-time move history tracking
- Captured pieces display
- Game status and turn indicator
- Undo last move functionality
- New game and reset options
- Visual highlighting of legal moves

## How to Play

### Setup
1. Open `index.html` in a modern web browser
2. The game loads automatically with you playing as White

### Making Moves
1. **Click** a piece to select it (highlighted in yellow)
2. Legal moves are shown as dots or rings
   - Small dots = regular moves
   - Large rings = capture moves
3. **Click** the destination square to move

### Controls
- **New Game** - Start a fresh game
- **Undo** - Take back the last move
- **Reset** - Return to starting position
- **ESC Key** - Deselect piece

## Difficulty Levels

- **Easy** - Random move selection with basic rules
- **Medium** (Default) - Balanced play with captures and checks prioritized
- **Hard** - Aggressive strategy with deeper analysis

To change difficulty, modify the `defaultDifficulty` in `main.js` or add UI controls.

## Game Rules

- **Castling**: Available if neither king nor rook has moved
- **En Passant**: Automatically handled for pawn captures
- **Pawn Promotion**: Automatically promotes to Queen (customizable)
- **Check**: When the king is under attack
- **Checkmate**: Check with no legal moves = opponent wins
- **Stalemate**: No legal moves available = Draw
- **Insufficient Material**: Insufficient pieces to checkmate = Draw

## Technical Details

### Technologies Used
- **Chess Logic**: chess.js library for game rules and state management
- **AI Engine**: Stockfish.js (WebAssembly) for intelligent moves
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Responsive Design**: CSS Grid and Flexbox with mobile-first approach

### File Structure
```
├── index.html          # Main HTML file with board and UI
├── styles.css          # Responsive styling and themes
├── chess-engine.js     # Game logic and board management
├── ai.js              # Stockfish integration and AI wrapper
├── main.js            # UI logic and game flow
└── README.md          # This file
```

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Running Locally

### Using Python (Simplest)
```bash
# Python 3
python -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

### Using Node.js (with http-server)
```bash
npm install -g http-server
http-server
```

Then open: `http://localhost:8080`

### Using Live Server (VS Code Extension)
1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

## Features Detail

### Move History
- Displays all moves in algebraic notation
- Updates in real-time as game progresses
- Scrollable for long games
- Last move is highlighted

### Captured Pieces
- Shows all pieces taken by each side
- Updates instantly
- Useful for material evaluation

### Game Status
- Current turn indicator with color
- Check/Checkmate/Draw notifications
- AI thinking indicator
- Difficulty level display

## Customization

### Change Difficulty
Edit `main.js` line with `game.setDifficulty()`:
```javascript
game.setDifficulty('hard'); // 'easy', 'medium', or 'hard'
```

### Custom AI
Replace the AI engine by modifying `ai.js` with your own algorithm while maintaining the same interface.

### Board Appearance
Customize colors in `styles.css` `:root` variables:
```css
--primary-light: #f0e6d2;  /* Light squares */
--primary-dark: #b58863;   /* Dark squares */
--highlight: #baca44;      /* Highlight color */
```

## Known Limitations

- Stockfish AI requires CDN access (works offline with fallback AI)
- Some mobile devices with limited RAM may experience slower AI thinking
- Stockfish.js uses WebAssembly (WASM) for best performance

## Future Enhancements

- [ ] Online multiplayer support
- [ ] Game saving/loading
- [ ] PGN import/export with analysis
- [ ] Opening move suggestions
- [ ] Endgame tablebases
- [ ] Move sounds and animations
- [ ] Different board themes
- [ ] Player vs Player mode
- [ ] Timed games

## License

This project uses open-source libraries:
- **chess.js** - MIT License
- **Stockfish.js** - GPL License (uses Stockfish engine)

## Credits

- Chess logic powered by [chess.js](https://github.com/jhlywa/chess.js)
- AI engine powered by [Stockfish](https://stockfishchess.org/)
- Beautiful board design inspired by classic chess UIs

## Support

For issues or suggestions:
1. Check browser console (F12) for errors
2. Ensure JavaScript is enabled
3. Clear browser cache if game won't load
4. Try a different browser for compatibility

Enjoy your chess game! ♟♚
