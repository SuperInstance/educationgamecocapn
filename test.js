/**
 * Test Suite for Cocapn Hybrid IDE Deployment
 * Run this script to verify deployment functionality
 */

const testUrls = {
  mainApp: 'https://cocapn.ai',
  devBackend: 'https://cocapn.ai/dev',
  mainLogin: 'https://cocapn.ai/login',
  devLogin: 'https://cocapn.ai/dev/login',
  mainApi: 'https://cocapn.ai/api',
  devApi: 'https://cocapn.ai/dev/api'
};

const testCredentials = {
  betaTester: { username: 'magnus', password: 'tryme' },
  developer: { username: 'casey', password: 'fixme' }
};

class DeploymentTester {
  constructor() {
    this.results = [];
    this.passed = 0;
    this.failed = 0;
  }

  log(testName, status, details = '') {
    const result = { testName, status, details, timestamp: new Date() };
    this.results.push(result);

    const statusIcon = status === 'PASS' ? '✅' : '❌';
    console.log(`${statusIcon} ${testName}: ${details}`);

    if (status === 'PASS') this.passed++;
    else this.failed++;
  }

  async testUrl(url, testName, expectedStatus = 200) {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'cors',
        headers: {
          'User-Agent': 'Cocapn-Test-Suite/1.0'
        }
      });

      if (response.status === expectedStatus) {
        this.log(testName, 'PASS', `Status: ${response.status}`);
        return true;
      } else {
        this.log(testName, 'FAIL', `Expected ${expectedStatus}, got ${response.status}`);
        return false;
      }
    } catch (error) {
      this.log(testName, 'FAIL', `Error: ${error.message}`);
      return false;
    }
  }

  async testApiEndpoint(url, testName, method = 'GET', data = null) {
    try {
      const options = {
        method,
        headers: {
          'User-Agent': 'Cocapn-Test-Suite/1.0',
          'Content-Type': 'application/json'
        }
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);

      if (response.status >= 200 && response.status < 300) {
        this.log(testName, 'PASS', `Status: ${response.status}`);
        return true;
      } else {
        this.log(testName, 'FAIL', `Status: ${response.status}`);
        return false;
      }
    } catch (error) {
      this.log(testName, 'FAIL', `Error: ${error.message}`);
      return false;
    }
  }

  async testLogin(endpoint, testName, credentials) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const result = await response.json();

      if (response.status === 200 && result.success) {
        this.log(testName, 'PASS', `Login successful for ${credentials.username}`);
        return true;
      } else {
        this.log(testName, 'FAIL', `Login failed: ${result.error || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      this.log(testName, 'FAIL', `Error: ${error.message}`);
      return false;
    }
  }

  async testAgentFunctionality() {
    const agents = [
      { endpoint: '/api/agents/simulation', action: 'run_simulation', name: 'Simulation' },
      { endpoint: '/api/agents/ux-design', action: 'generate_design_system', name: 'UX Design' },
      { endpoint: '/api/agents/performance-optimization', action: 'run_performance_audit', name: 'Performance' },
      { endpoint: '/api/agents/analytics', action: 'generate_insights', name: 'Analytics' }
    ];

    for (const agent of agents) {
      await this.testApiEndpoint(
        `${testUrls.mainApi}${agent.endpoint}`,
        `${agent.name} Agent`,
        'POST',
        {
          action: agent.action,
          parameters: {}
        }
      );
    }
  }

  async runAllTests() {
    console.log('🧪 Starting Cocapn Hybrid IDE Deployment Tests\n');

    // Test main application
    console.log('📱 Testing Main Application:');
    await this.testUrl(testUrls.mainApp, 'Main App');
    await this.testUrl(testUrls.mainLogin, 'Main Login Page');

    // Test developer backend
    console.log('\n👨‍💻 Testing Developer Backend:');
    await this.testUrl(testUrls.devBackend, 'Dev Backend');
    await this.testUrl(testUrls.devLogin, 'Dev Login Page');

    // Test API endpoints
    console.log('\n🔧 Testing API Endpoints:');
    await this.testUrl(testUrls.mainApi, 'Main API Root');
    await this.testUrl(testUrls.devApi, 'Dev API Root');

    // Test authentication
    console.log('\n🔐 Testing Authentication:');
    await this.testLogin(
      `${testUrls.mainApi}/auth/login`,
      'Beta Tester Login',
      testCredentials.betaTester
    );

    await this.testLogin(
      `${testUrls.devApi}/auth/login`,
      'Developer Login',
      testCredentials.developer
    );

    // Test agent functionality
    console.log('\n🤖 Testing Agent Functionality:');
    await this.testAgentFunctionality();

    // Generate test report
    this.generateReport();
  }

  generateReport() {
    console.log('\n📊 Test Results Summary:');
    console.log('='.repeat(50));
    console.log(`Tests Passed: ${this.passed}`);
    console.log(`Tests Failed: ${this.failed}`);
    console.log(`Total Tests: ${this.passed + this.failed}`);
    console.log(`Success Rate: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(1)}%`);

    if (this.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(r => console.log(`  - ${r.testName}: ${r.details}`));
    }

    console.log('\n🎉 Deployment Test Complete!');
    console.log('\n💡 Next Steps:');
    if (this.failed === 0) {
      console.log('✅ All tests passed! Your deployment is ready.');
      console.log('🔑 Login Credentials:');
      console.log('   Beta Tester: magnus / tryme');
      console.log('   Developer: casey / fixme');
      console.log('🌐 Access URLs:');
      console.log('   Main App: https://cocapn.ai');
      console.log('   Dev Backend: https://cocapn.ai/dev');
    } else {
      console.log('⚠️ Some tests failed. Check the failed tests above for details.');
      console.log('🔧 Troubleshooting:');
      console.log('   1. Check deployment logs: wrangler tail');
      console.log('   2. Verify DNS configuration: nslookup cocapn.ai');
      console.log('   3. Test individual endpoints manually');
    }
  }
}

// Run tests if this script is executed directly
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DeploymentTester, testUrls, testCredentials };
}

// Run tests in browser or Node.js
if (typeof window !== 'undefined') {
  // Browser environment
  window.DeploymentTester = DeploymentTester;
  window.runTests = async () => {
    const tester = new DeploymentTester();
    await tester.runAllTests();
  };
} else {
  // Node.js environment
  const tester = new DeploymentTester();
  tester.runAllTests().catch(console.error);
}