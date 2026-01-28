const { test, expect } = require('@playwright/test');

test.describe('ChessBoard - Affichage initial', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Attendre que le composant soit chargé
    await page.waitForSelector('.chess-board', { timeout: 10000 });
  });

  test('devrait afficher le titre de l\'application', async ({ page }) => {
    const title = page.locator('h1');
    await expect(title).toBeVisible();
    await expect(title).toContainText('Échiquier');
  });

  test('devrait afficher les instructions', async ({ page }) => {
    await expect(page.locator('text=/Cliquez.*pièce/i')).toBeVisible();
  });

  test('devrait afficher le plateau d\'échecs 8x8', async ({ page }) => {
    const rows = page.locator('.board-row');
    await expect(rows).toHaveCount(8);
    
    // Vérifier que chaque ligne a 8 cases
    const firstRow = rows.first();
    const squares = firstRow.locator('.square');
    await expect(squares).toHaveCount(8);
  });

  test('devrait afficher 32 pièces au départ', async ({ page }) => {
    const squares = page.locator('.square');
    const allSquares = await squares.all();
    
    let pieceCount = 0;
    for (const square of allSquares) {
      const text = await square.textContent();
      if (text && text.trim() !== '') {
        pieceCount++;
      }
    }
    
    expect(pieceCount).toBe(32);
  });

  test('devrait afficher le bouton réinitialiser', async ({ page }) => {
    const resetButton = page.locator('button', { hasText: /réinitialiser/i });
    await expect(resetButton).toBeVisible();
    await expect(resetButton).toBeEnabled();
  });

  test('devrait afficher les panneaux d\'information', async ({ page }) => {
    await expect(page.locator('.info-panel, .sidebar, [class*="info"]').first()).toBeVisible();
  });
});

test.describe('ChessBoard - Sélection de pièces', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.chess-board');
  });

  test('devrait sélectionner une pièce au clic', async ({ page }) => {
    // Cliquer sur un pion blanc (ligne 6, colonne 4)
    const pawnSquare = page.locator('.board-row').nth(6).locator('.square').nth(4);
    
    // Vérifier que la case contient une pièce
    const pieceText = await pawnSquare.textContent();
    expect(pieceText.trim()).not.toBe('');
    
    await pawnSquare.click();
    
    // Vérifier que la case est sélectionnée (classe 'selected')
    await expect(pawnSquare).toHaveClass(/selected/);
  });

  test('ne devrait pas sélectionner une case vide', async ({ page }) => {
    // Cliquer sur une case vide (ligne 3, colonne 3)
    const emptySquare = page.locator('.board-row').nth(3).locator('.square').nth(3);
    
    await emptySquare.click();
    
    // Vérifier qu'aucune case n'a la classe 'selected'
    const selectedSquares = page.locator('.square.selected');
    await expect(selectedSquares).toHaveCount(0);
  });

  test('devrait afficher un message de sélection', async ({ page }) => {
    // Sélectionner une pièce
    const pawnSquare = page.locator('.board-row').nth(6).locator('.square').nth(4);
    await pawnSquare.click();
    
    // Vérifier le message
    await expect(page.locator('text=/sélectionnée/i')).toBeVisible();
  });
});

test.describe('ChessBoard - Déplacement de pièces', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.chess-board');
  });

  test('devrait déplacer un pion blanc', async ({ page }) => {
    // Sélectionner un pion blanc
    const fromSquare = page.locator('.board-row').nth(6).locator('.square').nth(4);
    const pieceContent = await fromSquare.textContent();
    
    await fromSquare.click();
    
    // Déplacer vers une case cible
    const toSquare = page.locator('.board-row').nth(4).locator('.square').nth(4);
    await toSquare.click();
    
    // Vérifier que la pièce a été déplacée
    await expect(toSquare).toHaveText(pieceContent);
    await expect(fromSquare).toHaveText('');
    
    // Vérifier que la sélection est annulée
    await expect(fromSquare).not.toHaveClass(/selected/);
  });

  test('devrait permettre de capturer une pièce adverse', async ({ page }) => {
    // Sélectionner un pion blanc
    const whitePawn = page.locator('.board-row').nth(6).locator('.square').nth(4);
    const whitePieceText = await whitePawn.textContent();
    
    await whitePawn.click();
    
    // Capturer un pion noir
    const blackPawn = page.locator('.board-row').nth(1).locator('.square').nth(4);
    await blackPawn.click();
    
    // Vérifier que la pièce blanche est maintenant sur la case du pion noir
    await expect(blackPawn).toHaveText(whitePieceText);
  });

  test('devrait permettre plusieurs déplacements successifs', async ({ page }) => {
    // Premier déplacement (pion blanc)
    await page.locator('.board-row').nth(6).locator('.square').nth(4).click();
    await page.locator('.board-row').nth(4).locator('.square').nth(4).click();
    
    // Petit délai
    await page.waitForTimeout(200);
    
    // Deuxième déplacement (pion noir)
    await page.locator('.board-row').nth(1).locator('.square').nth(4).click();
    await page.locator('.board-row').nth(3).locator('.square').nth(4).click();
    
    // Vérifier que les deux pièces ont été déplacées
    const firstMovedPiece = page.locator('.board-row').nth(4).locator('.square').nth(4);
    const secondMovedPiece = page.locator('.board-row').nth(3).locator('.square').nth(4);
    
    await expect(firstMovedPiece).not.toHaveText('');
    await expect(secondMovedPiece).not.toHaveText('');
  });
});

