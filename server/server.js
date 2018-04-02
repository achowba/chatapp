const path = require('path');
const express = require('express');

const app = express();
const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

const port = process.env.PORT || 5000;
const date = new Date;
app.listen(port, () => {
    console.log(`Server running on port ${port} at ${date.toLocaleTimeString()}`);
});
