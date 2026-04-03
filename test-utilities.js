// Testing & Demo Utilities
// This file provides helper functions for testing and dementing the chess game

const GameTester = {
    // Test the chess engine
    testChessEngine() {
        console.log('=== Testing Chess Engine ===');
        
        const testEngine = new ChessEngine();
        testEngine.initGame();
        
        console.log('✓ Engine initialized');
        console.log('Board:', testEngine.getBoard());
        console.log('FEN:', testEngine.getFEN());
        
        // Test a few moves
        const moves = [
            { from: 'e2', to: 'e4' },
            { from: 'e7', to: 'e5' },
            { from: 'g1', to: 'f3' },
            { from: 'b8', to: 'c6' }
        ];
        
        moves.forEach(move => {
            const result = testEngine.makeMove(move.from, move.to);
            console.log(`Move ${move.from}${move.to}:`, result ? '✓' : '✗');
        });
        
        console.log('Move count:', testEngine.getMoveCount());
        console.log('=== Engine Test Complete ===\n');
    },

    // Test AI initialization
    async testAI() {
        console.log('=== Testing AI ===');
        
        try {
            console.log('Stockfish ready:', ai.isReady);
            
            // Test with starting position
            const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
            console.log('Testing move on starting position...');
            
            const move = await ai.getBestMove(fen);
            console.log('AI suggested move:', move);
            
            console.log('✓ AI test complete');
        } catch (error) {
            console.error('✗ AI test failed:', error);
        }
        
        console.log('=== AI Test Complete ===\n');
    },

    // Test the game UI
    testGameUI() {
        console.log('=== Testing Game UI ===');
        
        const elements = [
            '#chessBoard',
            '#gameStatus',
            '#currentTurn',
            '#movesList',
            '#newGameBtn',
            '#undoBtn'
        ];
        
        let allFound = true;
        elements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                console.log(`✓ Found ${selector}`);
            } else {
                console.log(`✗ Missing ${selector}`);
                allFound = false;
            }
        });
        
        if (allFound) {
            console.log('All UI elements found!');
        } else {
            console.log('Some UI elements are missing');
        }
        
        console.log('=== UI Test Complete ===\n');
    },

    // Run all tests
    async runAllTests() {
        console.log('\n' + '='.repeat(50));
        console.log('CHESS GAME TEST SUITE');
        console.log('='.repeat(50) + '\n');
        
        this.testGameUI();
        this.testChessEngine();
        await this.testAI();
        
        console.log('='.repeat(50));
        console.log('ALL TESTS COMPLETE');
        console.log('='.repeat(50) + '\n');
    },

    // Demo a full game
    async playDemoGame() {
        console.log('\n' + '='.repeat(50));
        console.log('PLAYING DEMO GAME');
        console.log('='.repeat(50) + '\n');
        
        const demoEngine = new ChessEngine();
        demoEngine.initGame();
        
        let moveCount = 0;
        const maxMoves = 20;
        
        while (!demoEngine.isGameOver() && moveCount < maxMoves) {
            const moves = demoEngine.getAllLegalMoves();
            
            if (moves.length === 0) break;
            
            // Random move
            const randomMove = moves[Math.floor(Math.random() * moves.length)];
            const move = demoEngine.makeMove(randomMove.from, randomMove.to);
            
            if (move) {
                console.log(`Move ${moveCount + 1}: ${move.san}`);
                moveCount++;
            }
        }
        
        const status = demoEngine.getGameStatus();
        console.log(`\nGame ended after ${moveCount} moves`);
        console.log('Status:', status);
        console.log('Final FEN:', demoEngine.getFEN());
        
        console.log('='.repeat(50));
        console.log('DEMO GAME COMPLETE');
        console.log('='.repeat(50) + '\n');
    },

    // Performance test
    performanceTest() {
        console.log('\n=== Performance Test ===\n');
        
        console.time('Engine initialization');
        const eng = new ChessEngine();
        console.timeEnd('Engine initialization');
        
        console.time('Generate all moves (100 times)');
        for (let i = 0; i < 100; i++) {
            eng.getAllLegalMoves();
        }
        console.timeEnd('Generate all moves (100 times)');
        
        console.time('Make 100 moves');
        const moveEng = new ChessEngine();
        const moves = [];
        for (let i = 0; i < 100; i++) {
            const allMoves = moveEng.getAllLegalMoves();
            if (allMoves.length > 0) {
                const move = allMoves[Math.floor(Math.random() * allMoves.length)];
                moveEng.makeMove(move.from, move.to);
            }
        }
        console.timeEnd('Make 100 moves');
        
        console.log('=== Performance Test Complete ===\n');
    },

    // Check browser compatibility
    checkCompatibility() {
        console.log('\n=== Checking Compatibility ===\n');
        
        const features = {
            'ES6 Support': typeof Promise !== 'undefined',
            'Web Workers': typeof Worker !== 'undefined',
            'Local Storage': typeof localStorage !== 'undefined',
            'Session Storage': typeof sessionStorage !== 'undefined',
            'Fetch API': typeof fetch !== 'undefined',
            'Canvas': typeof HTMLCanvasElement !== 'undefined',
            'WebGL': !!document.createElement('canvas').getContext('webgl'),
            'Service Workers': 'serviceWorker' in navigator,
            'WebAssembly': typeof WebAssembly !== 'undefined'
        };
        
        for (const [feature, supported] of Object.entries(features)) {
            console.log(`${supported ? '✓' : '✗'} ${feature}`);
        }
        
        console.log('\n=== Compatibility Check Complete ===\n');
    },

    // Get game stats
    getGameStats() {
        if (!game) {
            console.log('Game not initialized yet');
            return;
        }
        
        console.log('\n=== Current Game Stats ===\n');
        console.log('Player Color:', game.playerColor === 'w' ? 'White' : 'Black');
        console.log('AI Color:', game.aiColor === 'w' ? 'White' : 'Black');
        console.log('Difficulty:', game.difficulty);
        console.log('Move Count:', engine.getMoveCount());
        console.log('Game Status:', engine.getGameStatus());
        console.log('Current Turn:', engine.getCurrentTurn() === 'w' ? 'White' : 'Black');
        console.log('In Check:', engine.isInCheck());
        console.log('Game Over:', engine.isGameOver());
        console.log('Captured Pieces:', engine.getCapturedPieces());
        console.log('\n=== Stats Complete ===\n');
    },

    // Quick play a simple game
    quickPlay() {
        console.log('Starting quick play test...');
        if (game) {
            game.newGame();
            console.log('Game reset and ready to play!');
            console.log('Type: game.getGameStats() to see current state');
        }
    },

    // Show all available test commands
    showHelp() {
        console.log(`
╔════════════════════════════════════════════════════════╗
║         CHESS GAME TEST UTILITIES HELP                 ║
╚════════════════════════════════════════════════════════╝

QUICK COMMANDS:
  GameTester.runAllTests()          - Run all tests
  GameTester.playDemoGame()         - Play a demo game
  GameTester.performanceTest()      - Test performance
  GameTester.checkCompatibility()   - Check browser support
  GameTester.getGameStats()         - Show current game stats
  GameTester.quickPlay()            - Reset and quick play

INDIVIDUAL TESTS:
  GameTester.testGameUI()           - Test UI elements
  GameTester.testChessEngine()      - Test chess logic
  GameTester.testAI()               - Test AI engine

DEBUG HELPERS:
  game.newGame()                    - Start new game
  engine.getFEN()                   - Get current position
  engine.getPGN()                   - Get game in PGN format
  engine.getFormattedMoveHistory()  - Get all moves
  game.getGameStats()               - Show game stats

SETTINGS:
  game.setDifficulty('easy')        - Change AI difficulty
  game.setDifficulty('medium')      - 
  game.setDifficulty('hard')        -

CONSOLE TIPS:
  - Open browser console: F12 or Ctrl+Shift+I
  - Copy/paste test commands directly into console
  - Use arrow keys to recall previous commands

════════════════════════════════════════════════════════════
        `);
    }
};

// Make GameTester available globally
window.GameTester = GameTester;
window.gt = GameTester; // Shorthand

// Auto-show help when DevTools opens (if in development)
console.log('%c🎮 Chess Game - Debug Utilities Ready!', 'color: #42c72c; font-size: 14px; font-weight: bold;');
console.log('%cType GameTester.showHelp() to see available commands', 'color: #666; font-size: 12px;');
