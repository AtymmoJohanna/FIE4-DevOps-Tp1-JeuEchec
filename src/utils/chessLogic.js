/**
 * Fonctions utilitaires pour la logique du jeu d'échecs
 */

/**
 * Vérifie si une position est valide sur le plateau
 * @param {number} row - Ligne
 * @param {number} col - Colonne
 * @returns {boolean} True si la position est valide
 */
export function isValidPosition(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

/**
 * Détermine la couleur d'une pièce
 * @param {string} piece - Symbole de la pièce
 * @returns {string} 'white', 'black' ou 'empty'
 */
export function getPieceColor(piece) {
  if (!piece) return 'empty';
  const whitePieces = ['♔', '♕', '♖', '♗', '♘', '♙'];
  return whitePieces.includes(piece) ? 'white' : 'black';
}

/**
 * Obtient le nom de la pièce en français
 * @param {string} piece - Symbole de la pièce
 * @returns {string} Nom de la pièce
 */
export function getPieceName(piece) {
  const names = {
    '♔': 'Roi Blanc',
    '♕': 'Dame Blanche',
    '♖': 'Tour Blanche',
    '♗': 'Fou Blanc',
    '♘': 'Cavalier Blanc',
    '♙': 'Pion Blanc',
    '♚': 'Roi Noir',
    '♛': 'Dame Noire',
    '♜': 'Tour Noire',
    '♝': 'Fou Noir',
    '♞': 'Cavalier Noir',
    '♟': 'Pion Noir'
  };
  return names[piece] || 'Pièce inconnue';
}

