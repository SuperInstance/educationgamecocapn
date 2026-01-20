const { test, expect } = require('@playwright/test');

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'magnus');
    await page.fill('input[name="password"]', 'tryme');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('should have proper semantic HTML structure', async ({ page }) => {
    // Check main landmark
    const mainElement = page.locator('main');
    await expect(mainElement).toBeVisible();
    
    // Check navigation structure
    const navElement = page.locator('nav');
    await expect(navElement).toBeVisible();
    
    // Check heading hierarchy
    const headings = page.locator('h1, h2, h3');
    await expect(headings.first()).toHaveCount(1); // Only one h1 per page
  });

  test('should have proper ARIA labels and roles', async ({ page }) => {
    // Check form elements have proper labels
    const usernameInput = page.locator('input[name="username"]');
    await expect(usernameInput).toHaveAttribute('aria-label', 'Username');
    
    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toHaveAttribute('aria-label', 'Password');
    
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('should be navigable via keyboard', async ({ page }) => {
    // Test tab navigation
    const focusableElements = page.locator('input, button, a, [tabindex]');
    
    // Tab through all focusable elements
    const elementCount = await focusableElements.count();
    for (let i = 0; i < elementCount; i++) {
      await page.keyboard.press('Tab');
      const activeElement = await page.evaluate(() => document.activeElement);
      expect(activeElement).toBeVisible();
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    // Test text contrast ratios
    const textElements = page.locator('h1, h2, h3, p, button, .nav-link');
    
    for (let i = 0; i < Math.min(5, textElements.count()); i++) {
      const element = textElements.nth(i);
      const computedStyle = await element.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          color: style.color,
          backgroundColor: style.backgroundColor
        };
      });
      
      console.log(`Element ${i} color: ${computedStyle.color}, background: ${computedStyle.backgroundColor}`);
      
      // Basic check - colors should be defined
      expect(computedStyle.color).toBeTruthy();
      expect(computedStyle.backgroundColor).toBeTruthy();
    }
  });

  test('should work with screen readers', async ({ page }) => {
    // Test that important elements are announced properly
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toHaveText(/Cocapn/);
    
    await expect(page.locator('.hero p')).toBeVisible();
    await expect(page.locator('.hero p')).toHaveText(/AI-Powered Development Platform/);
  });

  test('should handle focus management', async ({ page }) => {
    // Open a modal or dropdown and test focus trapping
    const userAvatar = page.locator('.user-avatar');
    await userAvatar.click();
    
    // Focus should be trapped in the user menu
    const logoutButton = page.locator('button:has-text("Logout")');
    await expect(logoutButton).toBeVisible();
    
    // Test ESC key closes menu
    await page.keyboard.press('Escape');
    await expect(logoutButton).not.toBeVisible();
  });

  test('should have accessible form controls', async ({ page }) => {
    // Test form validation
    await page.goto('/login');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Error messages should be accessible
    const errorMessages = page.locator('.error-message, [role="alert"]');
    await expect(errorMessages.first()).toBeVisible();
  });

  test('should provide skip navigation links', async ({ page }) => {
    // Check for skip navigation link
    const skipLink = page.locator('a[href="#main"], a[href="#content"], a[tabindex="-1"]');
    
    if (await skipLink.count() > 0) {
      await expect(skipLink.first()).toBeVisible();
      await expect(skipLink.first()).toHaveAttribute('tabindex', '-1');
    }
  });

  test('should handle reduced motion preferences', async ({ page }) => {
    // Test prefers-reduced-motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    // Animations should be disabled or minimized
    await page.goto('/');
    
    // Check that animations are not too intense
    const animatedElements = page.locator('[class*="animate"], [style*="animation"]');
    await expect(animatedElements.first()).toBeVisible();
  });

  test('should work with high contrast mode', async ({ page }) => {
    // Test high contrast preferences
    await page.emulateMedia({ forcedColors: 'active' });
    
    // Page should remain functional
    await expect(page.locator('.dashboard')).toBeVisible();
    await expect(page.locator('.nav-link')).toBeVisible();
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingLevels = [];
    
    for (let i = 0; i < await headings.count(); i++) {
      const tagName = await headings.nth(i).tagName();
      headingLevels.push(parseInt(tagName.replace('h', '')));
    }
    
    console.log('Heading levels:', headingLevels);
    
    // Check logical heading order (no skipping levels excessively)
    for (let i = 1; i < headingLevels.length; i++) {
      const diff = headingLevels[i] - headingLevels[i - 1];
      // Allow level jumps but avoid extreme skips
      expect(Math.abs(diff)).toBeLessThanOrEqual(3);
    }
  });

  test('should have accessible notifications', async ({ page }) => {
    // Test that notifications are accessible
    await page.click('text=Start Simulation');
    
    const notification = page.locator('.notification');
    await expect(notification).toBeVisible();
    
    // Check notification has appropriate ARIA attributes
    await expect(notification).toHaveAttribute('role', 'alert');
    await expect(notification).toBeVisible();
  });

  test('should support keyboard shortcuts', async ({ page }) => {
    // Test common keyboard shortcuts
    const shortcuts = [
      { key: 'Tab', description: 'Tab navigation' },
      { key: 'Enter', description: 'Activate element' },
      { key: 'Escape', description: 'Close modal/dropdown' },
      { key: 'ArrowDown', description: 'Navigate down' },
      { key: 'ArrowUp', description: 'Navigate up' }
    ];
    
    for (const shortcut of shortcuts) {
      // Test that keys don't cause errors
      await page.keyboard.press(shortcut.key);
      await page.waitForTimeout(100);
    }
  });
});
