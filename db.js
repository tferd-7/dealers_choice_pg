const Sequelize = require('sequelize');
const { STRING } = Sequelize.DataTypes;

const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/dealers_choice_pg_db');

const data = [
    { name: 'Find a place to move to', category: 'Personal', url: 'https://www.zillow.com/' },
    { name: 'Either drip or drown', category: 'Personal', url: 'https://www.hermes.com/us/en/' },
    { name: 'Become the Wolf Of Wall Street', category: 'Financial', url: 'https://www.webull.com/' },
    { name: "Become a crypto gazillionaire so I don't have to get a job", category:'Financial', url: 'https://www.coinbase.com/' },
    { name: "I need a job but don't want to have to work", category: 'Professional', url: 'https://www.fec.gov/help-candidates-and-committees/registering-candidate/' },
    { name: "Become the next Elizabeth Holmes", category: 'Professional', url: 'https://angel.co/' }
]

const Task = conn.define('task', {
    name: STRING,
    category: STRING,
    url: STRING
});

const syncAndSeed = async() => {
    await conn.sync({ force: true });
    await Promise.all(
        data.map( task => Task.create(task))
    );

};

module.exports = {
    syncAndSeed
};