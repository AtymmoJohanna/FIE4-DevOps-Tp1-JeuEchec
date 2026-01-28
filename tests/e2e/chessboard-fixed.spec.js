const { test, expect } = require('@playwright/test');

// Test corrigé pour l'historique vide
test('devrait afficher l\'historique vide au départ', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.chess-board');
  
  // Option 1 : Vérifier le nombre de mouvements
  const moveCount = page.locator('.move-count, [class*="count"]');
  await expect(moveCount).toContainText('0');
  
  // Option 2 : Vérifier qu'il n'y a pas d'éléments d'historique
  const historyItems = page.locator('.history-item');
  await expect(historyItems).toHaveCount(0);
});

// Test corrigé pour la position e4
test('devrait mettre à jour les positions après un déplacement', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.chess-board');
  
  await page.locator('.board-row').nth(6).locator('.square').nth(4).click();
  await page.locator('.board-row').nth(4).locator('.square').nth(4).click();
  
  await page.waitForTimeout(300);
  
  // Plus spécifique - chercher dans le panneau des pièces
  await expect(page.locator('.pieces-panel').locator('text=e4').first()).toBeVisible();
});