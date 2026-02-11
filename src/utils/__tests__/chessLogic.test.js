import { isValidPosition, getPieceColor, getPieceName } from '../chessLogic.js';

describe('chessLogic', () => {
  test('isValidPosition détecte correctement les positions valides', () => {
    expect(isValidPosition(0, 0)).toBe(true);
    expect(isValidPosition(7, 7)).toBe(true);
    expect(isValidPosition(-1, 0)).toBe(false);
    expect(isValidPosition(8, 4)).toBe(false);
  });

  test('getPieceColor renvoie la bonne couleur', () => {
    expect(getPieceColor('♔')).toBe('white');
    expect(getPieceColor('♟')).toBe('black');
    expect(getPieceColor(null)).toBe('empty');
  });

  test('getPieceName renvoie le bon nom', () => {
    expect(getPieceName('♔')).toBe('Roi Blanc');
    expect(getPieceName('♟')).toBe('Pion Noir');
    expect(getPieceName('X')).toBe('Pièce inconnue');
  });
});
