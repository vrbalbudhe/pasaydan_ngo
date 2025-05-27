const { spawn } = require('child_process');
const http = require('http');
const { exec } = require('child_process');

// Configuration
const SERVER_URL = 'http://localhost:3000';
const TARGET_PATH = '/pasaydan/com'; // Your specific route
const FULL_URL = SERVER_URL + TARGET_PATH;
const MAX_ATTEMPTS = 60; // Increased attempts
const CHECK_INTERVAL = 2000; // Check every 2 seconds
const INITIAL_WAIT = 8000; // Wait 8 seconds before first check

console.log('🚀 Starting Next.js development server...');

// Start Next.js server
const nextProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
});

// Handle process errors
nextProcess.on('error', (error) => {
    console.error('❌ Failed to start Next.js server:', error.message);
    process.exit(1);
});

// Wait for initial compilation
console.log(`⏳ Waiting ${INITIAL_WAIT/1000} seconds for initial compilation...`);

setTimeout(() => {
    checkServerAndLaunch();
}, INITIAL_WAIT);

function checkServerAndLaunch() {
    let attempts = 0;
    
    const checkServer = () => {
        attempts++;
        console.log(`🔍 Checking server availability... (${attempts}/${MAX_ATTEMPTS})`);
        
        // First check if base server is running
        checkUrl(SERVER_URL)
            .then(() => {
                console.log('✅ Base server is responding!');
                // Now check if our specific route is available
                return checkUrl(FULL_URL);
            })
            .then(() => {
                console.log('✅ Target route is available!');
                console.log(`🌐 Opening browser to: ${FULL_URL}`);
                openBrowser(FULL_URL);
            })
            .catch((error) => {
                if (attempts < MAX_ATTEMPTS) {
                    console.log(`⏳ Still waiting... Server not ready yet (${attempts}/${MAX_ATTEMPTS})`);
                    setTimeout(checkServer, CHECK_INTERVAL);
                } else {
                    console.log('❌ Server did not respond in time.');
                    console.log('📋 Server might be running but the specific route may not be available.');
                    console.log(`📋 Try manually opening: ${SERVER_URL}`);
                    console.log(`📋 Or the specific route: ${FULL_URL}`);
                    
                    // Try opening the base URL as fallback
                    console.log('🌐 Opening base URL as fallback...');
                    openBrowser(SERVER_URL);
                }
            });
    };
    
    checkServer();
}

function checkUrl(url) {
    return new Promise((resolve, reject) => {
        const request = http.get(url, { timeout: 5000 }, (res) => {
            // Accept any response (even errors) as long as server is responding
            resolve(res);
        });
        
        request.on('error', (error) => {
            reject(error);
        });
        
        request.on('timeout', () => {
            request.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

function openBrowser(url) {
    const platform = process.platform;
    let command;
    
    switch (platform) {
        case 'win32':
            command = `start "" "${url}"`;
            break;
        case 'darwin':
            command = `open "${url}"`;
            break;
        case 'linux':
            command = `xdg-open "${url}"`;
            break;
        default:
            console.log(`❌ Unsupported platform: ${platform}`);
            console.log(`📋 Please manually open: ${url}`);
            return;
    }
    
    exec(command, (error) => {
        if (error) {
            console.error('❌ Failed to open browser automatically:', error.message);
            console.log(`📋 Please manually open: ${url}`);
        } else {
            console.log('✅ Browser launched successfully!');
        }
    });
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...');
    if (nextProcess && !nextProcess.killed) {
        nextProcess.kill('SIGINT');
    }
    process.exit(0);
});

// Handle process termination
process.on('SIGTERM', () => {
    console.log('\n🛑 Process terminated...');
    if (nextProcess && !nextProcess.killed) {
        nextProcess.kill('SIGTERM');
    }
    process.exit(0);
});