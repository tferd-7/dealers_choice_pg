const express = require('express');
const app = express();
const methodOverride = require('method-override');

const { syncAndSeed, models: { Task } } = require('./db');

app.get('/', (req, res)=> res.redirect('/tasks'));

app.use(methodOverride('_method'));

app.delete('/tasks/:id', async(req, res, next)=> {
    try {
        const task = await Task.findByPk(req.params.id);
        await task.destroy();
        res.redirect(`/tasks/${task.category}`)
    }
    catch(ex) {
        next(ex);
    }
})

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

});

app.get('/tasks/:category', async(req, res, next)=> {
    try {
        const category = req.params.category;
        const tasks = await Task.findAll({
            where: {
                category
            }
        });
        
        res.send(`
            <html>
                <head>
                    <title>${ category } Tasks</title>
                </head>
                <body>
                    <h1>Task Master (${ tasks.length })</h1>
                    <h2><a href="/tasks"><< Back</a></h2>
                    <h3>${ category }</h3>
                    <ul>
                        ${
                            tasks.map( task => {
                                return `
                                    <li>
                                        <a href='${task.url}'>${task.name}</a>
                                        <form method='POST' action='/tasks/${task.id}?_method=DELETE'>
                                            <button>x</button>
                                        </form>
                                    </li>
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

});

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