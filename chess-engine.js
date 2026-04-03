// Chess Engine - Handles game logic and board state
class ChessEngine {
    constructor() {
        this.game = new Chess();
        this.moveHistory = [];
        this.capturedPieces = {
            white: [],
            black: []
        };
        this.selectedSquare = null;
        this.legalMoves = [];
    }

    // Initialize a new game
    initGame() {
        this.game = new Chess();
        this.moveHistory = [];
        this.capturedPieces = {
            white: [],
            black: []
        };
        this.selectedSquare = null;
        this.legalMoves = [];
    }

    // Get current board state
    getBoard() {
        return this.game.board();
    }

    // Get possible moves for a square
    getMoves(square) {
        const moves = this.game.moves({ square: square, verbose: true });
        return moves;
    }

    // Get all legal moves
    getAllLegalMoves() {
        return this.game.moves({ verbose: true });
    }

    // Make a move
    makeMove(from, to, promotion = null) {
        try {
            const moveObj = {
                from: from,
                to: to
            };

            // Add promotion if applicable
            if (promotion) {
                moveObj.promotion = promotion;
            }

            const move = this.game.move(moveObj);

            if (move) {
                // Track captured pieces
                if (move.captured) {
                    const capturingColor = move.color === 'w' ? 'white' : 'black';
                    this.capturedPieces[capturingColor].push(move.captured);
                }

                // Add to history
                this.moveHistory.push(move);
                return move;
            }

            return null;
        } catch (e) {
            console.error('Invalid move:', from, to);
            return null;
        }
    }

    // Undo last move
    undoMove() {
        const move = this.game.undo();
        if (move) {
            this.moveHistory.pop();

            // Remove from captured pieces
            if (move.captured) {
                const capturingColor = move.color === 'w' ? 'white' : 'black';
                this.capturedPieces[capturingColor].pop();
            }

            return true;
        }
        return false;
    }

    // Get game status
    getGameStatus() {
        if (this.game.in_checkmate()) {
            return 'checkmate';
        }
        if (this.game.in_draw()) {
            return 'draw';
        }
        if (this.game.in_stalemate()) {
            return 'stalemate';
        }
        if (this.game.insufficient_material()) {
            return 'insufficient_material';
        }
        if (this.game.in_check()) {
            return 'check';
        }
        return 'ongoing';
    }

    // Get current turn (w or b)
    getCurrentTurn() {
        return this.game.turn();
    }

    // Get move history as formatted strings
    getFormattedMoveHistory() {
        return this.game.history({ verbose: false });
    }

    getMoveHistoryVerbose() {
        return this.moveHistory.map(move => ({ ...move }));
    }

    getPreviewState(moveCount = this.moveHistory.length) {
        const previewGame = new Chess();
        const cappedMoveCount = Math.max(0, Math.min(moveCount, this.moveHistory.length));
        const previewCaptured = {
            white: [],
            black: []
        };

        for (let index = 0; index < cappedMoveCount; index++) {
            const sourceMove = this.moveHistory[index];
            const move = previewGame.move({
                from: sourceMove.from,
                to: sourceMove.to,
                promotion: sourceMove.promotion
            });

            if (move && move.captured) {
                const capturingColor = move.color === 'w' ? 'white' : 'black';
                previewCaptured[capturingColor].push(move.captured);
            }
        }

        let status = 'ongoing';
        if (previewGame.in_checkmate()) {
            status = 'checkmate';
        } else if (previewGame.in_draw()) {
            status = 'draw';
        } else if (previewGame.in_stalemate()) {
            status = 'stalemate';
        } else if (previewGame.insufficient_material()) {
            status = 'insufficient_material';
        } else if (previewGame.in_check()) {
            status = 'check';
        }

        return {
            board: previewGame.board(),
            currentTurn: previewGame.turn(),
            moveCount: cappedMoveCount,
            capturedPieces: previewCaptured,
            status
        };
    }

    // Get PGN (Portable Game Notation)
    getPGN() {
        return this.game.pgn();
    }

    // Load FEN position
    loadFEN(fen) {
        try {
            this.game = new Chess(fen);
            this.moveHistory = [];
            this.capturedPieces = { white: [], black: [] };
            return true;
        } catch (e) {
            console.error('Invalid FEN:', fen);
            return false;
        }
    }

    // Get FEN position
    getFEN() {
        return this.game.fen();
    }

    // Get piece at square
    getPieceAt(square) {
        return this.game.get(square);
    }

    // Check if king is in check
    isInCheck() {
        return this.game.in_check();
    }

    // Check if game is over
    isGameOver() {
        return this.game.game_over();
    }

    // Get captured pieces
    getCapturedPieces() {
        return this.capturedPieces;
    }

    // Get move count
    getMoveCount() {
        return this.moveHistory.length;
    }

    // Validate move
    isValidMove(from, to) {
        const moves = this.getMoves(from);
        return moves.some(move => move.to === to);
    }

    // Get game summary
    getGameSummary() {
        return {
            fen: this.getFEN(),
            pgn: this.getPGN(),
            moveCount: this.getMoveCount(),
            status: this.getGameStatus(),
            currentTurn: this.getCurrentTurn(),
            capturedPieces: this.capturedPieces
        };
    }

    // Reset to starting position
    reset() {
        this.initGame();
    }
}

// Initialize game engine
const engine = new ChessEngine();
