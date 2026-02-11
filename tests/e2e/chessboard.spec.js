import { test, expect } from '@playwright/test';

test.describe('Échiquier interactif', () => {

  test.beforeEach(async ({ page }) => {
    // Charge l'application
    await page.goto('http://localhost:8080'); // adapte le port si nécessaire
  });

  test('L\'échiquier se charge correctement', async ({ page }) => {
    // Vérifie que 8x8 cases sont présentes
    const squares = page.locator('.chess-board .square');
    await expect(squares).toHaveCount(64);

    // Vérifie que le tour commence avec les blancs
    await expect(page.locator('.turn-text')).toContainText('Blancs');
  });

  test('Sélection et déplacement d\'une pièce légale', async ({ page }) => {
    // Clique sur le pion blanc en e2 (ligne 6, colonne 4)
    await page.locator('.board-row').nth(6).locator('.square').nth(4).click();

    // Vérifie que la case est sélectionnée
    const selectedSquare = page.locator('.square.selected');
    await expect(selectedSquare).toHaveCount(1);

    // Vérifie qu'il y a des coups légaux indiqués
    const legalMoves = page.locator('.square.legal-move');
    await expect(legalMoves).toHaveCountGreaterThan(0);

    // Déplace le pion de e2 à e4 (ligne 4, colonne 4)
    await page.locator('.board-row').nth(4).locator('.square').nth(4).click();

    // Vérifie que le pion a bougé
    const movedPiece = await page.locator('.board-row').nth(4).locator('.square').nth(4).textContent();
    expect(movedPiece.trim()).toBe('♙');

    // Vérifie que le tour a changé aux noirs
    await expect(page.locator('.turn-text')).toContainText('Noirs');

    // Vérifie que l'historique a été mis à jour
    const historyItem = page.locator('.history-item').first();
    await expect(historyItem).toContainText('e2 → e4');
  });

  test('Déplacement illégal ne change pas l\'échiquier', async ({ page }) => {
    // Sélectionne le pion e2
    await page.locator('.board-row').nth(6).locator('.square').nth(4).click();

    // Essaye un déplacement illégal vers e5 (ligne 3, colonne 4)
    await page.locator('.board-row').nth(3).locator('.square').nth(4).click();

    // Le pion ne doit pas bouger
    const originalPiece = await page.locator('.board-row').nth(6).locator('.square').nth(4).textContent();
    expect(originalPiece.trim()).toBe('♙');

    // L'historique ne doit pas s'être mis à jour
    const historyItems = await page.locator('.history-item');
    expect(await historyItems.count()).toBe(0);
  });

  test('Réinitialisation de l\'échiquier', async ({ page }) => {
    // Déplace un pion pour changer l'état
    await page.locator('.board-row').nth(6).locator('.square').nth(4).click();
    await page.locator('.board-row').nth(4).locator('.square').nth(4).click();

    // Clique sur le bouton réinitialiser
    await page.locator('.reset-button').click();

    // Vérifie que l'échiquier est revenu à l'état initial
    const piece = await page.locator('.board-row').nth(6).locator('.square').nth(4).textContent();
    expect(piece.trim()).toBe('♙');

    // Vérifie que l'historique est vide
    const historyItems = await page.locator('.history-item');
    expect(await historyItems.count()).toBe(0);

    // Vérifie que le tour est aux blancs
    await expect(page.locator('.turn-text')).toContainText('Blancs');
  });

});
