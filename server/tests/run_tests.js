const API_URL = 'http://localhost:3001/api';

let passed = 0;
let failed = 0;

async function test(name, fn) {
    console.log(`TEST: ${name}...`);
    try {
        await fn();
        console.log(`PASS`);
        passed++;
    } catch (error) {
        console.log(`FAIL`);
        console.error(`  Error: ${error.message}`);
        if (error.response) {
            console.error(`  Response: ${JSON.stringify(error.response, null, 2)}`);
        }
        failed++;
    }
}

async function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

async function request(endpoint, method = 'GET', body = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const error = new Error(`Request failed with status ${response.status}: ${data.error || response.statusText}`);
            error.response = data;
            error.status = response.status;
            throw error;
        }

        return { status: response.status, data };
    } catch (err) {
        if (err.response) throw err;
        throw new Error(`Network/Fetch error: ${err.message}`);
    }
}

async function runTests() {
    console.log(`=== Starting TradeLink API Tests ===\n`);

    let builderId, tradesmanId, projectId, listingId;
    const builderEmail = `builder_${Date.now()}@test.com`;
    const tradesmanEmail = `tradesman_${Date.now()}@test.com`;
    const password = 'password123';

    // ============================================================================
    // AUTHENTICATION
    // ============================================================================
    console.log(`\n--- Authentication ---`);

    await test('Signup Builder', async () => {
        const res = await request('/auth/signup', 'POST', {
            name: 'Test Builder',
            email: builderEmail,
            password: password,
            role: 'builder',
            phone: '1234567890'
        });
        assert(res.status === 201, 'Status should be 201');
        assert(res.data.email === builderEmail, 'Email should match');
        assert(res.data.role === 'builder', 'Role should be builder');
        builderId = res.data.id;
    });

    await test('Signup Tradesman', async () => {
        const res = await request('/auth/signup', 'POST', {
            name: 'Test Tradesman',
            email: tradesmanEmail,
            password: password,
            role: 'tradesman',
            phone: '0987654321'
        });
        assert(res.status === 201, 'Status should be 201');
        tradesmanId = res.data.id;
    });

    await test('Login Builder (Success)', async () => {
        const res = await request('/auth/login', 'POST', {
            email: builderEmail,
            password: password,
            role: 'builder'
        });
        assert(res.status === 200, 'Status should be 200');
        assert(res.data.id === builderId, 'ID should match');
    });

    await test('Login Failure (Wrong Password)', async () => {
        try {
            await request('/auth/login', 'POST', {
                email: builderEmail,
                password: 'wrongpassword',
                role: 'builder'
            });
            throw new Error('Should have failed');
        } catch (err) {
            assert(err.status === 401, 'Status should be 401');
            assert(err.response.error === 'Incorrect password', 'Error message mismatch');
        }
    });

    await test('Login Failure (Wrong Role)', async () => {
        try {
            await request('/auth/login', 'POST', {
                email: builderEmail,
                password: password,
                role: 'tradesman' // Wrong role
            });
            throw new Error('Should have failed');
        } catch (err) {
            assert(err.status === 401, 'Status should be 401');
            assert(err.response.error.includes('Please login as a builder'), 'Error message mismatch');
        }
    });

    await test('Login Failure (Non-existent User)', async () => {
        try {
            await request('/auth/login', 'POST', {
                email: 'nonexistent@test.com',
                password: password,
                role: 'builder'
            });
            throw new Error('Should have failed');
        } catch (err) {
            assert(err.status === 404, 'Status should be 404');
            assert(err.response.error === 'Account not found', 'Error message mismatch');
        }
    });

    // ============================================================================
    // USERS
    // ============================================================================
    console.log(`\n--- Users ---`);

    await test('Get All Users', async () => {
        const res = await request('/users');
        assert(res.status === 200, 'Status should be 200');
        assert(Array.isArray(res.data), 'Data should be an array');
        assert(res.data.length >= 2, 'Should have at least 2 users');
    });

    await test('Get User by ID', async () => {
        const res = await request(`/users/${builderId}`);
        assert(res.status === 200, 'Status should be 200');
        assert(res.data.email === builderEmail, 'Email should match');
    });

    await test('Update User', async () => {
        const res = await request(`/users/${builderId}`, 'PATCH', {
            name: 'Updated Builder Name'
        });
        assert(res.status === 200, 'Status should be 200');
        assert(res.data.name === 'Updated Builder Name', 'Name should be updated');
    });

    // ============================================================================
    // PROJECTS
    // ============================================================================
    console.log(`\n--- Projects ---`);

    await test('Create Project', async () => {
        const res = await request('/projects', 'POST', {
            userId: builderId,
            title: 'Test Project',
            description: 'A test project description',
            images: ['http://example.com/image.jpg']
        });
        assert(res.status === 201, 'Status should be 201');
        assert(res.data.title === 'Test Project', 'Title should match');
        projectId = res.data.id;
    });

    await test('Get Projects for User', async () => {
        const res = await request(`/projects?userId=${builderId}`);
        assert(res.status === 200, 'Status should be 200');
        assert(Array.isArray(res.data), 'Data should be an array');
        assert(res.data.some(p => p.id === projectId), 'Project should be in list');
    });

    await test('Delete Project', async () => {
        const res = await request(`/projects/${projectId}`, 'DELETE');
        assert(res.status === 200, 'Status should be 200');
        
        // Verify deletion
        const check = await request(`/projects?userId=${builderId}`);
        assert(!check.data.some(p => p.id === projectId), 'Project should be gone');
    });

    // ============================================================================
    // TRADE LISTINGS
    // ============================================================================
    console.log(`\n--- Trade Listings ---`);

    await test('Create Trade Listing', async () => {
        const res = await request('/trade-listings', 'POST', {
            tradesmanId: tradesmanId,
            tradesmanName: 'Test Tradesman',
            tradeType: 'Plumber',
            description: 'Expert plumbing services',
            rate: 80,
            serviceAreas: ['NE', 'NW']
        });
        assert(res.status === 201, 'Status should be 201');
        assert(res.data.tradeType === 'Plumber', 'Trade type should match');
        listingId = res.data._id; // Mongoose returns _id
    });

    await test('Get Trade Listings', async () => {
        const res = await request('/trade-listings');
        assert(res.status === 200, 'Status should be 200');
        assert(Array.isArray(res.data), 'Data should be an array');
        assert(res.data.some(l => l._id === listingId), 'Listing should be in list');
    });

    await test('Update Trade Listing', async () => {
        const res = await request(`/trade-listings/${listingId}`, 'PATCH', {
            rate: 90
        });
        assert(res.status === 200, 'Status should be 200');
        assert(res.data.rate === 90, 'Rate should be updated');
    });

    await test('Delete Trade Listing', async () => {
        const res = await request(`/trade-listings/${listingId}`, 'DELETE');
        assert(res.status === 204, 'Status should be 204'); // DELETE returns 204 No Content usually, checking route...
        // Route returns 204.end()
    });

    // ============================================================================
    // MESSAGES
    // ============================================================================
    console.log(`\n--- Messages ---`);

    await test('Send Message', async () => {
        const res = await request('/messages', 'POST', {
            senderId: builderId,
            senderName: 'Test Builder',
            receiverId: tradesmanId,
            receiverName: 'Test Tradesman',
            message: 'Hello, are you available?'
        });
        assert(res.status === 201, 'Status should be 201');
        assert(res.data.message === 'Hello, are you available?', 'Content should match');
    });

    await test('Get Conversations', async () => {
        const res = await request(`/messages/conversations?userId=${builderId}`);
        assert(res.status === 200, 'Status should be 200');
        assert(Array.isArray(res.data), 'Data should be an array');
    });

    console.log(`\n=== Tests Completed ===`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);

    if (failed > 0) process.exit(1);
}

runTests().catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
});
