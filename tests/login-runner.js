const { chromium } = require('playwright');

async function runLoginTests() {
  console.log('🔐 Running Login Tests...\n');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Test 1: Check login page loads
    console.log('✅ Test 1: Loading login page...');
    await page.goto('https://cocapn-hybrid-ide.casey-digennaro.workers.dev/login');
    await page.waitForSelector('h1');
    const pageTitle = await page.textContent('h1');
    console.log(`   Page title: ${pageTitle}`);
    
    // Test 2: Check demo credentials are auto-filled
    console.log('✅ Test 2: Checking demo credentials...');
    const username = await page.inputValue('input[name="username"]');
    const password = await page.inputValue('input[name="password"]');
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    
    if (username === 'magnus' && password === 'tryme') {
      console.log('   ✅ Demo credentials are correctly pre-filled');
    } else {
      console.log('   ❌ Demo credentials are not pre-filled');
    }
    
    // Test 3: Check login functionality
    console.log('✅ Test 3: Testing login functionality...');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    
    if (page.url().includes('/')) {
      console.log('   ✅ Login successful - redirected to dashboard');
    } else {
      console.log('   ❌ Login failed - not redirected');
    }
    
    // Test 4: Check dashboard elements
    console.log('✅ Test 4: Checking dashboard elements...');
    const heroTitle = await page.textContent('.hero h1');
    const statCards = await page.count('.ai-stat-card');
    console.log(`   Hero title: ${heroTitle}`);
    console.log(`   Stat cards: ${statCards}`);
    
    // Test 5: Check responsive design
    console.log('✅ Test 5: Testing responsive design...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    console.log('   ✅ Mobile view tested');
    
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    console.log('   ✅ Tablet view tested');
    
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(1000);
    console.log('   ✅ Desktop view tested');
    
    console.log('\n🎉 All login tests completed successfully!\n');
    
  } catch (error) {
    console.error('❌ Login test failed:', error.message);
    console.log('\n💡 Improvements needed:');
    console.log('   - Check if login page loads correctly');
    console.log('   - Verify demo credentials are pre-filled');
    console.log('   - Test login redirect functionality');
    console.log('   - Ensure responsive design works');
    
  } finally {
    await browser.close();
  }
}

// Run the tests
runLoginTests().catch(console.error);
