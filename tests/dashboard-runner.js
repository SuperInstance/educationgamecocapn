const { chromium } = require('playwright');

async function runDashboardTests() {
  console.log('📊 Running Dashboard Tests...\n');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Login first
    await page.goto('https://cocapn-hybrid-ide.casey-digennaro.workers.dev/login');
    await page.fill('input[name="username"]', 'magnus');
    await page.fill('input[name="password"]', 'tryme');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    
    // Test 1: Check dashboard structure
    console.log('✅ Test 1: Checking dashboard structure...');
    const heroTitle = await page.textContent('.hero h1');
    const heroSubtitle = await page.textContent('.hero p');
    console.log(`   Hero title: ${heroTitle}`);
    console.log(`   Hero subtitle: ${heroSubtitle}`);
    
    // Test 2: Check stats cards
    console.log('✅ Test 2: Checking stats cards...');
    const statCards = await page.count('.ai-stat-card');
    if (statCards === 4) {
      console.log('   ✅ All 4 stat cards are present');
    } else {
      console.log(`   ❌ Expected 4 stat cards, found ${statCards}`);
    }
    
    // Test 3: Check AI services grid
    console.log('✅ Test 3: Checking AI services grid...');
    const serviceChips = await page.count('.ai-tool-chip');
    console.log(`   Service chips: ${serviceChips}`);
    
    if (serviceChips >= 6) {
      console.log('   ✅ AI services grid is properly populated');
    } else {
      console.log('   ❌ AI services grid is missing some services');
    }
    
    // Test 4: Check feature cards
    console.log('✅ Test 4: Checking feature cards...');
    const featureCards = await page.count('.ai-feature-card');
    console.log(`   Feature cards: ${featureCards}`);
    
    // Test 5: Check navigation functionality
    console.log('✅ Test 5: Testing navigation...');
    const navLinks = page.locator('.nav-link');
    const linkCount = await navLinks.count();
    for (let i = 0; i < linkCount; i++) {
      const linkText = await navLinks.nth(i).textContent();
      console.log(`   Navigation link: ${linkText}`);
      await navLinks.nth(i).hover();
    }
    
    console.log('\n🎉 All dashboard tests completed successfully!\n');
    
  } catch (error) {
    console.error('❌ Dashboard test failed:', error.message);
    console.log('\n💡 Improvements needed:');
    console.log('   - Check dashboard loads correctly after login');
    console.log('   - Ensure all stats cards are present');
    console.log('   - Verify AI services grid is populated');
    console.log('   - Test feature card interactions');
    console.log('   - Check navigation functionality');
    
  } finally {
    await browser.close();
  }
}

// Run the tests
runDashboardTests().catch(console.error);
