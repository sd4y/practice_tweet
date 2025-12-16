const fs = require('fs');
const path = require('path');

const dbEnvPath = path.join(__dirname, 'packages', 'database', '.env');
const apiEnvPath = path.join(__dirname, 'apps', 'api', '.env');

const dbUrl = 'DATABASE_URL="postgresql://postgres:jg1130649@localhost:5432/twitter_clone?schema=public"';
const jwtSecret = 'JWT_SECRET="super-secret-jwt-key-change-me"';

try {
    fs.writeFileSync(dbEnvPath, dbUrl, 'utf8');
    console.log(`Updated ${dbEnvPath}`);

    fs.writeFileSync(apiEnvPath, `${dbUrl}\n${jwtSecret}`, 'utf8');
    console.log(`Updated ${apiEnvPath}`);
} catch (error) {
    console.error('Error writing .env files:', error);
    process.exit(1);
}
