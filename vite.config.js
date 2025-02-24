// filepath: [vite.config.js](http://_vscodecontentref_/4)
import { defineConfig } from 'vite';

export default defineConfig({
    root: 'public', //this got added
    server: {
        proxy: {
            '/socket.io': {
                target: 'http://localhost:3000',
                ws: true
            },
            // '/api': 'http://localhost:3000'  // Proxy API calls to your Express server //?
        }
    }
});