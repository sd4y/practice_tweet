const net = require('net');

const port = 5432;
const client = new net.Socket();

client.setTimeout(2000);

console.log(`Checking port ${port}...`);

client.connect(port, '127.0.0.1', function() {
    console.log(`Port ${port} is OPEN. PostgreSQL is likely running.`);
    client.destroy();
});

client.on('error', function(e) {
    console.log(`Port ${port} is CLOSED or unreachable. Error: ${e.message}`);
    console.log("Please make sure PostgreSQL is installed and running.");
    client.destroy();
});

client.on('timeout', function() {
    console.log(`Port ${port} TIMEOUT.`);
    client.destroy();
});
