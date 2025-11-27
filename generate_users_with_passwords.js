const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'server', 'data', 'tradelink.users.json');
const outputPath = path.join(__dirname, 'server', 'data', 'tradelink.users_with_passwords.json');

try {
    const rawData = fs.readFileSync(inputPath, 'utf8');
    const users = JSON.parse(rawData);

    const usersWithPasswords = users.map(user => ({
        ...user,
        password: 'password123' // Default password for migration
    }));

    fs.writeFileSync(outputPath, JSON.stringify(usersWithPasswords, null, 2));
    console.log(`Successfully created ${outputPath} with ${usersWithPasswords.length} users.`);
} catch (err) {
    console.error('Error processing file:', err);
}
