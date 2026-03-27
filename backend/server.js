require('dotenv').config({ quiet: true });
const cors = require('cors');
const express = require('express');
const app = express();
const imageRouter = require('./routes/images');
const authRouter = require('./routes/auth')
const authenticateToken = require('./middleware/auth')

app.use(cors({origin: '*'}));
app.use(express.json());
app.use('/auth', authRouter)
app.use('/images', authenticateToken, imageRouter);

app.listen(3000, () => {
    console.log('Server running on port 3000.')
});