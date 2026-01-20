const { test, expect } = require('@playwright/test');

test.describe('Responsive Design Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="username"]', 'magnus');
    await page.fill('input[name="password"]', 'tryme');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test.describe('Mobile View (375x667)', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should display mobile-friendly layout', async ({ page }) => {
      await expect(page.locator('.dashboard')).toBeVisible();
      
      // Check that navigation adapts to mobile
      const navLinks = page.locator('.nav-link');
      await expect(navLinks).toHaveCount(3);
      
      // Check that feature cards stack vertically
      const featureCards = page.locator('.ai-feature-card');
      await expect(featureCards).toHaveCount(6);
    });

    test('should handle mobile menu toggle', async ({ page }) => {
      // Test mobile navigation
      const navContainer = page.locator('.nav-container');
      await expect(navContainer).toBeVisible();
      
      // Check user avatar is clickable on mobile
      const userAvatar = page.locator('.user-avatar');
      await expect(userAvatar).toBeVisible();
    });

    test('should display mobile-optimized stats', async ({ page }) => {
      const statCards = page.locator('.ai-stat-card');
      await expect(statCards).toHaveCount(4);
      
      // Check that stats are readable on mobile
      await expect(statCards.first()).toBeVisible();
      await expect(statCards.first().locator('.stat-value')).toBeVisible();
    });

    test('should handle mobile touch interactions', async ({ page }) => {
      const featureCards = page.locator('.ai-feature-card');
      
      // Test tap interactions
      for (let i = 0; i < Math.min(3, featureCards.count()); i++) {
        await featureCards.nth(i).tap();
        await page.waitForTimeout(500);
      }
    });
  });

  test.describe('Tablet View (768x1024)', () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test('should display tablet-optimized layout', async ({ page }) => {
      await expect(page.locator('.dashboard')).toBeVisible();
      
      // Check grid layout adapts to tablet
      const statsGrid = page.locator('.ai-stats-grid');
      await expect(statsGrid).toBeVisible();
      
      const featureCards = page.locator('.ai-feature-card');
      await expect(featureCards).toHaveCount(6);
    });

    test('should handle tablet navigation', async ({ page }) => {
      const navLinks = page.locator('.nav-link');
      await expect(navLinks).toHaveCount(3);
      
      // Test hover effects on tablet
      await navLinks.first().hover();
      await expect(navLinks.first()).toHaveCSS('color', 'rgb(99, 102, 241)');
    });

    test('should display tablet-friendly service grid', async ({ page }) => {
      const serviceChips = page.locator('.ai-tool-chip');
      await expect(serviceChips).toHaveCount(6);
      
      // Check that services are properly arranged
      await expect(serviceChips.first()).toBeVisible();
    });
  });

  test.describe('Desktop View (1280x720)', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should display desktop-optimized layout', async ({ page }) => {
      await expect(page.locator('.dashboard')).toBeVisible();
      
      // Check full desktop layout
      const statsGrid = page.locator('.ai-stats-grid');
      await expect(statsGrid).toBeVisible();
      
      const featureCards = page.locator('.ai-feature-card');
      await expect(featureCards).toHaveCount(6);
      
      // Check navigation elements
      const navLinks = page.locator('.nav-link');
      await expect(navLinks).toHaveCount(3);
    });

    test('should handle desktop interactions', async ({ page }) => {
      const featureCards = page.locator('.ai-feature-card');
      
      // Test hover effects
      for (let i = 0; i < Math.min(3, featureCards.count()); i++) {
        await featureCards.nth(i).hover();
        await expect(featureCards.nth(i)).toHaveCSS('transform', 'translateY(-4px)');
        await expect(featureCards.nth(i)).toHaveCSS('box-shadow', 'rgba(0, 0, 0, 0.2)');
      }
    });

    test('should display full dashboard elements', async ({ page }) => {
      // Check all dashboard elements are visible
      await expect(page.locator('.hero')).toBeVisible();
      await expect(page.locator('.ai-stats-grid')).toBeVisible();
      await expect(page.locator('.ai-tools-section')).toBeVisible();
      await expect(page.locator('.ai-features-grid')).toBeVisible();
    });
  });

  test('should handle viewport resizing', async ({ page }) => {
    // Start with desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Verify desktop layout
    await expect(page.locator('.dashboard')).toBeVisible();
    
    // Resize to tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('.dashboard')).toBeVisible();
    
    // Resize to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.dashboard')).toBeVisible();
    
    // Resize back to desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator('.dashboard')).toBeVisible();
  });

  test('should maintain content integrity across viewports', async ({ page }) => {
    // Get content from desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    const desktopTitle = await page.locator('.hero h1').textContent();
    const desktopStats = await page.locator('.ai-stat-card').count();
    
    // Switch to mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify content is the same
    const mobileTitle = await page.locator('.hero h1').textContent();
    const mobileStats = await page.locator('.ai-stat-card').count();
    
    expect(desktopTitle).toBe(mobileTitle);
    expect(desktopStats).toBe(mobileStats);
  });

  test('should handle touch events on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Test tap interactions
    const featureCards = page.locator('.ai-feature-card');
    
    for (let i = 0; i < Math.min(3, featureCards.count()); i++) {
      await featureCards.nth(i).tap();
      await page.waitForTimeout(300);
    }
    
    // Test swipe gestures (simulate)
    await page.mouse.move(100, 300);
    await page.mouse.down();
    await page.mouse.move(200, 300);
    await page.mouse.up();
  });
});
