const db = require('./db');

const run = async() => {
    try {
        await db.syncAndSeed();
        console.log('synced and seeded');
    }
    catch(ex) {
        console.log(ex);
    }
};

run();