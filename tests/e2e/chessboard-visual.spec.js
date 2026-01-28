const { test, expect } = require('@playwright/test');

test.describe('ChessBoard - Tests visuels', () => {
  test('screenshot du plateau initial', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.chess-board');
    
    // Prendre un screenshot de toute la page
    await expect(page).toHaveScreenshot('chessboard-initial.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('screenshot avec une pièce sélectionnée', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.chess-board');
    
    // Sélectionner une pièce
    await page.locator('.board-row').nth(6).locator('.square').nth(4).click();
    
    await expect(page).toHaveScreenshot('chessboard-piece-selected.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('screenshot après un déplacement', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.chess-board');
    
    // Effectuer un déplacement
    await page.locator('.board-row').nth(6).locator('.square').nth(4).click();
    await page.locator('.board-row').nth(4).locator('.square').nth(4).click();
    await page.waitForTimeout(300);
    
    await expect(page).toHaveScreenshot('chessboard-after-move.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });
});