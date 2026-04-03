// AI Engine - Uses Stockfish for chess AI
class ChessAI {
    constructor() {
        this.difficulty = 'medium'; // easy, medium, hard, insane
        this.stockfish = null;
        this.isReady = false;
        this.isThinking = false;
        this.bestMove = null;
        this.workerReady = false;
    }

    // Initialize Stockfish
    async init() {
        return new Promise((resolve) => {
            this.stockfish = new Worker('https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js');

            this.stockfish.addEventListener('message', (e) => {
                this.onMessage(e.data);
            });

            this.stockfish.postMessage('uci');

            const readyCheck = setInterval(() => {
                if (this.workerReady) {
                    clearInterval(readyCheck);
                    this.isReady = true;
                    resolve();
                }
            }, 50);

            setTimeout(() => {
                if (!this.workerReady) {
                    clearInterval(readyCheck);
                    this.isReady = true;
                    resolve();
                }
            }, 1500);
        });
    }

    // Handle messages from Stockfish
    onMessage(message) {
        if (message && typeof message === 'string') {
            if (message.includes('uciok')) {
                this.workerReady = true;
            }

            if (message.includes('bestmove')) {
                const match = message.match(/bestmove ([a-z0-9]+)/);
                if (match) {
                    this.bestMove = match[1];
                }
            }
        }
    }

    // Get best move for current position
    getBestMove(fen, depth = 20) {
        return new Promise((resolve) => {
            if (!this.stockfish) {
                resolve(null);
                return;
            }

            this.isThinking = true;
            this.bestMove = null;

            // Adjust depth based on difficulty
            let searchDepth = depth;
            let moveTimeMs = 1000;
            let skillLevel = 10;
            if (typeof getConfig === 'function') {
                searchDepth = getConfig(`difficulty.levels.${this.difficulty}`, depth);
                moveTimeMs = getConfig(`difficulty.searchTimeMs.${this.difficulty}`, moveTimeMs);
                skillLevel = getConfig(`difficulty.stockfishSkill.${this.difficulty}`, skillLevel);
            } else if (this.difficulty === 'easy') {
                searchDepth = 8;
                moveTimeMs = 350;
                skillLevel = 6;
            } else if (this.difficulty === 'medium') {
                searchDepth = 20;
                moveTimeMs = 900;
                skillLevel = 14;
            } else if (this.difficulty === 'hard') {
                searchDepth = 30;
                moveTimeMs = 2000;
                skillLevel = 18;
            } else if (this.difficulty === 'insane') {
                searchDepth = 36;
                moveTimeMs = 3500;
                skillLevel = 20;
            }

            const pollInterval = setInterval(() => {
                if (this.bestMove) {
                    clearInterval(pollInterval);
                    const move = this.bestMove;
                    this.bestMove = null;
                    this.isThinking = false;
                    resolve(move);
                }
            }, 100);

            setTimeout(() => {
                clearInterval(pollInterval);
                this.isThinking = false;
                resolve(this.bestMove || null);
            }, 30000); // 30 second timeout

            this.stockfish.postMessage(`position fen ${fen}`);
            this.stockfish.postMessage('setoption name UCI_LimitStrength value false');
            this.stockfish.postMessage(`setoption name Skill Level value ${skillLevel}`);
            this.stockfish.postMessage(`go depth ${searchDepth} movetime ${moveTimeMs}`);
        });
    }

    // Set difficulty level
    setDifficulty(level) {
        this.difficulty = level; // 'easy', 'medium', 'hard', 'insane'
    }

    // Get difficulty description
    getDifficultyDescription() {
        const descriptions = {
            'easy': 'Easy (Beginner)',
            'medium': 'Medium (Intermediate)',
            'hard': 'Hard (Advanced)',
            'insane': 'Insane (Master)'
        };
        return descriptions[this.difficulty] || 'Medium';
    }

    // Check if AI is thinking
    getIsThinking() {
        return this.isThinking;
    }

    // Terminate stockfish worker
    terminate() {
        if (this.stockfish) {
            this.stockfish.terminate();
        }
    }
}

// Initialize AI
const ai = new ChessAI();
ai.init().catch(err => console.error('Failed to initialize AI:', err));

// Simpler AI for fallback (random moves with some basic strategy)
class SimpleAI {
    constructor() {
        this.difficulty = 'medium';
        this.pieceValues = {
            p: 100,
            n: 320,
            b: 330,
            r: 500,
            q: 900,
            k: 20000
        };
    }

    setDifficulty(level) {
        this.difficulty = level;
    }

