import { test, expect } from '@playwright/test';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false,
    });
    await page.routeFromHAR('tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false,
    });
    await page.routeFromHAR('tests/hars/order.har', {
      url: '**/api/orders',
      update: false,
    });

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'Bearer mock-access-token',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('/');
  });

  test('добавление ингредиента в конструктор', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredients-category"]', {
      timeout: 10000,
    });

    const addButton = page.locator('button:has-text("Добавить")').first();
    await addButton.click();

    await expect(page.locator('[data-testid="constructor"]')).toContainText(
      'Краторная булка N-200i'
    );
  });

  test('открытие модального окна ингредиента', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredients-category"]', {
      timeout: 10000,
    });

    const ingredientCard = page.locator('a[href^="/ingredients/"]').first();
    await ingredientCard.click();

    await expect(page.locator('[data-testid="modal"]')).toBeVisible();
    await expect(page.locator('[data-testid="modal"]')).toContainText(
      'Краторная булка N-200i'
    );
  });

  test('закрытие модалки по крестику', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredients-category"]', {
      timeout: 10000,
    });

    const ingredientCard = page.locator('a[href^="/ingredients/"]').first();
    await ingredientCard.click();
    await expect(page.locator('[data-testid="modal"]')).toBeVisible();

    await page.locator('[data-testid="modal-close"]').click();

    await expect(page.locator('[data-testid="modal"]')).not.toBeVisible();
  });

  test('закрытие модалки по клику на оверлей', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredients-category"]', {
      timeout: 10000,
    });

    const ingredientCard = page.locator('a[href^="/ingredients/"]').first();
    await ingredientCard.click();
    await expect(page.locator('[data-testid="modal"]')).toBeVisible();

    await page.locator('[data-testid="modal-overlay"]').click({
      position: { x: 10, y: 10 },
    });

    await expect(page.locator('[data-testid="modal"]')).not.toBeVisible();
  });

  test('создание заказа', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredients-category"]', {
      timeout: 10000,
    });

    const bunAdd = page.locator('button:has-text("Добавить")').first();
    await bunAdd.click();

    const fillingAdd = page.locator('button:has-text("Добавить")').nth(2);
    await fillingAdd.click();

    await page.locator('button:has-text("Оформить заказ")').click();

    await page.waitForSelector('[data-testid="modal"]', { timeout: 10000 });

    await expect(page.locator('[data-testid="modal"]')).toContainText('12345');

    await page.locator('[data-testid="modal-close"]').click();
    await expect(page.locator('[data-testid="modal"]')).not.toBeVisible();

    await expect(page.locator('[data-testid="constructor"]')).toContainText(
      'Выберите булки'
    );
  });
});