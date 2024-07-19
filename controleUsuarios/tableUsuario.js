const sequel = require("sequelize");
const conn = require("../database/db");

const usuario = conn.define("usuario",{
    id:{
        type:sequel.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    nome:{
        type:sequel.STRING,
        allowNull:false
    },
    slug:{
        type:sequel.STRING,
        allowNull:false
    },
    email:{
        type:sequel.STRING,
        allowNull:false
    },
    senha:{
        type:sequel.STRING,
        allowNull:false
    },
    voto: {
        type: sequel.ENUM,
        values: ["neutro", "delphi", "naodelphi"],
        allowNull: false
    },
});

usuario.sync();

module.exports = usuario;