const sequel = require('sequelize');
const conn = new sequel("trabalhoppw","root","",{
    host:"localhost",
    dialect:"mysql",
});

module.exports = conn;