import app from './server.js';
import client from './db.js';

async function main() {
    const port = 8000;

    try {
        client.connect();
        app.listen(port, () => {
            console.log("Server is running on port " + port);
        });
    } catch (e) {
        console.error('error ', e.stack)
        process.exit(1);
    };
}

main().catch(console.error);