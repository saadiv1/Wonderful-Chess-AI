# Wonderful Chess

Wonderful Chess is a browser chess game with an AI opponent, move history, clocks, captured pieces, dark mode, and mobile support.

## What it includes

- Play as White, Black, or Random
- Difficulty levels from Easy to Insane
- Timers with increment
- Move history preview
- Pawn promotion choices
- Undo limits based on difficulty
- Desktop and mobile layouts

## Run it locally

The simplest way is to serve the folder and open it in your browser.

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

You can also use VS Code Live Server if you prefer.

## Main files

- `index.html` - page structure
- `styles.css` - layout and theme
- `main.js` - UI and game flow
- `chess-engine.js` - board state and rules
- `ai.js` - Stockfish and fallback AI
- `config.js` - default settings

## Notes

- Stockfish loads from a CDN, so the strongest AI works best with internet access.
- If Stockfish is unavailable, the game falls back to a simpler built-in AI.

## License / credits

This project uses `chess.js` for chess rules and Stockfish for analysis and move generation.
