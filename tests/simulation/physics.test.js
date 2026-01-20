const { test, expect } = require('@playwright/test');

test.describe('Physics Simulation Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="username"]', 'magnus');
    await page.fill('input[name="password"]', 'tryme');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('should start simulation successfully', async ({ page }) => {
    // Click on AI Simulation feature card
    await page.click('text=Start Simulation');
    
    // Should show notification
    const notification = page.locator('.notification');
    await expect(notification).toBeVisible();
    await expect(notification).toContainText('Starting simulation');
  });

  test('should generate design with Flux', async ({ page }) => {
    // Click on AI Design Generator
    await page.click('text=Generate Design');
    
    // Should show generation notification
    const notification = page.locator('.notification');
    await expect(notification).toBeVisible();
    await expect(notification).toContainText('Generating design with Cloudflare Flux');
  });

  test('should create audio content with TTS', async ({ page }) => {
    // Click on Audio Content
    await page.click('text=Create Audio');
    
    // Should show audio generation notification
    const notification = page.locator('.notification');
    await expect(notification).toBeVisible();
    await expect(notification).toContainText('Creating audio content with TTS');
  });

  test('should analyze content with AI', async ({ page }) => {
    // Click on Content Analysis
    await page.click('text=Analyze Content');
    
    // Should show analysis notification
    const notification = page.locator('.notification');
    await expect(notification).toBeVisible();
    await expect(notification).toContainText('Analyzing content with AI');
  });

  test('should test AI services from tools section', async ({ page }) => {
    const serviceButtons = page.locator('.ai-tool-chip');
    
    // Test Text-to-Image service
    await serviceButtons.first().click();
    let notification = page.locator('.notification');
    await expect(notification).toBeVisible();
    await expect(notification).toContainText('Testing Text-to-Image generation');
    
    // Test Text-to-Speech service
    await serviceButtons.nth(1).click();
    notification = page.locator('.notification');
    await expect(notification).toBeVisible();
    await expect(notification).toContainText('Testing Text-to-Speech conversion');
    
    // Test Image Analysis service
    await serviceButtons.nth(2).click();
    notification = page.locator('.notification');
    await expect(notification).toBeVisible();
    await expect(notification).toContainText('Testing Image analysis');
  });

  test('should handle collaborative session creation', async ({ page }) => {
    // Click on Collaboration
    await page.click('text=Start Collaboration');
    
    // Should show collaboration notification
    const notification = page.locator('.notification');
    await expect(notification).toBeVisible();
    await expect(notification).toContainText('Creating AI collaboration session');
  });

  test('should create learning content', async ({ page }) => {
    // Click on Learning
    await page.click('text=Start Learning');
    
    // Should show learning content notification
    const notification = page.locator('.notification');
    await expect(notification).toBeVisible();
    await expect(notification).toContainText('Creating AI learning content');
  });

  test('should handle feature loading states', async ({ page }) => {
    const featureButtons = page.locator('.ai-feature-button');
    
    // Test each feature button loading state
    for (let i = 0; i < 6; i++) {
      await featureButtons.nth(i).click();
      
      // Button should change state
      await expect(featureButtons.nth(i)).toBeVisible();
      
      // Wait for notification to disappear before next click
      await page.waitForTimeout(2000);
    }
  });

  test('should display correct AI service information', async ({ page }) => {
    // Check that AI services section is present
    const aiServicesSection = page.locator('.ai-tools-section');
    await expect(aiServicesSection).toBeVisible();
    
    // Check title
    await expect(aiServicesSection.locator('.ai-tools-title')).toContainText('Cloudflare AI Services');
    
    // Check service count
    const serviceChips = aiServicesSection.locator('.ai-tool-chip');
    await expect(serviceChips).toHaveCount(6);
  });

  test('should handle notification system correctly', async ({ page }) => {
    // Click multiple features to generate notifications
    await page.click('text=Start Simulation');
    await page.click('text=Generate Design');
    await page.click('text=Create Audio');
    
    // Should show multiple notifications
    const notifications = page.locator('.notification');
    await expect(notifications).toHaveCount(3);
    
    // Wait for notifications to disappear
    await page.waitForTimeout(5000);
    await expect(notifications).toHaveCount(0);
  });
});