    getBestMove(fen) {
        const game = new Chess(fen);
        const moves = game.moves({ verbose: true });

        if (moves.length === 0) {
            return null;
        }

        if (this.difficulty === 'easy') {
            const scoredMoves = moves.map(move => ({
                move,
                score: this.scoreMove(game, move) + Math.random() * 40
            }));
            scoredMoves.sort((a, b) => b.score - a.score);
            const topChoices = scoredMoves.slice(0, Math.min(3, scoredMoves.length));
            const selected = topChoices[Math.floor(Math.random() * topChoices.length)].move;
            return selected.from + selected.to + (selected.promotion || '');
        }

        const searchDepth = typeof getConfig === 'function'
            ? getConfig(`difficulty.fallbackDepth.${this.difficulty}`, 2)
            : 2;
        const maximizingColor = game.turn();
        let bestScore = -Infinity;
        let bestMove = moves[0];
        let alpha = -Infinity;
        let beta = Infinity;

        const orderedMoves = moves
            .map(move => ({ move, orderScore: this.scoreMove(game, move) }))
            .sort((a, b) => b.orderScore - a.orderScore)
            .map(entry => entry.move);

        for (const move of orderedMoves) {
            const nextGame = new Chess(fen);
            nextGame.move({ from: move.from, to: move.to, promotion: move.promotion || 'q' });

            const score = this.minimax(nextGame, searchDepth - 1, alpha, beta, false, maximizingColor);
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }

            alpha = Math.max(alpha, bestScore);
        }

        return bestMove.from + bestMove.to + (bestMove.promotion || '');
    }

    minimax(game, depth, alpha, beta, maximizingPlayer, maximizingColor) {
        if (depth <= 0 || game.game_over()) {
            return this.evaluatePosition(game, maximizingColor);
        }

        const moves = game.moves({ verbose: true })
            .map(move => ({ move, orderScore: this.scoreMove(game, move) }))
            .sort((a, b) => b.orderScore - a.orderScore)
            .map(entry => entry.move);

        if (maximizingPlayer) {
            let maxEval = -Infinity;
            for (const move of moves) {
                const nextGame = new Chess(game.fen());
                nextGame.move({ from: move.from, to: move.to, promotion: move.promotion || 'q' });
                const evaluation = this.minimax(nextGame, depth - 1, alpha, beta, false, maximizingColor);
                maxEval = Math.max(maxEval, evaluation);
                alpha = Math.max(alpha, evaluation);
                if (beta <= alpha) {
                    break;
                }
            }
            return maxEval;
        }

        let minEval = Infinity;
        for (const move of moves) {
            const nextGame = new Chess(game.fen());
            nextGame.move({ from: move.from, to: move.to, promotion: move.promotion || 'q' });
            const evaluation = this.minimax(nextGame, depth - 1, alpha, beta, true, maximizingColor);
            minEval = Math.min(minEval, evaluation);
            beta = Math.min(beta, evaluation);
            if (beta <= alpha) {
                break;
            }
        }
        return minEval;
    }

    evaluatePosition(game, maximizingColor) {
        if (game.in_checkmate()) {
            return game.turn() === maximizingColor ? -999999 : 999999;
        }

        if (game.in_draw() || game.in_stalemate() || game.in_threefold_repetition()) {
            return 0;
        }

        let score = 0;
        const board = game.board();

        for (let rank = 0; rank < board.length; rank++) {
            for (let file = 0; file < board[rank].length; file++) {
                const piece = board[rank][file];
                if (!piece) {
                    continue;
                }

                const material = this.pieceValues[piece.type] || 0;
                const centrality = (3.5 - Math.abs(3.5 - file)) + (3.5 - Math.abs(3.5 - rank));
                const positional = centrality * 8;
                const signedValue = material + positional;
                score += piece.color === maximizingColor ? signedValue : -signedValue;
            }
        }

        if (game.in_check()) {
            score += game.turn() === maximizingColor ? -40 : 40;
        }

        return score;
    }

    scoreMove(game, move) {
        let score = 0;

        if (move.captured) {
            score += (this.pieceValues[move.captured] || 0) - ((this.pieceValues[move.piece] || 0) / 10);
        }

        if (move.promotion) {
            score += this.pieceValues[move.promotion] || 800;
        }

        const file = move.to.charCodeAt(0) - 97;
        const rank = parseInt(move.to[1], 10) - 1;
        score += ((3.5 - Math.abs(3.5 - file)) + (3.5 - Math.abs(3.5 - rank))) * 6;

        const nextGame = new Chess(game.fen());
        nextGame.move({ from: move.from, to: move.to, promotion: move.promotion || 'q' });

        if (nextGame.in_check()) {
            score += 60;
        }

        return score;
    }

    getIsThinking() {
        return false;
    }

    getDifficultyDescription() {
        const descriptions = {
            'easy': 'Easy (Beginner)',
            'medium': 'Medium (Intermediate)',
            'hard': 'Hard (Advanced)',
            'insane': 'Insane (Master)'
        };
        return descriptions[this.difficulty] || 'Medium';
    }
}

// Fallback AI
const fallbackAI = new SimpleAI();
