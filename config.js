// Game Configuration - Customize behavior and appearance
const GAME_CONFIG = {
    // Difficulty Settings
    difficulty: {
        default: 'medium', // 'easy', 'medium', 'hard', 'insane'
        levels: {
            easy: 10,     // Stockfish depth for easy
            medium: 22,   // Stockfish depth for medium
            hard: 30,     // Stockfish depth for hard
            insane: 36    // Stockfish depth for insane
        },
        undoLimits: {
            easy: 3,
            medium: 1,
            hard: 0,
            insane: 0
        },
        timedMoveDelayMs: {
            easy: 2400,
            medium: 1600,
            hard: 900,
            insane: 350
        }
    },

    // Game Rules
    rules: {
        enableCastling: true,        // Allow castling
        enableEnPassant: true,       // Allow en passant captures
        enablePawnPromotion: true,   // Allow pawn promotion
        promotionPiece: 'q',         // Default promotion piece ('q', 'r', 'b', 'n')
        enableThreefoldRepetition: true,
        enableFiftyMoveRule: true
    },

    // AI Settings
    ai: {
        useStockfish: true,          // Try to use Stockfish (falls back to SimpleAI)
        aiColor: 'b',                // AI color is synced from the chosen player side
        enableAutoMove: true,        // AI moves automatically
        moveDelay: 1000,             // Delay before AI moves (ms)
        timeoutSeconds: 30           // Max time for AI to think
    },

    // Player Settings
    player: {
        color: 'w',                  // Player starts as White ('w'), Black ('b'), or Random
        allowUndo: true,             // Allow undo moves
        undoLimit: 10                // Max undos per game (0 = unlimited)
    },

    // UI Settings
    ui: {
        showCoordinates: true,       // Show board coordinates
        showLegalMoves: true,        // Highlight legal moves
        showCapturedPieces: true,    // Display captured pieces
        showMoveHistory: true,       // Display move history
        animateMoves: true,          // Animate piece movement
        soundEnabled: true,          // Enable move sounds
        volume: 60,                  // Move sound volume (0-100)
        darkMode: false              // Start in dark theme when true
    },

    // Visual Settings
    board: {
        lightSquareColor: '#f0e6d2',
        darkSquareColor: '#b58863',
        highlightColor: '#baca44',
        checkHighlight: '#ff6b6b',
        moveHintColor: '#64c864',
        captureHintColor: '#c86464'
    },

    // Performance
    performance: {
        useWebWorkers: true,         // Use Web Workers for AI (if available)
        maxFrameRate: 60,            // Limit animation frame rate
        enableMobileOptimizations: true  // Optimize for mobile devices
    },

    // Development
    debug: {
        enabled: false,              // Enable debug mode
        logMoves: false,             // Log all moves to console
        logAI: false,                // Log AI calculations to console
        showFEN: false,              // Display FEN notation
        showPGN: false               // Display PGN notation
    }
};

// Function to get config value
function getConfig(path, defaultValue = null) {
    const keys = path.split('.');
    let value = GAME_CONFIG;
    
    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return defaultValue;
        }
    }
    
    return value;
}

// Function to set config value
function setConfig(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let obj = GAME_CONFIG;
    
    for (const key of keys) {
        if (!(key in obj)) {
            obj[key] = {};
        }
        obj = obj[key];
    }
    
    obj[lastKey] = value;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GAME_CONFIG;
}
