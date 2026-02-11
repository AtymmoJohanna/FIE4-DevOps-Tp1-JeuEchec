import ChessService from '../ChessService.js';

describe('ChessService', () => {
  let chessService;

  beforeEach(() => {
    chessService = new ChessService();
  });

  test('Initialise correctement le plateau', () => {
    const board = chessService.getBoard();
    expect(board.length).toBe(8);
    expect(board[0].length).toBe(8);
    // Vérifie la présence d’une tour blanche
    expect(board[7][0]).toBe('♖');
    // Vérifie la présence d’un pion noir
    expect(board[1][0]).toBe('♟');
  });

  test('Déplace une pièce légale', () => {
    // Déplace le pion e2 → e4
    const success = chessService.movePiece(6, 4, 4, 4);
    expect(success).toBe(true);
    const board = chessService.getBoard();
    expect(board[4][4]).toBe('♙'); // Pion blanc en e4
    expect(chessService.getMoveHistory().length).toBe(1);
  });

  test('Refuse un déplacement illégal', () => {
    // Essaye de déplacer un pion de e2 → e5 (illégal)
    const success = chessService.movePiece(6, 4, 3, 4);
    expect(success).toBe(false);
    expect(chessService.getMoveHistory().length).toBe(0);
  });

  test('Reset remet le plateau à zéro', () => {
    chessService.movePiece(6, 4, 4, 4);
    chessService.reset();
    const board = chessService.getBoard();
    expect(board[6][4]).toBe('♙'); // pion redevenu à e2
    expect(chessService.getMoveHistory().length).toBe(0);
  });

  test('getLegalMoves retourne les coups possibles', () => {
    const moves = chessService.getLegalMoves(6, 4); // e2
    expect(moves.length).toBeGreaterThan(0);
    expect(moves.some(m => m.row === 5 && m.col === 4)).toBe(true); // e3
  });
});
