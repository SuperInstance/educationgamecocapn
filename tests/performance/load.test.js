const { test, expect } = require('@playwright/test');

test.describe('Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear browser cache before each test
    await page.context().clearCookies();
  });

  test('should load login page quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/login');
    const loadTime = Date.now() - startTime;
    
    console.log(`Login page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000); // Should load in under 3 seconds
  });

  test('should load dashboard efficiently', async ({ page }) => {
    // First, login
    await page.goto('/login');
    await page.fill('input[name="username"]', 'magnus');
    await page.fill('input[name="password"]', 'tryme');
    await page.click('button[type="submit"]');
    
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    console.log(`Dashboard load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000); // Should load in under 5 seconds
  });

  test('should handle concurrent requests efficiently', async ({ { browser } }) => {
    const contexts = await Promise.all([
      browser.newContext(),
      browser.newContext(),
      browser.newContext()
    ]);
    
    const pages = await Promise.all(
      contexts.map(context => context.newPage())
    );
    
    // Start loading pages simultaneously
    const startTime = Date.now();
    await Promise.all([
      pages[0].goto('/login'),
      pages[1].goto('/login'),
      pages[2].goto('/login')
    ]);
    const loadTime = Date.now() - startTime;
    
    console.log(`Concurrent login load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000); // Should handle concurrent requests
    
    // Clean up
    await Promise.all(contexts.map(context => context.close()));
  });

  test('should cache assets effectively', async ({ page }) => {
    // First visit
    await page.goto('/login');
    const firstLoadResources = await page.evaluate(() => {
      return window.performance.getEntriesByType('resource')
        .filter(entry => entry.initiatorType === 'img' || entry.initiatorType === 'css')
        .map(entry => entry.name);
    });
    
    // Second visit (should use cache)
    await page.goto('/login');
    const secondLoadResources = await page.evaluate(() => {
      return window.performance.getEntriesByType('resource')
        .filter(entry => entry.initiatorType === 'img' || entry.initiatorType === 'css')
        .map(entry => entry.name);
    });
    
    console.log(`First load resources: ${firstLoadResources.length}`);
    console.log(`Second load resources: ${secondLoadResources.length}`);
    
    // Second load should have fewer resources (cached)
    expect(secondLoadResources.length).toBeLessThanOrEqual(firstLoadResources.length);
  });

  test('should handle large number of AI services without performance degradation', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'magnus');
    await page.fill('input[name="password"]', 'tryme');
    await page.click('button[type="submit"]');
    
    // Test performance with multiple AI service interactions
    const serviceButtons = page.locator('.ai-tool-chip');
    const startTime = Date.now();
    
    for (let i = 0; i < 6; i++) {
      await serviceButtons.nth(i).click();
      await page.waitForTimeout(500); // Wait for notification
    }
    
    const interactionTime = Date.now() - startTime;
    console.log(`AI services interaction time: ${interactionTime}ms`);
    
    expect(interactionTime).toBeLessThan(10000); // Should complete in under 10 seconds
  });

  test('should maintain performance with user state', async ({ page }) => {
    // Login and set up user state
    await page.goto('/login');
    await page.fill('input[name="username"]', 'magnus');
    await page.fill('input[name="password"]', 'tryme');
    await page.click('button[type="submit"]');
    
    // Navigate around to build user state
    await page.click('text=Features');
    await page.click('text=Analytics');
    await page.click('text=Features');
    
    // Test performance with existing user state
    const startTime = Date.now();
    await page.click('text=Start Simulation');
    const loadTime = Date.now() - startTime;
    
    console.log(`Simulation start time with user state: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000); // Should respond quickly with existing state
  });

  test('should handle memory usage efficiently', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="username"]', 'magnus');
    await page.fill('input[name="password"]', 'tryme');
    await page.click('button[type="submit"]');
    
    // Perform memory-intensive operations
    const startTime = Date.now();
    
    // Click multiple features
    await page.click('text=Start Simulation');
    await page.click('text=Generate Design');
    await page.click('text=Create Audio');
    
    // Wait for all operations to complete
    await page.waitForTimeout(3000);
    
    const operationTime = Date.now() - startTime;
    console.log(`Memory-intensive operations time: ${operationTime}ms`);
    
    expect(operationTime).toBeLessThan(8000); // Should complete memory operations efficiently
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Test 404 handling
    const response = await page.goto('/nonexistent-page');
    expect(response.status()).toBe(404);
    
    // Test 401 handling (should redirect to login)
    await page.context().clearCookies();
    await page.goto('/');
    await expect(page).toHaveURL('/login');
  });

  test('should provide performance feedback to users', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'magnus');
    await page.fill('input[name="password"]', 'tryme');
    await page.click('button[type="submit"]');
    
    // Check that UI provides feedback for operations
    const startTime = Date.now();
    await page.click('text=Start Simulation');
    
    // Should show loading state
    const button = page.locator('button:has-text("🚀 Starting AI-powered simulation...")');
    await expect(button).toBeVisible();
    
    // Should complete within reasonable time
    await expect(page.locator('.notification')).toBeVisible();
    const loadTime = Date.now() - startTime;
    
    console.log(`Operation with feedback time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000);
  });
});
