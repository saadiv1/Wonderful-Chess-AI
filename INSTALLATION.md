# Installation

Wonderful Chess does not need a build step. It is a small browser app.

## Recommended

Run a local server in the project folder:

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Other options

- VS Code Live Server
- Any static file server

## Browser support

Use a current version of Chrome, Edge, Firefox, or Safari.

## Common issues

`The page opens but the AI is weak or missing`

- Stockfish may not have loaded
- Reload the page and check your internet connection

`The game does not update after changes`

- Do a hard refresh with `Ctrl+F5`

`The file opens but some features act odd`

- Use a local server instead of opening the HTML file directly
