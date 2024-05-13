import {client} from './server.js';

async function main() {
    try {
        client.connect();
    } catch (e) {
        console.error('error ', e.stack)
    };
}