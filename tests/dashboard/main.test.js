const { test, expect } = require('@playwright/test');

test.describe('Dashboard Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="username"]', 'magnus');
    await page.fill('input[name="password"]', 'tryme');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('should display dashboard correctly', async ({ page }) => {
    await expect(page.locator('.hero h1')).toBeVisible();
    await expect(page.locator('.hero h1')).toContainText('AI-Powered Development Platform');
    await expect(page.locator('.hero p')).toBeVisible();
  });

  test('should show user stats correctly', async ({ page }) => {
    const statCards = page.locator('.ai-stat-card');
    await expect(statCards).toHaveCount(4);
    
    // Check specific stats
    await expect(statCards.first()).toContainText('25+');
    await expect(statCards.nth(1)).toContainText('Cloudflare');
    await expect(statCards.nth(2)).toContainText('100+');
    await expect(statCards.nth(3)).toContainText('2.5s');
  });

  test('should display AI services grid', async ({ page }) => {
    const serviceCards = page.locator('.ai-tool-chip');
    await expect(serviceCards).toHaveCount(6);
    
    // Check specific services
    await expect(serviceCards.first()).toContainText('Text-to-Image');
    await expect(serviceCards.nth(1)).toContainText('Text-to-Speech');
  });

  test('should handle feature card interactions', async ({ page }) => {
    const featureCards = page.locator('.ai-feature-card');
    
    // Test each feature card
    for (let i = 0; i < 6; i++) {
      await featureCards.nth(i).hover();
      await expect(featureCards.nth(i)).toHaveCSS('transform', 'translateY(-4px)');
    }
  });

  test('should show notifications correctly', async ({ page }) => {
    // Wait for welcome notification
    const notification = page.locator('.notification');
    await expect(notification).toBeVisible();
    await expect(notification).toContainText('Welcome back, Magnus');
  });

  test('should handle navigation links', async ({ page }) => {
    const navLinks = page.locator('.nav-link');
    
    for (let i = 0; i < 3; i++) {
      await navLinks.nth(i).hover();
      await expect(navLinks.nth(i)).toHaveCSS('color', 'rgb(99, 102, 241)');
    }
  });

  test('should handle user menu', async ({ page }) => {
    const userAvatar = page.locator('.user-avatar');
    await userAvatar.click();
    
    // Should show user info and logout option
    await expect(page.locator('button:has-text("Logout")')).toBeVisible();
  });

  test('should display AI badges correctly', async ({ page }) => {
    const badges = page.locator('.ai-feature-badge');
    await expect(badges).toHaveCount(6);
    
    // Check specific badges
    await expect(badges.first()).toContainText('AI Enhanced');
    await expect(badges.nth(1)).toContainText('Cloudflare Flux');
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.dashboard')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('.dashboard')).toBeVisible();
    
    // Test desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator('.dashboard')).toBeVisible();
  });

  test('should handle scroll behavior', async ({ page }) => {
    // Scroll to features section
    await page.click('text=Features');
    await expect(page.locator('#features')).toBeInViewport();
    
    // Scroll to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(page.locator('.hero')).toBeInViewport();
  });
});
