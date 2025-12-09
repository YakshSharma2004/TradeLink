const API_URL = 'http://localhost:3001/api';

async function debugLogin() {
    console.log('Attempting login with non-existent user...');
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'nonexistent@test.com',
                password: 'password',
                role: 'builder'
            })
        });

        console.log(`Status: ${response.status} ${response.statusText}`);
        const text = await response.text();
        console.log('Raw Response Body:');
        console.log(text);
        
        try {
            const json = JSON.parse(text);
            console.log('Parsed JSON:', json);
        } catch (e) {
            console.log('Failed to parse JSON');
        }

    } catch (err) {
        console.error('Fetch error:', err);
    }
}

debugLogin();
