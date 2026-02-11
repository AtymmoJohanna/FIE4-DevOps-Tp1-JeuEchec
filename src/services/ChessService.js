import { Chess } from "chess.js";

class ChessService {
  constructor() {
    this.chess = new Chess();
    this.moveHistory = [];
  }

  getBoard() {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));

    const pieceMap = {
      p: "♙", r: "♖", n: "♘", b: "♗", q: "♕", k: "♔",
      P: "♟", R: "♜", N: "♞", B: "♝", Q: "♛", K: "♚"
    };

    const chessBoard = this.chess.board();

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = chessBoard[row][col];
        if (piece) {
          const key = piece.color === "w" ? piece.type : piece.type.toUpperCase();
          board[row][col] = pieceMap[key];
        }
      }
    }

    return board;
  }

  positionToNotation(row, col) {
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    return files[col] + (8 - row);
  }

  getLegalMoves(row, col) {
    const square = this.positionToNotation(row, col);
    const moves = this.chess.moves({ square, verbose: true });

    return moves.map(move => ({
      row: 8 - parseInt(move.to[1]),
      col: move.to.charCodeAt(0) - 97
    }));
  }

  movePiece(fromRow, fromCol, toRow, toCol) {
    try {
      const move = this.chess.move({
        from: this.positionToNotation(fromRow, fromCol),
        to: this.positionToNotation(toRow, toCol),
        promotion: "q"
      });

      if (move) {
        this.moveHistory.push(move);
        return true;
      }

      return false;

    } catch (error) {
      // Coup illégal → on ignore proprement
      return false;
    }
  }


  getMoveHistory() {
    return this.moveHistory;
  }

  getAllPiecePositions() {
    const positions = [];
    const board = this.getBoard();

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
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

  reset() {
    this.chess.reset();
    this.moveHistory = [];
  }

  isInCheck() {
    return this.chess.inCheck();
  }

  isCheckmate() {
    return this.chess.isCheckmate();
  }

  isStalemate() {
    return this.chess.isStalemate();
  }

  isDraw() {
    return this.chess.isDraw();
  }

  getTurn() {
    return this.chess.turn();
  }

  getGameStatus() {
    if (this.isCheckmate()) {
      const winner = this.getTurn() === "w" ? "Noirs" : "Blancs";
      return `Échec et mat ! ${winner} gagnent`;
    }

    if (this.isStalemate()) return "Pat !";
    if (this.isDraw()) return "Match nul";
    if (this.isInCheck()) return "Échec !";

    return `Au tour des ${this.getTurn() === "w" ? "Blancs" : "Noirs"}`;
  }
}

export default ChessService;