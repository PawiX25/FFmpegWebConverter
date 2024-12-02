const express = require('express');
const app = express();
const port = 3000;

app.use((req, res, next) => {
    res.header('Cross-Origin-Opener-Policy', 'same-origin');
    res.header('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});

app.use(express.static('./'));
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
