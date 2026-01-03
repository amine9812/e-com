import { test, expect } from '@playwright/test';

// Smoke flow using mock payment mode

test('browse, add to cart, checkout with mock payment', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Products' }).click();
  await page.waitForLoadState('domcontentloaded');

  await page.locator('a[href^="/products/"]').first().click();

  await page.getByRole('button', { name: /Add to cart/i }).click();
  await page.getByRole('link', { name: 'Cart' }).click();
  await expect(page.getByText('Summary')).toBeVisible();
  await page.getByRole('link', { name: 'Proceed to checkout' }).click();

  await page.getByLabel('Full name').fill('Playwright Tester');
  await page.getByLabel('Email').fill('tester@example.com');
  await page.getByLabel('Address line 1').fill('123 Test St');
  await page.getByLabel('City').fill('Testville');
  await page.getByLabel('State').fill('TS');
  await page.getByLabel('Postal code').fill('12345');
  await page.getByLabel('Country').fill('USA');

  await page.getByRole('button', { name: /payment/i }).click();
  await page.waitForURL(/order\//, { timeout: 15000 });
  await expect(page.getByText('Order confirmation')).toBeVisible();
});
