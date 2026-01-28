import { isValidPosition, getPieceColor, getPieceName } from '../chessLogic.js';

describe('chessLogic utils', () => {
  describe('isValidPosition', () => {
    it('devrait retourner true pour des positions valides', () => {
      expect(isValidPosition(0, 0)).toBe(true);
      expect(isValidPosition(7, 7)).toBe(true);
      expect(isValidPosition(3, 4)).toBe(true);
    });

    it('devrait retourner false pour des positions invalides', () => {
      expect(isValidPosition(-1, 0)).toBe(false);
      expect(isValidPosition(8, 0)).toBe(false);
    });
  });

  describe('getPieceColor', () => {
    it('devrait identifier les pièces blanches', () => {
      expect(getPieceColor('♔')).toBe('white');
      expect(getPieceColor('♙')).toBe('white');
    });

    it('devrait identifier les pièces noires', () => {
      expect(getPieceColor('♚')).toBe('black');
      expect(getPieceColor('♟')).toBe('black');
    });

    it('devrait retourner empty pour une case vide', () => {
      expect(getPieceColor(null)).toBe('empty');
    });
  });

  describe('getPieceName', () => {
    it('devrait retourner les noms corrects', () => {
      expect(getPieceName('♔')).toBe('Roi Blanc');
      expect(getPieceName('♚')).toBe('Roi Noir');
    });
  });
});