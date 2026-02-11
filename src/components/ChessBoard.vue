<template>
  <div class="chess-app">
    <div class="header">
      <h1>Échiquier Interactif</h1>
      <p>Jeu d'échecs avec règles officielles</p>
    </div>
    
    <!-- Indicateur de statut du jeu -->
    <div class="game-status-banner">
      <p class="status-text">{{ gameStatus }}</p>
      <p class="turn-text">Au tour des : <strong>{{ currentTurn }}</strong></p>
    </div>
    
    <div class="main-content">
      <div class="board-container">
        <div class="chess-board">
          <div
            v-for="(row, rowIdx) in board"
            :key="rowIdx"
            class="board-row"
          >
            <div
              v-for="(piece, colIdx) in row"
              :key="colIdx"
              @click="handleSquareClick(rowIdx, colIdx)"
              :class="[
                'square',
                isLightSquare(rowIdx, colIdx) ? 'light' : 'dark',
                isSelected(rowIdx, colIdx) ? 'selected' : '',
                isLegalMove(rowIdx, colIdx) ? 'legal-move' : ''
              ]"
            >
              {{ piece }}
            </div>
          </div>
        </div>
      </div>

      <div class="sidebar">
        <div class="info-panel">
          <h3>État du jeu</h3>
          <p class="status">
            {{ selected ? '✓ Pièce sélectionnée' : 'Sélectionnez une pièce' }}
          </p>
          <p class="move-count">Coups joués: {{ moveHistory.length }}</p>
          <p v-if="isInCheck" class="check-warning">⚠️ ÉCHEC !</p>
        </div>

        <div class="history-panel">
          <h3>Historique des déplacements</h3>
          <div class="history-list">
            <div 
              v-for="(move, index) in moveHistory" 
              :key="index"
              class="history-item"
            >
              <span class="move-number">{{ index + 1 }}.</span>
              <span class="move-detail">{{ formatMove(move) }}</span>
            </div>
            <p v-if="moveHistory.length === 0" class="empty-history">
              Aucun déplacement effectué
            </p>
          </div>
        </div>

        <div class="pieces-panel">
          <h3>Position des pièces</h3>
          <div class="pieces-list">
            <div v-for="piece in piecePositions" :key="piece.id" class="piece-item">
              <span class="piece-icon">{{ piece.piece }}</span>
              <span class="piece-position">{{ piece.position }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <button @click="resetBoard" class="reset-button">
      Réinitialiser
    </button>
  </div>
</template>

<script>
import ChessService from '../services/ChessService.js';

export default {
  name: 'ChessBoard',
  data() {
    return {
      chessService: new ChessService(),
    board: [],
    selected: null,
    legalMoves: [],
    moveHistory: [],
    gameStatus: '',
    currentTurn: '',
    isInCheck: false
    };
  },
  
  created() {
    this.updateGameState();
  },
  methods: {
    updateGameState() {
      this.board = this.chessService.getBoard();
      this.moveHistory = [...this.chessService.getMoveHistory()];
      this.gameStatus = this.chessService.getGameStatus();
      this.currentTurn =
        this.chessService.getTurn() === "w" ? "Blancs" : "Noirs";
      this.isInCheck = this.chessService.isInCheck();
    },
    handleSquareClick(row, col) {
      const piece = this.board[row][col];

      if (this.selected) {
        // Tenter de déplacer la pièce
        const success = this.chessService.movePiece(
          this.selected.row,
          this.selected.col,
          row,
          col
        );

        if (success) {
          // Mouvement réussi
          this.selected = null;
  this.legalMoves = [];
  this.updateGameState();
        } else {
          // Mouvement illégal - sélectionner autre pièce du joueur courant
          if (piece && this.isCurrentPlayerPiece(piece)) {
            this.selected = { row, col };
            this.legalMoves = this.chessService.getLegalMoves(row, col);
          } else {
            this.selected = null;
            this.legalMoves = [];
          }
        }
      } else {
        // Sélectionner une pièce du joueur courant
        if (piece && this.isCurrentPlayerPiece(piece)) {
          this.selected = { row, col };
          this.legalMoves = this.chessService.getLegalMoves(row, col);
        }
      }
    },

    isCurrentPlayerPiece(piece) {
      const whitePieces = ['♔', '♕', '♖', '♗', '♘', '♙'];
      const isWhite = whitePieces.includes(piece);
      return (isWhite && this.chessService.getTurn() === 'w') ||
             (!isWhite && this.chessService.getTurn() === 'b');
    },

    isSelected(row, col) {
      return this.selected &&
             this.selected.row === row &&
             this.selected.col === col;
    },

    isLegalMove(row, col) {
      return this.legalMoves.some(
        move => move.row === row && move.col === col
      );
    },

    isLightSquare(row, col) {
      return (row + col) % 2 === 0;
    },

    resetBoard() {
      this.chessService.reset();
  this.selected = null;
  this.legalMoves = [];
  this.updateGameState();
    },

    formatMove(move) {
      return move.san || `${move.from} → ${move.to}`;
    }
  }
};
</script>

<style src="../assets/styles/chessboard.css"></style>