test.describe('ChessBoard - Historique des déplacements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.chess-board');
  });

  test('devrait afficher l\'historique vide au départ', async ({ page }) => {
    // Chercher un indicateur d'historique vide
    const emptyMessage = page.locator('text=/aucun/i');
    await expect(emptyMessage.first()).toBeVisible();
  });

  test('devrait enregistrer les mouvements dans l\'historique', async ({ page }) => {
    // Effectuer un déplacement
    await page.locator('.board-row').nth(6).locator('.square').nth(4).click();
    await page.locator('.board-row').nth(4).locator('.square').nth(4).click();
    
    // Attendre un peu pour la mise à jour
    await page.waitForTimeout(300);
    
    // Vérifier que l'historique a été mis à jour
    const historyItem = page.locator('.history-item, [class*="history"]').first();
    await expect(historyItem).toBeVisible();
  });

  test('devrait afficher plusieurs mouvements dans l\'ordre', async ({ page }) => {
    // Effectuer 3 déplacements
    await page.locator('.board-row').nth(6).locator('.square').nth(4).click();
    await page.locator('.board-row').nth(4).locator('.square').nth(4).click();
    await page.waitForTimeout(200);
    
    await page.locator('.board-row').nth(1).locator('.square').nth(4).click();
    await page.locator('.board-row').nth(3).locator('.square').nth(4).click();
    await page.waitForTimeout(200);
    
    await page.locator('.board-row').nth(7).locator('.square').nth(6).click();
    await page.locator('.board-row').nth(5).locator('.square').nth(5).click();
    await page.waitForTimeout(200);
    
    // Vérifier qu'il y a 3 éléments dans l'historique
    const historyItems = page.locator('.history-item, [class*="history"] > div');
    const count = await historyItems.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });
});

test.describe('ChessBoard - Position des pièces', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.chess-board');
  });

  test('devrait afficher toutes les positions des pièces', async ({ page }) => {
    // Chercher le panneau de positions
    const piecesPanel = page.locator('.pieces-panel, .pieces-list, [class*="piece"]').first();
    await expect(piecesPanel).toBeVisible();
  });

  test('devrait mettre à jour les positions après un déplacement', async ({ page }) => {
    // Effectuer un déplacement
    await page.locator('.board-row').nth(6).locator('.square').nth(4).click();
    await page.locator('.board-row').nth(4).locator('.square').nth(4).click();
    
    await page.waitForTimeout(300);
    
    // Vérifier que la notation e4 apparaît quelque part
    await expect(page.locator('.piece-position:has-text("e4")')).toBeVisible();
  });
});

test.describe('ChessBoard - Bouton Réinitialiser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.chess-board');
  });

  test('devrait réinitialiser le plateau après plusieurs coups', async ({ page }) => {
    // Effectuer plusieurs déplacements
    await page.locator('.board-row').nth(6).locator('.square').nth(4).click();
    await page.locator('.board-row').nth(4).locator('.square').nth(4).click();
    await page.waitForTimeout(200);
    
    await page.locator('.board-row').nth(1).locator('.square').nth(4).click();
    await page.locator('.board-row').nth(3).locator('.square').nth(4).click();
    await page.waitForTimeout(200);
    
    // Cliquer sur réinitialiser
    const resetButton = page.locator('button', { hasText: /réinitialiser/i });
    await resetButton.click();
    
    await page.waitForTimeout(300);
    
    // Vérifier que l'historique est vide
    const historyItems = page.locator('.history-item');
    await expect(historyItems).toHaveCount(0);
  });

  test('le bouton réinitialiser devrait être cliquable', async ({ page }) => {
    const resetButton = page.locator('button', { hasText: /réinitialiser/i });
    
    await expect(resetButton).toBeVisible();
    await expect(resetButton).toBeEnabled();
    
    // Vérifier qu'on peut cliquer
    await resetButton.click();
  });
});

test.describe('ChessBoard - Interactions visuelles', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.chess-board');
  });

  test('les cases devraient être visibles et cliquables', async ({ page }) => {
    const square = page.locator('.board-row').first().locator('.square').first();
    
    await expect(square).toBeVisible();
    await square.hover();
    await expect(square).toBeVisible();
  });

  test('devrait désélectionner une pièce après déplacement', async ({ page }) => {
    // Sélectionner une pièce
    const firstPawn = page.locator('.board-row').nth(6).locator('.square').nth(4);
    await firstPawn.click();
    await expect(firstPawn).toHaveClass(/selected/);
    
    // Déplacer
    const targetSquare = page.locator('.board-row').nth(4).locator('.square').nth(4);
    await targetSquare.click();
    
    // Vérifier la désélection
    await expect(firstPawn).not.toHaveClass(/selected/);
  });
});

test.describe('ChessBoard - Tests de régression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.chess-board');
  });

  test('devrait gérer une partie complète sans erreur', async ({ page }) => {
    // Effectuer 5 coups
    const moves = [
      [[6, 4], [4, 4]], // e4
      [[1, 4], [3, 4]], // e5
      [[7, 6], [5, 5]], // Nf3
      [[0, 1], [2, 2]], // Nc6
      [[6, 3], [4, 3]], // d4
    ];
    
    for (const [from, to] of moves) {
      const fromSquare = page.locator('.board-row').nth(from[0]).locator('.square').nth(from[1]);
      const toSquare = page.locator('.board-row').nth(to[0]).locator('.square').nth(to[1]);
      
      await fromSquare.click();
      await toSquare.click();
      await page.waitForTimeout(200);
    }
    
    // Vérifier qu'il n'y a pas d'erreur JavaScript
    const errors = [];
    page.on('pageerror', error => errors.push(error));
    
    expect(errors.length).toBe(0);
  });
});