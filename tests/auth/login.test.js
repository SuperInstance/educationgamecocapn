const { test, expect } = require('@playwright/test');

test.describe('Authentication Tests', () => {
  test('should display login page correctly', async ({ page }) => {
    await page.goto('/login');
    
    // Check page elements
    await expect(page.locator('h1')).toContainText('Cocapn');
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should auto-fill demo credentials', async ({ page }) => {
    await page.goto('/login');
    
    const usernameInput = page.locator('input[name="username"]');
    const passwordInput = page.locator('input[name="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    // Check if demo credentials are auto-filled
    const usernameValue = await usernameInput.inputValue();
    const passwordValue = await passwordInput.inputValue();
    
    expect(usernameValue).toBe('magnus');
    expect(passwordValue).toBe('tryme');
    
    // Verify submit button is enabled
    await expect(submitButton).toBeEnabled();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill with invalid credentials
    await page.fill('input[name="username"]', 'invalid');
    await page.fill('input[name="password"]', 'wrong');
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('Invalid credentials');
  });

  test('should redirect to dashboard after successful login', async ({ page }) => {
    await page.goto('/login');
    
    // Fill valid credentials
    await page.fill('input[name="username"]', 'magnus');
    await page.fill('input[name="password"]', 'tryme');
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/');
    await expect(page.locator('.dashboard')).toBeVisible();
  });

  test('should show loading state during login', async ({ page }) => {
    await page.goto('/login');
    
    // Start login process
    await page.fill('input[name="username"]', 'magnus');
    await page.fill('input[name="password"]", 'tryme');
    const submitPromise = page.click('button[type="submit"]');
    
    // Check loading state
    const button = page.locator('button[type="submit"]');
    await expect(button).toContainText('🤖 Authenticating...');
    
    await submitPromise;
  });

  test('should have proper form validation', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('input[name="username"]')).toBeFocused();
  });

  test('should remember user session', async ({ page }) => {
    await page.goto('/login');
    
    // Login successfully
    await page.fill('input[name="username"]', 'magnus');
    await page.fill('input[name="password"]', 'tryme');
    await page.click('button[type="submit"]');
    
    // Navigate to another page
    await page.goto('/');
    
    // Should remain logged in
    await expect(page.locator('.user-avatar')).toBeVisible();
    await expect(page.locator('button:has-text("Logout")')).toBeVisible();
  });
});
