const express = require('express');
const app = express();
const methodOverride = require('method-override');

const { syncAndSeed, models: { Task } } = require('./db');

app.get('/', (req, res)=> res.redirect('/tasks'));

app.use(methodOverride('_method'));

app.use('/tasks', require('./routes/tasks'));

const run = async() => {
    try {
        await syncAndSeed();
        console.log('synced and seeded');
        const port = process.env.PORT || 2900;
        app.listen(port, () => console.log(`listening on port ${port}`));
    }
    catch(ex) {
        console.log(ex);
    }
};

run();