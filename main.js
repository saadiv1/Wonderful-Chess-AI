class ChessGame {
    constructor() {
        this.selectedSquare = null;
        this.highlightedSquares = [];
        this.isAIThinking = false;
        this.gameActive = true;
        this.useStockfish = true;
        this.difficulty = getConfig('difficulty.default', 'medium');
        this.playerColorChoice = getConfig('player.color', 'w');
        this.playerColor = 'w';
        this.aiColor = 'b';
        this.darkMode = !!getConfig('ui.darkMode', false);
        this.undoLimit = this.getUndoLimitForDifficulty(this.difficulty);
        this.undosUsed = 0;
        this.fileLabels = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        this.timeControl = 'none';
        this.timeLeft = { w: null, b: null };
        this.clockStarted = false;
        this.timerInterval = null;
        this.lastTickTime = null;
        this.previewMoveIndex = null;
        this.pendingPromotion = null;
        this.volume = Number(getConfig('ui.volume', 60)) / 100;
        this.audioContext = null;
        this.pieceUnicode = {
            wp: '\u2659',
            wn: '\u2658',
            wb: '\u2657',
            wr: '\u2656',
            wq: '\u2655',
            wk: '\u2654',
            bp: '\u265F',
            bn: '\u265E',
            bb: '\u265D',
            br: '\u265C',
            bq: '\u265B',
            bk: '\u265A'
        };
    }

    init() {
        this.applyTheme(this.darkMode);
        this.syncControls();
        this.resolvePlayerColors(this.playerColorChoice);
        this.applyTimeControl(this.timeControl, true);
        this.renderCoordinates();
        this.initializeBoard();
        this.attachEventListeners();
        this.setDifficulty(this.difficulty);
        this.updateUI();
        this.startTimerLoop();
        this.checkForAIMove();
    }

    syncControls() {
        this.updateOptionButtons('playerColor', this.playerColorChoice);
        this.updateOptionButtons('difficulty', this.difficulty);
        this.updateOptionButtons('timeControl', this.timeControl);
        this.updateVolumeUI();
        this.updateThemeToggleLabel();
    }

    updateOptionButtons(setting, value) {
        document.querySelectorAll(`[data-setting="${setting}"]`).forEach(button => {
            button.classList.toggle('is-active', button.dataset.value === value);
        });
    }

    updateVolumeUI() {
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeValue = document.getElementById('volumeValue');

        if (volumeSlider) {
            volumeSlider.value = String(Math.round(this.volume * 100));
        }

        if (volumeValue) {
            volumeValue.textContent = `${Math.round(this.volume * 100)}%`;
        }
    }

    initAudioContext() {
        if (this.audioContext) {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume().catch(() => {});
            }
            return;
        }

        const Context = window.AudioContext || window.webkitAudioContext;
        if (!Context) {
            return;
        }

        this.audioContext = new Context();
    }

    playMoveSound(move) {
        if (this.volume <= 0) {
            return;
        }

        this.initAudioContext();
        if (!this.audioContext) {
            return;
        }

        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const frequency = move && move.captured ? 520 : 420;

        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(frequency, now);
        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.exponentialRampToValueAtTime(Math.max(this.volume * 0.08, 0.001), now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator.start(now);
        oscillator.stop(now + 0.16);
    }

    getUndoLimitForDifficulty(level) {
        return getConfig(`difficulty.undoLimits.${level}`, 0);
    }

    isTerminalStatus(status) {
        return ['checkmate', 'stalemate', 'draw', 'insufficient_material', 'timeout'].includes(status);
    }

    resolvePlayerColors(choice) {
        const resolvedChoice = choice === 'random'
            ? (Math.random() < 0.5 ? 'w' : 'b')
            : choice;

        this.playerColorChoice = choice;
        this.playerColor = resolvedChoice;
        this.aiColor = resolvedChoice === 'w' ? 'b' : 'w';

        setConfig('player.color', choice);
        setConfig('ai.aiColor', this.aiColor);
    }

    getBoardOrientation() {
        if (this.playerColor === 'b') {
            return {
                rows: [7, 6, 5, 4, 3, 2, 1, 0],
                cols: [7, 6, 5, 4, 3, 2, 1, 0]
            };
        }

        return {
            rows: [0, 1, 2, 3, 4, 5, 6, 7],
            cols: [0, 1, 2, 3, 4, 5, 6, 7]
        };
    }

    getCurrentViewState() {
        if (this.previewMoveIndex !== null) {
            return engine.getPreviewState(this.previewMoveIndex);
        }

        return {
            board: engine.getBoard(),
            currentTurn: engine.getCurrentTurn(),
            capturedPieces: engine.getCapturedPieces(),
            status: engine.getGameStatus(),
            moveCount: engine.getMoveCount()
        };
    }

    renderCoordinates() {
        const { rows, cols } = this.getBoardOrientation();
        const top = document.getElementById('coordinatesTop');
        const bottom = document.getElementById('coordinatesBottom');
        const left = document.getElementById('coordinatesLeft');
        const right = document.getElementById('coordinatesRight');

        const files = cols.map(col => this.fileLabels[col]);
        const ranks = rows.map(row => String(8 - row));

        this.fillCoordinateStrip(top, files);
        this.fillCoordinateStrip(bottom, files);
        this.fillCoordinateStrip(left, ranks);
        this.fillCoordinateStrip(right, ranks);
    }

    fillCoordinateStrip(element, values) {
        if (!element) {
            return;
        }

        element.innerHTML = '';
        values.forEach(value => {
            const cell = document.createElement('span');
            cell.className = 'coordinate-cell';
            cell.textContent = value;
            element.appendChild(cell);
        });
    }

    initializeBoard() {
        const board = document.getElementById('chessBoard');
        board.innerHTML = '';

        const boardState = this.getCurrentViewState().board;
        const { rows, cols } = this.getBoardOrientation();

        for (let visualRow = 0; visualRow < 8; visualRow++) {
            for (let visualCol = 0; visualCol < 8; visualCol++) {
                const row = rows[visualRow];
                const col = cols[visualCol];
                const square = document.createElement('div');
                const isLight = (row + col) % 2 === 0;
                const squareName = String.fromCharCode(97 + col) + (8 - row);
                const piece = boardState[row][col];

                square.className = `square ${isLight ? 'light' : 'dark'}`;
                square.id = squareName;

                if (piece) {
                    square.appendChild(this.createPieceElement(piece));
                }

                square.addEventListener('pointerup', event => {
                    if (event.pointerType === 'mouse' && event.button !== 0) {
                        return;
                    }
                    this.handleSquareClick(squareName, engine.getPieceAt(squareName));
                });

                board.appendChild(square);
            }
        }

        board.classList.toggle('previewing', this.previewMoveIndex !== null);
    }

    createPieceElement(piece) {
        const pieceEl = document.createElement('div');
        pieceEl.className = `piece ${piece.color === 'w' ? 'white' : 'black'} piece-${piece.color} piece-${piece.type}`;
        pieceEl.textContent = this.pieceUnicode[`${piece.color}${piece.type}`] || '';
        return pieceEl;
    }

    isPromotionMove(from, to, piece) {
        if (!piece || piece.type !== 'p') {
            return false;
        }

        const targetRank = Number(to[1]);
        return (piece.color === 'w' && targetRank === 8) || (piece.color === 'b' && targetRank === 1);
    }

    showPromotionDialog(from, to, color) {
        const modal = document.getElementById('promotionModal');
        const options = document.getElementById('promotionOptions');
        const promotionPieces = ['q', 'r', 'b', 'n'];
        const labels = {
            q: 'Queen',
            r: 'Rook',
            b: 'Bishop',
            n: 'Knight'
        };

        this.pendingPromotion = { from, to, color };
        options.innerHTML = '';

        promotionPieces.forEach(type => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'promotion-btn';
            button.dataset.promotion = type;
            button.innerHTML = `<span class="piece ${color === 'w' ? 'white' : 'black'} piece-${color} piece-${type}">${this.pieceUnicode[`${color}${type}`]}</span><span>${labels[type]}</span>`;
            button.addEventListener('click', () => this.completePromotion(type));
            options.appendChild(button);
        });

        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
    }

    closePromotionDialog() {
        const modal = document.getElementById('promotionModal');
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        this.pendingPromotion = null;
    }

    completePromotion(promotion) {
        if (!this.pendingPromotion) {
            return;
        }

        const { from, to } = this.pendingPromotion;
        this.closePromotionDialog();
        this.commitPlayerMove(from, to, promotion);
    }

    commitPlayerMove(from, to, promotion = null) {
        const move = engine.makeMove(from, to, promotion);
        if (!move) {
            return;
        }

        this.initAudioContext();
        this.clearHighlights();
        this.selectedSquare = null;
        this.initializeBoard();

        const status = engine.getGameStatus();
        if (this.isTerminalStatus(status)) {
            this.playMoveSound(move);
            this.handleGameEnd(status);
            return;
        }

        this.playMoveSound(move);
        this.applyMoveClockEffects(move.color);
        this.updateUI();
        this.checkForAIMove();
    }

    handleSquareClick(squareName, piece) {
        if (this.previewMoveIndex !== null || this.pendingPromotion || !this.gameActive || engine.isGameOver() || this.isAIThinking) {
            return;
        }

        if (engine.getCurrentTurn() !== this.playerColor) {
            return;
        }

        if (this.selectedSquare === squareName) {
            this.clearHighlights();
            this.selectedSquare = null;
            return;
        }

        if (this.selectedSquare && piece && piece.color === this.playerColor) {
            this.clearHighlights();
            this.selectedSquare = squareName;
            this.highlightSquare(squareName, 'selected');
            this.showLegalMoves(squareName);
            return;
        }

        if (!this.selectedSquare) {
            if (piece && piece.color === this.playerColor) {
                this.selectedSquare = squareName;
                this.highlightSquare(squareName, 'selected');
                this.showLegalMoves(squareName);
            }
            return;
        }

        if (this.isPromotionMove(this.selectedSquare, squareName, engine.getPieceAt(this.selectedSquare))) {
            this.showPromotionDialog(this.selectedSquare, squareName, this.playerColor);
            return;
        }

        this.commitPlayerMove(this.selectedSquare, squareName);
    }

    showLegalMoves(squareName) {
        const moves = engine.getMoves(squareName);
        moves.forEach(move => {
            if (move.captured) {
                this.highlightSquare(move.to, 'capture-hint');
            } else {
                this.highlightSquare(move.to, 'move-hint');
            }
        });
    }

    highlightSquare(squareName, className) {
        const square = document.getElementById(squareName);
        if (!square) {
            return;
        }

        square.classList.add(className);
        this.highlightedSquares.push(squareName);
    }

    clearHighlights() {
        this.highlightedSquares.forEach(squareName => {
            const square = document.getElementById(squareName);
            if (square) {
                square.classList.remove('selected', 'move-hint', 'capture-hint');
            }
        });

        this.highlightedSquares = [];
    }

    async checkForAIMove() {
        if (!this.gameActive || engine.isGameOver() || this.previewMoveIndex !== null) {
            return;
        }

        if (engine.getCurrentTurn() !== this.aiColor) {
            return;
        }

        this.isAIThinking = true;
        this.updateUI();

        try {
            const timedDelay = this.getTimedAIMoveDelay();
            if (timedDelay > 0) {
                await this.delay(timedDelay);
            }

            if (!this.gameActive || engine.isGameOver() || this.previewMoveIndex !== null || engine.getCurrentTurn() !== this.aiColor) {
                this.isAIThinking = false;
                this.updateUI();
                return;
            }

            const preferredAI = this.useStockfish && typeof ai.canUseEngine === 'function' && ai.canUseEngine()
                ? ai
                : fallbackAI;
            let aiMove = await preferredAI.getBestMove(engine.getFEN());

            if (!aiMove && preferredAI !== fallbackAI) {
                aiMove = await fallbackAI.getBestMove(engine.getFEN());
            }

            if (aiMove && aiMove.length >= 4 && this.gameActive) {
                const from = aiMove.substring(0, 2);
                const to = aiMove.substring(2, 4);
                const promotion = aiMove.length > 4 ? aiMove[4] : null;
                const move = engine.makeMove(from, to, promotion);

                if (move) {
                    this.playMoveSound(move);
                    this.initializeBoard();
                    this.updateUI();

                    const status = engine.getGameStatus();
                    if (this.isTerminalStatus(status)) {
                        this.handleGameEnd(status);
                    } else {
                        this.applyMoveClockEffects(move.color);
                    }
                }
            }
        } catch (error) {
            console.error('AI move error:', error);
        }

        this.isAIThinking = false;
        this.updateUI();
    }

    updateUI() {
        this.updateMovesList();
        this.updateCapturedPieces();
        this.updateGameStatus();
        this.updateUndoButton();
        this.updateTimersUI();
        this.updatePreviewStatus();
    }

    updateMovesList() {
        const movesList = document.getElementById('movesList');
        const history = engine.getFormattedMoveHistory();

        if (history.length === 0) {
            movesList.innerHTML = '<p class="empty-message">No moves yet</p>';
            return;
        }

        let html = '';
        for (let i = 0; i < history.length; i += 2) {
            const moveNumber = (i / 2) + 1;
            const whiteMove = history[i] || '-';
            const blackMove = history[i + 1] || '-';
            const whitePly = i + 1;
            const blackPly = i + 2;

            html += `
                <div class="move-item-row">
                    <button class="move-item ${this.previewMoveIndex === whitePly ? 'preview-active' : ''}" data-ply="${whitePly}">
                        ${moveNumber}. ${whiteMove}
                    </button>
                    ${history[i + 1]
                        ? `<button class="move-item ${this.previewMoveIndex === blackPly ? 'preview-active' : ''}" data-ply="${blackPly}">${blackMove}</button>`
                        : '<span class="move-item move-item-placeholder">-</span>'}
                </div>`;
        }

        movesList.innerHTML = html;
        movesList.querySelectorAll('[data-ply]').forEach(button => {
            button.addEventListener('click', event => {
                const ply = Number(event.currentTarget.dataset.ply);
                this.toggleHistoryPreview(ply);
            });
        });
        movesList.parentElement.scrollTop = movesList.parentElement.scrollHeight;
    }

    toggleHistoryPreview(ply) {
        this.clearHighlights();
        this.selectedSquare = null;
        this.previewMoveIndex = this.previewMoveIndex === ply ? null : ply;
        this.initializeBoard();
        this.updateUI();
    }

    exitPreviewMode() {
        if (this.previewMoveIndex === null) {
            return;
        }

        this.previewMoveIndex = null;
        this.initializeBoard();
        this.updateUI();
    }

    updateCapturedPieces() {
        const captured = this.getCurrentViewState().capturedPieces;

        document.getElementById('whiteCaptured').innerHTML = this.formatCapturedPieces(captured.black, 'w');
        document.getElementById('blackCaptured').innerHTML = this.formatCapturedPieces(captured.white, 'b');
    }

    formatCapturedPieces(pieces, color) {
        if (pieces.length === 0) {
            return '<span style="color: #9aa1ab;">None</span>';
        }

        return pieces
            .map(piece => `<span class="piece ${color === 'w' ? 'white' : 'black'} piece-${color} piece-${piece}">${this.pieceUnicode[`${color}${piece}`] || ''}</span>`)
            .join(' ');
    }

    updateGameStatus() {
        const currentTurnEl = document.getElementById('currentTurn');
        const turnIndicatorEl = document.getElementById('turnIndicator');
        const aiThinkingEl = document.getElementById('aiThinking');
        const status = this.timeoutLoser
            ? 'timeout'
            : (this.previewMoveIndex !== null ? this.getCurrentViewState().status : engine.getGameStatus());
        const currentTurn = this.getCurrentViewState().currentTurn === 'w' ? 'White' : 'Black';

        aiThinkingEl.style.display = this.isAIThinking && this.previewMoveIndex === null ? 'block' : 'none';

        if (status === 'timeout') {
            const winner = this.timeoutLoser === 'w' ? 'Black' : 'White';
            currentTurnEl.textContent = `Time! ${winner} wins!`;
            this.gameActive = false;
        } else if (status === 'checkmate') {
            currentTurnEl.textContent = `Checkmate! ${currentTurn === 'White' ? 'Black' : 'White'} wins!`;
            this.gameActive = false;
        } else if (status === 'stalemate') {
            currentTurnEl.textContent = 'Stalemate - Draw!';
            this.gameActive = false;
        } else if (status === 'draw') {
            currentTurnEl.textContent = 'Draw!';
            this.gameActive = false;
        } else if (status === 'insufficient_material') {
            currentTurnEl.textContent = 'Draw - Insufficient material';
            this.gameActive = false;
        } else if (status === 'check') {
            currentTurnEl.textContent = `${currentTurn} is in check`;
            turnIndicatorEl.textContent = currentTurn === 'White' ? '\u26AA' : '\u26AB';
        } else {
            currentTurnEl.textContent = this.previewMoveIndex !== null ? 'Preview Mode' : `${currentTurn} to move`;
            turnIndicatorEl.textContent = currentTurn === 'White' ? '\u26AA' : '\u26AB';
        }

        document.getElementById('difficulty').textContent = this.getDifficultyLabel();
        document.getElementById('playerColor').textContent = this.playerColor === 'w' ? 'White' : 'Black';
        document.getElementById('undoCount').textContent = this.getUndoStatusLabel();
        document.getElementById('timeControlLabel').textContent = this.getTimeControlLabel();
    }

    updateUndoButton() {
        const undoBtn = document.getElementById('undoBtn');
        undoBtn.disabled = this.previewMoveIndex !== null
            || !this.gameActive
            || engine.getMoveCount() === 0
            || this.isAIThinking
            || this.getUndosRemaining() <= 0;
    }

    getDifficultyLabel() {
        const labels = {
            easy: 'Easy',
            medium: 'Medium',
            hard: 'Hard',
            insane: 'Insane'
        };

        return labels[this.difficulty] || 'Medium';
    }

    getTimedAIMoveDelay() {
        if (this.timeControl === 'none') {
            return 0;
        }

        return getConfig(`difficulty.timedMoveDelayMs.${this.difficulty}`, 0);
    }

    delay(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    getTimeControlLabel() {
        const labels = {
            none: 'No Timer',
            '1|0': '1 min',
            '1|1': '1|1',
            '2|1': '2|1',
            '3|2': '3|2',
            '5|0': '5 min',
            '5|5': '5|5',
            '10|0': '10 min',
            '10|5': '10|5',
            '15|10': '15|10',
            '20|0': '20 min',
            '30|0': '30 min',
            '60|0': '60 min'
        };

        return labels[this.timeControl] || 'No Timer';
    }

    getUndosRemaining() {
        return Math.max(this.undoLimit - this.undosUsed, 0);
    }

    getUndoStatusLabel() {
        const remaining = this.getUndosRemaining();
        if (this.undoLimit === 0) {
            return 'None';
        }

        return `${remaining} remaining`;
    }

    getBaseSecondsForTimeControl(control) {
        if (control === 'none') {
            return null;
        }

        const parts = control.split('|');
        if (parts.length !== 2) {
            return null;
        }

        const minutes = Number(parts[0]);
        return Number.isFinite(minutes) ? minutes * 60 : null;
    }

    getIncrementSecondsForTimeControl(control) {
        if (control === 'none') {
            return 0;
        }

        const parts = control.split('|');
        if (parts.length !== 2) {
            return 0;
        }

        const increment = Number(parts[1]);
        return Number.isFinite(increment) ? increment : 0;
    }

    applyMoveClockEffects(movedColor) {
        if (this.timeControl === 'none') {
            return;
        }

        if (!this.clockStarted) {
            this.clockStarted = true;
        }

        this.timeLeft[movedColor] += this.getIncrementSecondsForTimeControl(this.timeControl);
        this.lastTickTime = Date.now();
    }

    applyTimeControl(control, preserveTimes = false) {
        this.timeControl = control;
        const baseSeconds = this.getBaseSecondsForTimeControl(control);

        if (baseSeconds === null) {
            this.timeLeft = { w: null, b: null };
        } else if (!preserveTimes) {
            this.timeLeft = { w: baseSeconds, b: baseSeconds };
        }

        if (!preserveTimes) {
            this.clockStarted = false;
        }

        this.updateOptionButtons('timeControl', control);
        this.lastTickTime = Date.now();
        this.updateTimersUI();
    }

    startTimerLoop() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.lastTickTime = Date.now();
        this.timerInterval = setInterval(() => this.tickClock(), 250);
    }

    tickClock() {
        if (this.timeControl === 'none' || !this.clockStarted || this.previewMoveIndex !== null || !this.gameActive) {
            this.lastTickTime = Date.now();
            return;
        }

        const currentTurn = engine.getCurrentTurn();
        if (!this.timeLeft[currentTurn] && this.timeLeft[currentTurn] !== 0) {
            this.lastTickTime = Date.now();
            return;
        }

        const now = Date.now();
        const elapsed = (now - this.lastTickTime) / 1000;
        this.lastTickTime = now;
        this.timeLeft[currentTurn] = Math.max(0, this.timeLeft[currentTurn] - elapsed);

        if (this.timeLeft[currentTurn] <= 0) {
            this.timeLeft[currentTurn] = 0;
            this.handleTimeout(currentTurn);
        }

        this.updateTimersUI();
    }

    handleTimeout(flaggedColor) {
        this.gameActive = false;
        this.isAIThinking = false;
        this.timeoutLoser = flaggedColor;
        this.updateUI();
    }

    formatClock(seconds) {
        if (seconds === null || seconds === undefined) {
            return '--:--';
        }

        const wholeSeconds = Math.max(0, Math.ceil(seconds));
        const minutes = Math.floor(wholeSeconds / 60);
        const remainder = wholeSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
    }

    updateTimersUI() {
        const whiteTimer = document.getElementById('whiteTimer');
        const blackTimer = document.getElementById('blackTimer');
        const whiteClockCard = document.getElementById('whiteClockCard');
        const blackClockCard = document.getElementById('blackClockCard');
        const topClockLabel = document.getElementById('topClockLabel');
        const bottomClockLabel = document.getElementById('bottomClockLabel');
        const topColor = this.playerColor === 'b' ? 'White' : 'Black';
        const bottomColor = this.playerColor === 'b' ? 'Black' : 'White';

        whiteTimer.textContent = this.formatClock(this.timeLeft.w);
        blackTimer.textContent = this.formatClock(this.timeLeft.b);
        topClockLabel.textContent = topColor;
        bottomClockLabel.textContent = bottomColor;

        whiteTimer.classList.toggle('active-timer', this.previewMoveIndex === null && this.gameActive && this.clockStarted && engine.getCurrentTurn() === 'w' && this.timeControl !== 'none');
        blackTimer.classList.toggle('active-timer', this.previewMoveIndex === null && this.gameActive && this.clockStarted && engine.getCurrentTurn() === 'b' && this.timeControl !== 'none');
        whiteTimer.classList.toggle('low-time', this.timeLeft.w !== null && this.timeLeft.w <= 10);
        blackTimer.classList.toggle('low-time', this.timeLeft.b !== null && this.timeLeft.b <= 10);
        whiteClockCard.classList.toggle('clock-card-active', this.previewMoveIndex === null && this.gameActive && this.clockStarted && engine.getCurrentTurn() === 'w' && this.timeControl !== 'none');
        blackClockCard.classList.toggle('clock-card-active', this.previewMoveIndex === null && this.gameActive && this.clockStarted && engine.getCurrentTurn() === 'b' && this.timeControl !== 'none');
    }

    updatePreviewStatus() {
        const previewStatus = document.getElementById('previewStatus');
        if (!previewStatus) {
            return;
        }

        if (this.previewMoveIndex === null) {
            previewStatus.style.display = 'none';
            return;
        }

        previewStatus.style.display = 'block';
        previewStatus.textContent = `Previewing move ${this.previewMoveIndex}. Tap it again to return live.`;
    }

    handleGameEnd(status) {
        this.gameActive = false;
        if (status === 'timeout') {
            this.timeoutLoser = engine.getCurrentTurn();
        }
        this.updateUI();
    }

    attachEventListeners() {
        document.getElementById('newGameBtn').addEventListener('click', () => this.newGame());
        document.getElementById('resetBtn').addEventListener('click', () => this.newGame());
        document.getElementById('undoBtn').addEventListener('click', () => this.undoMove());

        document.querySelectorAll('.option-btn').forEach(button => {
            button.addEventListener('click', () => {
                const { setting, value } = button.dataset;

                if (setting === 'playerColor') {
                    this.playerColorChoice = value;
                    this.updateOptionButtons(setting, value);
                    this.newGame(false);
                } else if (setting === 'difficulty') {
                    this.setDifficulty(value);
                    this.updateOptionButtons(setting, value);
                    this.newGame(false);
                } else if (setting === 'timeControl') {
                    this.applyTimeControl(value);
                    this.updateOptionButtons(setting, value);
                    this.newGame(false);
                }
            });
        });

        document.getElementById('volumeSlider').addEventListener('input', event => {
            this.volume = Number(event.target.value) / 100;
            setConfig('ui.volume', Number(event.target.value));
            this.updateVolumeUI();
        });

        document.getElementById('themeToggleBtn').addEventListener('click', () => {
            this.applyTheme(!this.darkMode);
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                this.clearHighlights();
                this.selectedSquare = null;
                this.exitPreviewMode();
            }
        });
    }

    newGame(forceWhite = false) {
        engine.reset();
        this.selectedSquare = null;
        this.highlightedSquares = [];
        this.gameActive = true;
        this.isAIThinking = false;
        this.previewMoveIndex = null;
        this.timeoutLoser = null;
        this.undoLimit = this.getUndoLimitForDifficulty(this.difficulty);
        this.undosUsed = 0;
        this.clockStarted = false;
        this.closePromotionDialog();

        const selectedChoice = forceWhite ? 'w' : this.playerColorChoice;
        this.resolvePlayerColors(selectedChoice);
        this.applyTimeControl(this.timeControl);
        this.renderCoordinates();
        this.initializeBoard();
        this.updateUI();
        this.lastTickTime = Date.now();
        this.checkForAIMove();
    }

    undoMove() {
        if (!this.gameActive || engine.getMoveCount() === 0 || this.isAIThinking || this.getUndosRemaining() <= 0 || this.previewMoveIndex !== null) {
            return;
        }

        engine.undoMove();
        if (engine.getMoveCount() > 0 && engine.getCurrentTurn() !== this.playerColor) {
            engine.undoMove();
        }
        this.undosUsed += 1;

        this.clearHighlights();
        this.selectedSquare = null;
        this.gameActive = true;
        this.timeoutLoser = null;
        this.clockStarted = engine.getMoveCount() > 0 && this.timeControl !== 'none';
        this.closePromotionDialog();
        this.initializeBoard();
        this.updateUI();
        this.lastTickTime = Date.now();
    }

    setDifficulty(level) {
        this.difficulty = level;
        ai.setDifficulty(level);
        fallbackAI.setDifficulty(level);
        setConfig('difficulty.default', level);
        this.undoLimit = this.getUndoLimitForDifficulty(level);
        this.undosUsed = 0;
        this.updateOptionButtons('difficulty', level);
        this.updateUI();
    }

    applyTheme(isDarkMode) {
        this.darkMode = isDarkMode;
        document.body.classList.toggle('dark-mode', isDarkMode);
        setConfig('ui.darkMode', isDarkMode);
        this.updateThemeToggleLabel();
    }

    updateThemeToggleLabel() {
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        if (themeToggleBtn) {
            themeToggleBtn.textContent = `Dark Mode: ${this.darkMode ? 'On' : 'Off'}`;
        }
    }
}

let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new ChessGame();
    game.init();

    window.setDifficulty = level => {
        if (game) {
            game.setDifficulty(level);
        }
    };
});

document.addEventListener('wheel', event => {
    if (event.ctrlKey) {
        event.preventDefault();
    }
}, { passive: false });
