// AI Engine - Uses Stockfish for chess AI
class ChessAI {
    constructor() {
        this.difficulty = 'medium'; // easy, medium, hard, insane
        this.stockfish = null;
        this.isReady = false;
        this.isThinking = false;
        this.bestMove = null;
    }

    // Initialize Stockfish
    async init() {
        return new Promise((resolve) => {
            this.stockfish = new Worker('https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js');

            this.stockfish.addEventListener('message', (e) => {
                this.onMessage(e.data);
            });

            this.stockfish.postMessage('uci');
            this.isReady = true;
            resolve();
        });
    }

    // Handle messages from Stockfish
    onMessage(message) {
        if (message && typeof message === 'string') {
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
            if (typeof getConfig === 'function') {
                searchDepth = getConfig(`difficulty.levels.${this.difficulty}`, depth);
            } else if (this.difficulty === 'easy') {
                searchDepth = 6;
            } else if (this.difficulty === 'medium') {
                searchDepth = 16;
            } else if (this.difficulty === 'hard') {
                searchDepth = 30;
            } else if (this.difficulty === 'insane') {
                searchDepth = 36;
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
            this.stockfish.postMessage(`go depth ${searchDepth}`);
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
    }

    setDifficulty(level) {
        this.difficulty = level;
    }

    getBestMove(fen) {
        const game = new Chess(fen);
        const moves = game.moves({ verbose: true });
        const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

        if (moves.length === 0) {
            return null;
        }

        if (this.difficulty === 'easy') {
            // Random move
            const randomMove = moves[Math.floor(Math.random() * moves.length)];
            return randomMove.from + randomMove.to;
        }

        if (this.difficulty === 'medium') {
            // More selective than easy: prefers higher-value captures and forcing moves.
            const scoredMoves = moves.map(m => {
                let score = Math.random() * 0.75;

                if (m.captured) {
                    score += (pieceValues[m.captured] || 0) * 2.4;
                }

                const testGame = new Chess(fen);
                testGame.move(`${m.from}${m.to}`, { sloppy: true });

                if (testGame.in_check()) {
                    score += 3.5;
                }

                return { move: m, score };
            });

            scoredMoves.sort((a, b) => b.score - a.score);
            const move = scoredMoves[0].move;
            return move.from + move.to;
        }

        if (this.difficulty === 'hard') {
            // Stronger fallback: heavily values material gain and forcing moves.
            const scoredMoves = moves.map(m => {
                let score = Math.random() * 0.35;

                if (m.captured) {
                    score += (pieceValues[m.captured] || 0) * 4;
                }

                const testGame = new Chess(fen);
                testGame.move(`${m.from}${m.to}`, { sloppy: true });
                
                if (testGame.in_check()) {
                    score += 6;
                }

                if (m.piece) {
                    score += pieceValues[m.piece] * 0.15;
                }

                return { move: m, score };
            });

            scoredMoves.sort((a, b) => b.score - a.score);
            const bestMove = scoredMoves[0].move;
            return bestMove.from + bestMove.to;
        }

        if (this.difficulty === 'insane') {
            const evaluateMaterial = chessGame => {
                let score = 0;
                const board = chessGame.board();

                for (const row of board) {
                    for (const piece of row) {
                        if (!piece) {
                            continue;
                        }
                        const value = pieceValues[piece.type] || 0;
                        score += piece.color === game.turn() ? value : -value;
                    }
                }

                return score;
            };

            const scoredMoves = moves.map(m => {
                const nextGame = new Chess(fen);
                nextGame.move({ from: m.from, to: m.to, promotion: m.promotion || 'q' });

                let score = evaluateMaterial(nextGame);

                if (m.captured) {
                    score += (pieceValues[m.captured] || 0) * 5;
                }

                if (nextGame.in_check()) {
                    score += 7;
                }

                const opponentReplies = nextGame.moves({ verbose: true });
                if (opponentReplies.length > 0) {
                    const replyPenalty = opponentReplies.reduce((worst, reply) => {
                        let penalty = 0;
                        if (reply.captured) {
                            penalty += (pieceValues[reply.captured] || 0) * 3;
                        }

                        const replyGame = new Chess(nextGame.fen());
                        replyGame.move({ from: reply.from, to: reply.to, promotion: reply.promotion || 'q' });
                        if (replyGame.in_check()) {
                            penalty += 4;
                        }

                        return Math.max(worst, penalty);
                    }, 0);

                    score -= replyPenalty;
                }

                return { move: m, score };
            });

            scoredMoves.sort((a, b) => b.score - a.score);
            const bestMove = scoredMoves[0].move;
            return bestMove.from + bestMove.to;
        }

        return null;
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
