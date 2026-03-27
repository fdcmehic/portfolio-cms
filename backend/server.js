require('dotenv').config({ quiet: true });
let cors = require('cors');
let express = require('express');
let app = express();
const imageRouter = require('./routes/images');

app.use(cors({origin: '*'}));
app.use(express.json());
app.use('/images', imageRouter);

app.listen(3000, () => {
    console.log('Server running on port 3000.')
});