import ChessService from '../ChessService.js';

describe('ChessService', () => {
  let chessService;

  beforeEach(() => {
    chessService = new ChessService();
  });

  describe('Initialisation du plateau', () => {
    it('devrait créer un plateau 8x8', () => {
      const board = chessService.getBoard();
      expect(board).toHaveLength(8);
      expect(board[0]).toHaveLength(8);
    });

    it('devrait placer les pièces noires correctement', () => {
      const board = chessService.getBoard();
      expect(board[0]).toEqual(['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜']);
      expect(board[1]).toEqual(['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟']);
    });

    it('devrait placer les pièces blanches correctement', () => {
      const board = chessService.getBoard();
      expect(board[6]).toEqual(['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙']);
      expect(board[7]).toEqual(['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']);
    });

    it('devrait avoir des cases vides au centre du plateau', () => {
      const board = chessService.getBoard();
      for (let row = 2; row <= 5; row++) {
        for (let col = 0; col < 8; col++) {
          expect(board[row][col]).toBeNull();
        }
      }
    });

    it('devrait avoir 32 pièces au total au départ', () => {
      const positions = chessService.getAllPiecePositions();
      expect(positions).toHaveLength(32);
    });
  });

  describe('Conversion de position en notation', () => {
    it('devrait convertir (0,0) en a8', () => {
      expect(chessService.positionToNotation(0, 0)).toBe('a8');
    });

    it('devrait convertir (7,7) en h1', () => {
      expect(chessService.positionToNotation(7, 7)).toBe('h1');
    });

    it('devrait convertir (0,4) en e8', () => {
      expect(chessService.positionToNotation(0, 4)).toBe('e8');
    });

    it('devrait convertir (7,4) en e1', () => {
      expect(chessService.positionToNotation(7, 4)).toBe('e1');
    });
  });

  describe('Déplacement de pièces', () => {
    it('devrait déplacer une pièce correctement', () => {
      chessService.movePiece(6, 4, 4, 4);
      const board = chessService.getBoard();
      expect(board[4][4]).toBe('♙');
      expect(board[6][4]).toBeNull();
    });

    it('devrait enregistrer le mouvement dans l\'historique', () => {
      chessService.movePiece(6, 4, 4, 4);
      const history = chessService.getMoveHistory();
      expect(history).toHaveLength(1);
      expect(history[0].piece).toBe('♙');
      expect(history[0].from).toBe('e2');
      expect(history[0].to).toBe('e4');
    });

    it('devrait capturer une pièce adverse', () => {
      chessService.movePiece(6, 4, 1, 4);
      const board = chessService.getBoard();
      expect(board[1][4]).toBe('♙');
      expect(board[6][4]).toBeNull();
    });

    it('devrait enregistrer la pièce capturée dans l\'historique', () => {
      chessService.movePiece(6, 4, 1, 4);
      const history = chessService.getMoveHistory();
      expect(history[0].captured).toBe('♟');
    });

    it('devrait enregistrer un timestamp pour chaque mouvement', () => {
      const beforeMove = new Date();
      chessService.movePiece(6, 4, 4, 4);
      const afterMove = new Date();
      
      const history = chessService.getMoveHistory();
      const moveTime = history[0].timestamp;
      
      expect(moveTime).toBeInstanceOf(Date);
      expect(moveTime.getTime()).toBeGreaterThanOrEqual(beforeMove.getTime());
      expect(moveTime.getTime()).toBeLessThanOrEqual(afterMove.getTime());
    });
  });

  describe('Obtenir une pièce à une position', () => {
    it('devrait retourner la pièce à une position valide', () => {
      const piece = chessService.getPieceAt(0, 0);
      expect(piece).toBeDefined();
      expect(piece.piece).toBe('♜');
      expect(piece.position).toBe('a8');
      expect(piece.row).toBe(0);
      expect(piece.col).toBe(0);
    });

    it('devrait retourner null pour une case vide', () => {
      const piece = chessService.getPieceAt(3, 3);
      expect(piece).toBeNull();
    });
  });

  describe('Obtenir toutes les positions des pièces', () => {
    it('devrait retourner 32 pièces au départ', () => {
      const positions = chessService.getAllPiecePositions();
      expect(positions).toHaveLength(32);
    });

    it('devrait avoir 16 pièces après avoir capturé', () => {
      for (let col = 0; col < 8; col++) {
        chessService.movePiece(6, col, 1, col);
        chessService.movePiece(7, col, 0, col);
      }
      const positions = chessService.getAllPiecePositions();
      expect(positions).toHaveLength(16);
    });

    it('chaque position devrait avoir un id unique', () => {
      const positions = chessService.getAllPiecePositions();
      const ids = positions.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(positions.length);
    });
  });

  describe('Historique des mouvements', () => {
    it('devrait avoir un historique vide au départ', () => {
      expect(chessService.getMoveHistory()).toHaveLength(0);
    });

    it('devrait retourner le dernier mouvement', () => {
      chessService.movePiece(6, 4, 4, 4);
      chessService.movePiece(1, 4, 3, 4);
      
      const lastMove = chessService.getLastMove();
      expect(lastMove.from).toBe('e7');
      expect(lastMove.to).toBe('e5');
    });
  });

  describe('Réinitialisation', () => {
    it('devrait réinitialiser le plateau', () => {
      chessService.movePiece(6, 4, 4, 4);
      chessService.reset();
      
      const board = chessService.getBoard();
      expect(board[4][4]).toBeNull();
      expect(board[6][4]).toBe('♙');
    });

    it('devrait réinitialiser l\'historique', () => {
      chessService.movePiece(6, 4, 4, 4);
      chessService.reset();
      
      expect(chessService.getMoveHistory()).toHaveLength(0);
    });
  });
});