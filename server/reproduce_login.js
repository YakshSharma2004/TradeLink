const API_URL = 'http://localhost:3001/api/auth/login';

async function testLogin() {
  try {
    console.log('Attempting login with CORRECT credentials...');
    const correctRes = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john@builder.com',
        role: 'builder',
        name: 'John Builder'
      })
    });
    console.log('Correct login success:', correctRes.status === 200);
    if (correctRes.status !== 200) {
        console.log('Correct login failed with:', await correctRes.text());
    }

    console.log('\nAttempting login with INCORRECT name...');
    const incorrectRes = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john@builder.com',
        role: 'builder',
        name: 'Wrong Name'
      })
    });

    if (incorrectRes.status === 404) {
        console.log('Incorrect login SUCCESS (Expected 404)');
    } else {
        console.log('Incorrect login FAILED (Unexpected success or other error)');
        console.log('Status:', incorrectRes.status);
        console.log('Response:', await incorrectRes.text());
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testLogin();
