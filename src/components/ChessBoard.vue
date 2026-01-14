<template>
  <div class="chess-app">
    <div class="header">
      <h1>Échiquier Interactif</h1>
      <p>Cliquez sur une pièce puis sur une case pour la déplacer librement</p>
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
                isSelected(rowIdx, colIdx) ? 'selected' : ''
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
      selected: null
    };
  },
  computed: {
    moveHistory() {
      return this.chessService.getMoveHistory();
    },
    piecePositions() {
      return this.chessService.getAllPiecePositions();
    }
  },
  created() {
    this.board = this.chessService.getBoard();
  },
  methods: {
    handleSquareClick(row, col) {
      if (this.selected) {
        // Déplacer la pièce
        this.chessService.movePiece(this.selected.row, this.selected.col, row, col);
        this.board = this.chessService.getBoard();
        this.selected = null;
      } else if (this.board[row][col]) {
        // Sélectionner une pièce
        this.selected = { row, col };
      }
    },
    
    isSelected(row, col) {
      return this.selected && this.selected.row === row && this.selected.col === col;
    },
    
    isLightSquare(row, col) {
      return (row + col) % 2 === 0;
    },
    
    resetBoard() {
      this.chessService.reset();
      this.board = this.chessService.getBoard();
      this.selected = null;
    },

    formatMove(move) {
      return `${move.piece} : ${move.from} → ${move.to}`;
    }
  }
};
</script>

<style src="../assets/styles/chessboard.css"></style>
