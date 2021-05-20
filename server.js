const express = require('express');
const app = express();

const { syncAndSeed, models: { Task } } = require('./db');

app.get('/', (req, res)=> res.redirect('/tasks'));

app.get('/tasks', async(req, res, next)=> {
    try {
        const tasks = await Task.findAll();
        const reduced = tasks.reduce((acc, task) => {
            const key = task.category;
            acc[key] = acc[key] || [];
            acc[key].push(task);
            return acc;
        }, {})
        res.send(`
            <html>
                <head>
                    <title>Tasks</title>
                </head>
                <body>
                    <h1>Task Master (${tasks.length})</h1>
                    <ul>
                        ${
                            Object.entries(reduced).map( entry => {
                                const category = entry[0];
                                const tasks =  entry[1];
                                return `
                                <a href='/tasks/${category}'><li>${category} (${tasks.length})</li></a>
                                `
                            }).join('')
                        }
                    </ul>


                </body>
            </html>
        
        `);

    }
    catch(ex) {
        next(ex);
    }

})

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