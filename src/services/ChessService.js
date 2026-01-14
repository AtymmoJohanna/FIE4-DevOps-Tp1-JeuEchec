/**
 * Service pour gérer l'état du jeu d'échecs
 * Gère le plateau, l'historique des mouvements et les positions des pièces
 */
class ChessService {
  constructor() {
    this.board = this.initializeBoard();
    this.moveHistory = [];
  }

  /**
   * Initialise le plateau d'échecs avec toutes les pièces
   * @returns {Array} Tableau 8x8 représentant le plateau
   */
  initializeBoard() {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Pièces noires (lignes 0 et 1)
    board[0] = ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'];
    board[1] = Array(8).fill('♟');
    
    // Pièces blanches (lignes 6 et 7)
    board[6] = Array(8).fill('♙');
    board[7] = ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'];
    
    return board;
  }

  /**
   * Obtient le plateau actuel
   * @returns {Array} Le plateau de jeu
   */
  getBoard() {
    return this.board;
  }

  /**
   * Déplace une pièce d'une position à une autre
   * @param {number} fromRow - Ligne de départ
   * @param {number} fromCol - Colonne de départ
   * @param {number} toRow - Ligne d'arrivée
   * @param {number} toCol - Colonne d'arrivée
   */
  movePiece(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol];
    const capturedPiece = this.board[toRow][toCol];

    // Enregistrer le mouvement dans l'historique
    this.moveHistory.push({
      piece: piece,
      from: this.positionToNotation(fromRow, fromCol),
      to: this.positionToNotation(toRow, toCol),
      captured: capturedPiece,
      timestamp: new Date()
    });

    // Effectuer le déplacement
    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;
  }

  /**
   * Convertit une position (row, col) en notation échecs (ex: e4)
   * @param {number} row - Ligne
   * @param {number} col - Colonne
   * @returns {string} Notation échecs
   */
  positionToNotation(row, col) {
    const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const rows = ['8', '7', '6', '5', '4', '3', '2', '1'];
    return columns[col] + rows[row];
  }

  /**
   * Obtient l'historique de tous les déplacements
   * @returns {Array} Tableau des mouvements effectués
   */
  getMoveHistory() {
    return this.moveHistory;
  }

  /**
   * Obtient la position d'une pièce spécifique
   * @param {number} row - Ligne
   * @param {number} col - Colonne
   * @returns {Object|null} Objet contenant la pièce et sa position
   */
  getPieceAt(row, col) {
    const piece = this.board[row][col];
    if (!piece) return null;

    return {
      piece: piece,
      position: this.positionToNotation(row, col),
      row: row,
      col: col
    };
  }

  /**
   * Obtient toutes les positions de toutes les pièces sur le plateau
   * @returns {Array} Tableau d'objets représentant chaque pièce et sa position
   */
  getAllPiecePositions() {
    const positions = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece) {
          positions.push({
            id: `${row}-${col}`,
            piece: piece,
            position: this.positionToNotation(row, col),
            row: row,
            col: col
          });
        }
      }
    }
    
    return positions;
  }

  /**
   * Trouve toutes les positions d'un type de pièce spécifique
   * @param {string} pieceSymbol - Symbole de la pièce (ex: '♔', '♟')
   * @returns {Array} Tableau des positions de cette pièce
   */
  findPiece(pieceSymbol) {
    const positions = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.board[row][col] === pieceSymbol) {
          positions.push({
            piece: pieceSymbol,
            position: this.positionToNotation(row, col),
            row: row,
            col: col
          });
        }
      }
    }
    
    return positions;
  }

  /**
   * Compte le nombre de pièces sur le plateau
   * @returns {Object} Objet avec le compte des pièces blanches et noires
   */
  countPieces() {
    let whitePieces = 0;
    let blackPieces = 0;
    
    const whitePieceSymbols = ['♔', '♕', '♖', '♗', '♘', '♙'];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece) {
          if (whitePieceSymbols.includes(piece)) {
            whitePieces++;
          } else {
            blackPieces++;
          }
        }
      }
    }
    
    return { white: whitePieces, black: blackPieces };
  }

  /**
   * Réinitialise le jeu
   */
  reset() {
    this.board = this.initializeBoard();
    this.moveHistory = [];
  }

  /**
   * Obtient le dernier mouvement effectué
   * @returns {Object|null} Le dernier mouvement ou null
   */
  getLastMove() {
    return this.moveHistory.length > 0 
      ? this.moveHistory[this.moveHistory.length - 1] 
      : null;
  }

  /**
   * Annule le dernier mouvement (undo)
   * Note: Nécessiterait de stocker l'état complet du plateau pour chaque mouvement
   * Cette version est simplifiée
   */
  undoLastMove() {
    if (this.moveHistory.length === 0) return false;
    
    // Pour une vraie implémentation, il faudrait stocker l'état du plateau
    // avant chaque mouvement
    console.warn('La fonction undo nécessite une implémentation complète avec sauvegarde des états');
    return false;
  }
}

export default ChessService;

